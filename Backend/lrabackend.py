from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# --- Use your Google API Key (as an environment variable) ---
# 1. Get your key from Google AI Studio
# 2. Paste your NEW, REVOKED key here:
os.environ["GOOGLE_API_KEY"] = "PASTE_YOUR_NEW_API_KEY_HERE"
# -----------------------------------------------------------

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate  # <-- This is correct
from langchain_google_genai import ChatGoogleGenerativeAI  # <-- Import Gemini
from langchain_community.memory import ConversationBufferWindowMemory # <-- THIS IS THE FIX
from langchain.chains import ConversationalRetrievalChain
from google.generativeai.types import HarmCategory, HarmBlockThreshold

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}}, supports_credentials=True)

# Load HuggingFace Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="nomic-ai/nomic-embed-text-v1",
    model_kwargs={"trust_remote_code": True, "revision": "289f532e14dbbbd5a04753fa58739e9ba766f3c7"}
)

# Load FAISS DB
try:
    db = FAISS.load_local("ipc_vector_db", embeddings, allow_dangerous_deserialization=True)
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})
except Exception as e:
    print(f"Error loading FAISS DB: {e}")
    # Handle error appropriately, maybe exit or set retriever to None
    retriever = None

# Prompt
prompt_template = """
You are a knowledgeable and professional Legal Research Assistant trained in the Indian Penal Code (IPC).

Given the case description and IPC context, identify the most relevant IPC section(s). Your tone should be confident yet approachable.

Your response should:
- Start directly with the applicable IPC section(s) and their titles — no preface like "You might be charged..."
- Provide a brief, human-readable explanation of the offense.
- Mention the punishment clearly.
- Optionally add a note about related sections (e.g., Section 338 if hurt becomes grievous).
- Avoid robotic or speculative phrasing.
- DO NOT use "You:", "It seems", or "Based on your case".

Context:
{context}

Case:
{question}

Chat history (if any):
{chat_history}

Respond only with applicable IPC section(s), an explanation, and punishment. Keep the tone informative and slightly conversational, but professional.
"""
prompt = PromptTemplate.from_template(prompt_template)

# --- Swapped to Gemini ---
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    # google_api_key is now read from the environment variable set above
    temperature=0.5,
    convert_system_message_to_human=True,  # Helps with prompts like yours
    safety_settings={  # Adjust safety settings to be less restrictive
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }
)
# -------------------------

# Memory
memory = ConversationBufferWindowMemory(k=2, memory_key="chat_history", return_messages=True)

# Chain
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    combine_docs_chain_kwargs={"prompt": prompt}
)


def is_ipc_related(question):
    keywords = ["ipc", "penal code", "indian penal code", "section", "crime", "offense", "punishment", "law", "repercussion", "legal"]
    return any(k in question.lower() for k in keywords)


@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    if not retriever:
        return jsonify({'success': False, 'message': 'Error: Vector database not loaded.'}), 500

    data = request.json
    user_message = data.get('message', '').strip()

    if is_ipc_related(user_message):
        try:
            result = qa_chain.invoke({"question": user_message})
            return jsonify({'success': True, 'message': result['answer']})
        except Exception as e:
            print(f"Error during chain invocation: {e}")  # Log the full error
            return jsonify({'success': False, 'message': f"An error occurred: {e}"})
    else:
        return jsonify({
            'success': False,
            'message': "I am designed to answer questions specifically related to the Indian Penal Code (IPC). Please ask an IPC-related question."
        })


@app.route('/reset', methods=['POST'])
def reset_conversation():
    global memory
    memory.clear()
    return jsonify({'success': True, 'message': 'Conversation reset successfully'})


if __name__ == '__main__':
    # Check the environment variable now
    if os.environ.get("GOOGLE_API_KEY") == "PASTE_YOUR_NEW_API_KEY_HERE" or not os.environ.get("GOOGLE_API_KEY"):
        print("=" * 50)
        print("WARNING: Please paste your Google API Key into the OS environment variable 'GOOGLE_API_KEY'.")
        print("=" * 50)

    if not retriever:
        print("=" * 50)
        print("WARNING: FAISS Vector DB 'ipc_vector_db' not found or failed to load.")
        print("Please ensure the vector database is in the same directory.")
        print("=" * 50)

    app.run(debug=True, port=5000)

