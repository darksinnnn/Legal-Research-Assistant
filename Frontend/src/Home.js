import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaStop, FaPaperPlane, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './Home.css';

// Home component styles
const styles = {
  container: (offset) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(
      ${offset}deg,
      rgba(75, 75, 212, 0.9),
      rgba(79, 41, 89, 0.95),
      rgba(138, 43, 226, 0.9)
    )`,
    backgroundSize: '200% 200%',
    color: '#ffffff',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  }),
  
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 2.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  logoTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '1px',
    margin: 0,
    background: 'linear-gradient(45deg, #ffffff, #e0f7fa)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  
  navLink: {
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.85)',
    padding: '0.7rem 1.2rem',
    borderRadius: '8px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    position: 'relative',
  },
  
  logoutButton: {
    padding: '0.7rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    letterSpacing: '0.5px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    width: '100%',
  },
  
  heroSection: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
    background: 'linear-gradient(45deg, #ffffff, #b3e5fc)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
    letterSpacing: '1px',
  },
  
  heroText: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  
  inputSection: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    marginBottom: '3rem',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#008080',
    textAlign: 'center',
    fontWeight: 600,
  },
  
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  textarea: {
    width: '100%',
    padding: '1.2rem',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1rem',
    minHeight: '150px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  textareaFocus: {
    outline: 'none',
    borderColor: '#008080',
    boxShadow: '0 0 0 3px rgba(0, 128, 128, 0.2)',
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '1.2rem',
    justifyContent: 'center',
  },
  
  button: {
    padding: '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  
  submitButton: {
    backgroundColor: '#008080',
    color: 'white',
    flex: 1,
    maxWidth: '200px',
  },
  
  speechButton: {
    backgroundColor: '#4a90e2',
    color: 'white',
    flex: 1,
    maxWidth: '250px',
  },
  
  listeningButton: {
    backgroundColor: '#dc3545',
  },
  
  chargesSection: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    marginTop: '2rem',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  chargesOutput: {
    whiteSpace: 'pre-wrap',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    lineHeight: 1.8,
    color: '#333333',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  
  footer: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '2rem',
    marginTop: 'auto',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  disclaimer: {
    maxWidth: '800px',
    margin: '0 auto 1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  
  copyright: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
  },

  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '8px',
  },
  
  // Media query styles - applied conditionally
  responsive: {
    navbar: {
      padding: '1rem',
      flexDirection: 'column',
      gap: '1rem',
    },
    navLinks: {
      flexDirection: 'column',
      gap: '0.8rem',
      width: '100%',
    },
    navLink: {
      width: '100%',
      textAlign: 'center',
    },
    buttonGroup: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    submitButton: {
      maxWidth: '100%',
      width: '100%',
    },
    speechButton: {
      maxWidth: '100%',
      width: '100%',
    },
    heroTitle: {
      fontSize: '2rem',
    },
    inputSection: {
      padding: '1.5rem',
    },
    chargesSection: {
      padding: '1.5rem',
    }
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      when: "beforeChildren" 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 50
    }
  }
};

// CSS keyframes as a string to be injected
const keyframes = `
  @keyframes floatingElement {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    50% { transform: scale(1.05); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); }
    100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .listening-indicator::before {
    content: '●';
    color: white;
    margin-right: 0.5rem;
    animation: pulse 1.5s infinite;
  }
`;

const Home = () => {
  const [problemInput, setProblemInput] = useState('');
  const [legalCharges, setLegalCharges] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  
  // Inject keyframes into document
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Initialize speech recognition if supported
    if (window.webkitSpeechRecognition) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setProblemInput(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    // Background gradient animation
    const intervalId = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % 360);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  const handleStartSpeechRecognition = () => {
    if (recognition) {
      if (!isListening) {
        recognition.start();
        setIsListening(true);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemInput.trim()) return;
    
    console.log('Submit button clicked');
    setIsLoading(true);
    
    try {
      // API call to the backend to get legal charges
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: problemInput }),
      });
      const data = await response.json();
      if (data.success) {
        setLegalCharges(data.message);
      } else {
        setLegalCharges(data.message);
      }
    } catch (error) {
      console.error('Error fetching legal charges:', error);
      setLegalCharges("Sorry, there was an error processing your request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={styles.container(offset)}>
      <motion.nav 
        style={isMobile ? {...styles.navbar, ...styles.responsive.navbar} : styles.navbar}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.logo}>
          <motion.h1
            style={styles.logoTitle}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          > 
            ⚖️ LEGAL RESEARCH ASSISTANT
          </motion.h1>
        </div>
        <motion.div 
          style={isMobile ? {...styles.navLinks, ...styles.responsive.navLinks} : styles.navLinks}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.a 
            href="#services"
            style={isMobile ? {...styles.navLink, ...styles.responsive.navLink} : styles.navLink}
            whileHover={{ 
              color: 'white',
              scale: 1.05 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Services
          </motion.a>
          <motion.a 
            href="#about"
            style={isMobile ? {...styles.navLink, ...styles.responsive.navLink} : styles.navLink}
            whileHover={{ 
              color: 'white',
              scale: 1.05 
            }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.a>
          <motion.a 
            href="#contact"
            style={isMobile ? {...styles.navLink, ...styles.responsive.navLink} : styles.navLink}
            whileHover={{ 
              color: 'white',
              scale: 1.05 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.a>
          <motion.button 
            onClick={handleLogout} 
            style={styles.logoutButton}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              y: -3,
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </motion.div>
      </motion.nav>

      <main style={styles.mainContent}>
        <motion.section 
          style={styles.heroSection}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileInView={{ 
            y: [0, -10, 0],
            transition: { 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <motion.h2 
            style={isMobile ? {...styles.heroTitle, ...styles.responsive.heroTitle} : styles.heroTitle}
            variants={itemVariants}
          >
            Your Legal Research Assistant
          </motion.h2>
          <motion.p 
            style={styles.heroText}
            variants={itemVariants}
          >
            Simplifying legal research through advanced technology
          </motion.p>
        </motion.section>

        <motion.section 
          style={isMobile ? {...styles.inputSection, ...styles.responsive.inputSection} : styles.inputSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ 
            y: -5,
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)'
          }}
        >
          <motion.h3
            style={styles.sectionTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Describe Your Legal Problem
          </motion.h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <motion.textarea
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                onFocus={() => setIsTextareaFocused(true)}
                onBlur={() => setIsTextareaFocused(false)}
                placeholder="Provide a detailed description of your legal issue..."
                rows="8"
                style={isTextareaFocused ? 
                  {...styles.textarea, ...styles.textareaFocus} : 
                  styles.textarea
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.div 
                style={isMobile ? {...styles.buttonGroup, ...styles.responsive.buttonGroup} : styles.buttonGroup}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.button 
                  type="submit" 
                  style={isMobile ? 
                    {...styles.button, ...styles.submitButton, ...styles.responsive.submitButton} : 
                    {...styles.button, ...styles.submitButton}
                  }
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: '#006666',
                    y: -3,
                    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.15)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      SUBMIT
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleStartSpeechRecognition}
                  style={isMobile ? 
                    {
                      ...styles.button, 
                      ...styles.speechButton, 
                      ...styles.responsive.speechButton,
                      ...(isListening && styles.listeningButton)
                    } : 
                    {
                      ...styles.button, 
                      ...styles.speechButton,
                      ...(isListening && styles.listeningButton)
                    }
                  }
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: isListening ? '#c82333' : '#357abd',
                    y: -3,
                    boxShadow: '0 7px 14px rgba(0, 0, 0, 0.15)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 4px 8px rgba(0, 0, 0, 0.1)',
                      '0 8px 16px rgba(0, 0, 0, 0.15)',
                      '0 4px 8px rgba(0, 0, 0, 0.1)'
                    ],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  } : {}}
                  className={isListening ? 'listening-indicator' : ''}
                >
                  {isListening ? (
                    <>
                      <FaStop />
                      Stop Recognition
                    </>
                  ) : (
                    <>
                      <FaMicrophone />
                      Start Speech Recognition
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </form>
        </motion.section>

        {legalCharges && (
          <motion.section 
            style={isMobile ? {...styles.chargesSection, ...styles.responsive.chargesSection} : styles.chargesSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              y: -5,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)'
            }}
          >
            <motion.h3
              style={styles.sectionTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Legal Charges
            </motion.h3>
            <motion.div 
              style={styles.chargesOutput}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {legalCharges}
            </motion.div>
          </motion.section>
        )}
      </main>

      <motion.footer 
        style={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div style={styles.disclaimer}>
          Disclaimer: The Legal Research Assistant platform is designed to assist with legal research 
          and does not provide legal advice. 
        </div>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} Legal Research Assistant. All Rights Reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;