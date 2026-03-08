# from langchain_community.embeddings.ollama import OllamaEmbeddings

# def get_embedding_function():
#     embeddings = OllamaEmbeddings(model="nomic-embed-text")  # Specify the local model for embeddings
#     return embeddings
#  # Customize any parameters as required for Ollama

#     # Optional: Test the embedding function
#     try:
#         sample_embedding = embeddings.embed_query("Hello")
#         print(f"Sample Embedding: {sample_embedding[:5]}...")  # Print first 5 elements
#     except Exception as e:
#         print(f"Error: {e}")

#     return embeddings
from langchain_community.embeddings.ollama import OllamaEmbeddings

def get_embedding_function():
    # Instantiate embeddings with the locally stored Mistral model
    embeddings = OllamaEmbeddings(model="mistral")  # Specify the local model for embeddings

    # Optional: Test the embedding function
    try:
        sample_embedding = embeddings.embed_query("Hello")
        print(f"Sample Embedding: {sample_embedding[:5]}...")  # Print the first 5 elements
    except Exception as e:
        print(f"Error: {e}")

    return embeddings
