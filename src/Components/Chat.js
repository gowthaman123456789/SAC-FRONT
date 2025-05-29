import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaRobot, FaTimes, FaComment } from 'react-icons/fa';
import '../Styles/Chat.css';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const salesData = [
    { site: '11307', ProductCategoryName: 'Alcohol', ProductName: 'Low Calorie Beer', SalesManagerName: 'John Minker', StateName: 'California', Sales: 162.10 },
    { site: '', ProductCategoryName: 'Juices', ProductName: 'Apple Jules', SalesManagerName: 'John Minker', StateName: 'California', Sales: 113.40 },
    { site: '11208', ProductCategoryName: 'Energy Drinks', ProductName: 'Monster', SalesManagerName: 'James Frank', StateName: 'Oregon', Sales: 63.40 },
    { site: '11309', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Orange Crush', SalesManagerName: 'Nancy Miller', StateName: 'California', Sales: 155.49 },
    { site: '11311', ProductCategoryName: 'Energy Drinks', ProductName: 'Monster', SalesManagerName: 'David Carl', StateName: 'California', Sales: 84.34 },
    { site: '11312', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Ginger Ale', SalesManagerName: 'Gary Dumin', StateName: 'California', Sales: 134.78 },
    { site: '11408', ProductCategoryName: 'Alcohol', ProductName: 'Dark Beer', SalesManagerName: 'Lois Wood', StateName: 'California', Sales: 76.54 },
    { site: '11409', ProductCategoryName: 'Juices', ProductName: 'Mango Jules', SalesManagerName: 'David Carl', StateName: 'Oregon', Sales: 78.46 },
    { site: '11412', ProductCategoryName: 'Alcohol', ProductName: 'Dark Beer', SalesManagerName: 'John Minker', StateName: 'California', Sales: 78.95 },
    { site: '', ProductCategoryName: '', ProductName: 'Mixed Drinks', SalesManagerName: 'Janet Bury', StateName: 'California', Sales: 134.06 },
    { site: '11511', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Ginger Ale', SalesManagerName: 'Janet Bury', StateName: 'California', Sales: 129.93 }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        addMessage('Sorry, I encountered an error with voice recognition.', 'bot');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      addMessage('Hello! I\'m your SAP Analytics assistant. How can I help you today?', 'bot');
    }
  };

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender, id: Date.now() }]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      processQuery(inputValue);
      setInputValue('');
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      addMessage('Listening...', 'bot');
    }
  };

  const simulateTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      callback();
      setIsTyping(false);
    }, 1000);
  };

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('site')) {
      const siteMatch = query.match(/\d{5,6}/);
      const site = siteMatch ? siteMatch[0] : null;

      if (site) {
        const results = salesData.filter((item) => item.site === site);
        simulateTyping(() => {
          if (results.length > 0) {
            const response = `Here are the records for site ${site}:\n\n` +
              results.map((item) =>
                `${item.ProductCategoryName || 'N/A'} - ${item.ProductName}: $${item.Sales.toFixed(2)}`
              ).join('\n');
            addMessage(response, 'bot');
          } else {
            addMessage(`No records found for site ${site}`, 'bot');
          }
        });
      } else {
        addMessage('Please specify a site number to search for', 'bot');
      }
    } else {
      simulateTyping(() => {
        addMessage('I can help you query sales data. Try asking about a specific site, product category, or sales manager.', 'bot');
      });
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={toggleChat}>
        <FaComment className="chat-icon" />
        <span>Chat with me!</span>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-title">
              <FaRobot className="bot-icon" />
              <h3>SAP Analytics Assistant</h3>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your question..."
            />
            <button
              type="button"
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title="Voice input"
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button type="submit" className="send-btn" title="Send message">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;

// import React, { useState, useEffect, useRef } from 'react';
// import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaRobot, FaTimes, FaComment } from 'react-icons/fa';
// import { BsSendFill } from 'react-icons/bs';
// import { IoMdClose } from 'react-icons/io';
// import '../Styles/Chat.css';

// const Chat = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // Sample data from your image
//   const salesData = [
//     { site: '11307', ProductCategoryName: 'Alcohol', ProductName: 'Low Calorie Beer', SalesManagerName: 'John Minker', StateName: 'California', Sales: 162.10 },
//     { site: '', ProductCategoryName: 'Juices', ProductName: 'Apple Jules', SalesManagerName: 'John Minker', StateName: 'California', Sales: 113.40 },
//     { site: '11208', ProductCategoryName: 'Energy Drinks', ProductName: 'Monster', SalesManagerName: 'James Frank', StateName: 'Oregon', Sales: 63.40 },
//     { site: '11309', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Orange Crush', SalesManagerName: 'Nancy Miller', StateName: 'California', Sales: 155.49 },
//     { site: '11311', ProductCategoryName: 'Energy Drinks', ProductName: 'Monster', SalesManagerName: 'David Carl', StateName: 'California', Sales: 84.34 },
//     { site: '11312', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Ginger Ale', SalesManagerName: 'Gary Dumin', StateName: 'California', Sales: 134.78 },
//     { site: '11408', ProductCategoryName: 'Alcohol', ProductName: 'Dark Beer', SalesManagerName: 'Lois Wood', StateName: 'California', Sales: 76.54 },
//     { site: '11409', ProductCategoryName: 'Juices', ProductName: 'Mango Jules', SalesManagerName: 'David Carl', StateName: 'Oregon', Sales: 78.46 },
//     { site: '11412', ProductCategoryName: 'Alcohol', ProductName: 'Dark Beer', SalesManagerName: 'John Minker', StateName: 'California', Sales: 78.95 },
//     { site: '', ProductCategoryName: '', ProductName: 'Mixed Drinks', SalesManagerName: 'Janet Bury', StateName: 'California', Sales: 134.06 },
//     { site: '11511', ProductCategoryName: 'Carbonated Drinks', ProductName: 'Ginger Ale', SalesManagerName: 'Janet Bury', StateName: 'California', Sales: 129.93 }
//   ];

//   // Initialize speech recognition
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window) {
//       recognitionRef.current = new window.webkitSpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInputValue(transcript);
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error', event.error);
//         setIsListening(false);
//         addMessage('Sorry, I encountered an error with voice recognition.', 'bot');
//       };

//       recognitionRef.current.onend = () => {
//         if (isListening) {
//           setIsListening(false);
//         }
//       };
//     } else {
//       console.warn('Speech recognition not supported');
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen && messages.length === 0) {
//       addMessage('Hello! I\'m your SAP Analytics assistant. How can I help you today?', 'bot');
//     }
//   };

//   const addMessage = (text, sender) => {
//     const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     setMessages(prev => [...prev, { text, sender, id: Date.now(), timestamp }]);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (inputValue.trim()) {
//       addMessage(inputValue, 'user');
//       processQuery(inputValue);
//       setInputValue('');
//     }
//   };

//   const toggleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       addMessage('Voice recognition is not supported in your browser.', 'bot');
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       setInputValue('');
//       recognitionRef.current.start();
//       setIsListening(true);
//       addMessage('Listening... Speak now.', 'bot');
//     }
//   };

//   const simulateTyping = (callback) => {
//     setIsTyping(true);
//     setTimeout(() => {
//       callback();
//       setIsTyping(false);
//     }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
//   };

//   const processQuery = (query) => {
//     const lowerQuery = query.toLowerCase();
    
//     // Show available commands
//     if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
//       simulateTyping(() => {
//         const helpText = `I can help you with:\n
// - Show sales by site (e.g., "show sales for site 11307")
// - Show sales by product category (e.g., "show alcohol sales")
// - Show sales by state (e.g., "show sales in California")
// - Show sales by manager (e.g., "show sales by John Minker")
// - Show top products (e.g., "show top 5 products")`;
//         addMessage(helpText, 'bot');
//       });
//       return;
//     }

//     // Check for site queries
//     const siteMatch = query.match(/(?:site|store)\s*(\d{4,6})/i);
//     if (siteMatch) {
//       const site = siteMatch[1];
//       simulateTyping(() => {
//         const results = salesData.filter(item => item.site === site);
//         if (results.length > 0) {
//           const totalSales = results.reduce((sum, item) => sum + item.Sales, 0);
//           const response = `Sales data for site ${site}:\n\n` +
//             results.map(item => 
//               `• ${item.ProductCategoryName || 'N/A'} - ${item.ProductName}: $${item.Sales.toFixed(2)}`
//             ).join('\n') +
//             `\n\nTotal sales: $${totalSales.toFixed(2)}`;
//           addMessage(response, 'bot');
//         } else {
//           addMessage(`No records found for site ${site}.`, 'bot');
//         }
//       });
//       return;
//     }

//     // Check for product category queries
//     const categoryMatch = query.match(/(?:category|show)\s*(alcohol|juices|energy drinks|carbonated drinks)/i);
//     if (categoryMatch) {
//       const category = categoryMatch[1];
//       simulateTyping(() => {
//         const results = salesData.filter(item => 
//           item.ProductCategoryName && item.ProductCategoryName.toLowerCase().includes(category.toLowerCase())
//         );
        
//         if (results.length > 0) {
//           const totalSales = results.reduce((sum, item) => sum + item.Sales, 0);
//           const response = `Sales data for ${category}:\n\n` +
//             results.map(item => 
//               `• ${item.ProductName} (${item.StateName}): $${item.Sales.toFixed(2)}`
//             ).join('\n') +
//             `\n\nTotal ${category} sales: $${totalSales.toFixed(2)}`;
//           addMessage(response, 'bot');
//         } else {
//           addMessage(`No records found for product category "${category}".`, 'bot');
//         }
//       });
//       return;
//     }

//     // Check for state queries
//     const stateMatch = query.match(/(?:in|for|state)\s*(california|oregon)/i);
//     if (stateMatch) {
//       const state = stateMatch[1];
//       simulateTyping(() => {
//         const results = salesData.filter(item => 
//           item.StateName && item.StateName.toLowerCase().includes(state.toLowerCase())
//         );
        
//         if (results.length > 0) {
//           const totalSales = results.reduce((sum, item) => sum + item.Sales, 0);
//           const response = `Sales data for ${state}:\n\n` +
//             results.map(item => 
//               `• ${item.ProductName} (${item.ProductCategoryName}): $${item.Sales.toFixed(2)}`
//             ).join('\n') +
//             `\n\nTotal sales in ${state}: $${totalSales.toFixed(2)}`;
//           addMessage(response, 'bot');
//         } else {
//           addMessage(`No records found for state "${state}".`, 'bot');
//         }
//       });
//       return;
//     }

//     // Check for sales manager queries
//     const managerMatch = query.match(/(?:by|manager)\s*(John Minker|James Frank|Nancy Miller|David Carl|Gary Dumin|Lois Wood|Janet Bury)/i);
//     if (managerMatch) {
//       const manager = managerMatch[1];
//       simulateTyping(() => {
//         const results = salesData.filter(item => 
//           item.SalesManagerName && item.SalesManagerName.toLowerCase().includes(manager.toLowerCase())
//         );
        
//         if (results.length > 0) {
//           const totalSales = results.reduce((sum, item) => sum + item.Sales, 0);
//           const response = `Sales data for manager ${manager}:\n\n` +
//             results.map(item => 
//               `• ${item.ProductName} (${item.StateName}): $${item.Sales.toFixed(2)}`
//             ).join('\n') +
//             `\n\nTotal sales by ${manager}: $${totalSales.toFixed(2)}`;
//           addMessage(response, 'bot');
//         } else {
//           addMessage(`No records found for manager "${manager}".`, 'bot');
//         }
//       });
//       return;
//     }

//     // Check for top products query
//     const topMatch = query.match(/top\s*(\d+)?/i);
//     if (topMatch) {
//       const limit = topMatch[1] ? parseInt(topMatch[1]) : 5;
//       simulateTyping(() => {
//         // Sort by sales descending
//         const sorted = [...salesData].sort((a, b) => b.Sales - a.Sales);
//         const topResults = sorted.slice(0, limit);
        
//         const response = `Top ${limit} products by sales:\n\n` +
//           topResults.map((item, index) => 
//             `${index + 1}. ${item.ProductName} (${item.ProductCategoryName}): $${item.Sales.toFixed(2)}`
//           ).join('\n');
//         addMessage(response, 'bot');
//       });
//       return;
//     }

//     // Default response for unrecognized queries
//     simulateTyping(() => {
//       addMessage('I can help you analyze sales data. Try asking about a specific site, product category, state, or sales manager. Type "help" to see what I can do.', 'bot');
//     });
//   };

//   return (
//     <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
//       <button className="chatbot-toggle" onClick={toggleChat}>
//         <span className="chat-icon"><FaComment /></span>
//         <span>Analytics Assistant</span>
//       </button>
      
//       {isOpen && (
//         <div className="chatbot-window">
//           <div className="chatbot-header">
//             <div className="header-title">
//               <FaRobot className="bot-icon" />
//               <h3>SAP Analytics Assistant</h3>
//             </div>
//             <button className="close-btn" onClick={toggleChat}>
//               <IoMdClose />
//             </button>
//           </div>
          
//           <div className="chatbot-messages">
//             {messages.map((message) => (
//               <div key={message.id} className={`message ${message.sender}`}>
//                 <div className="message-content">{message.text}</div>
//                 <div className="message-timestamp">{message.timestamp}</div>
//               </div>
//             ))}
//             {isTyping && (
//               <div className="message bot">
//                 <div className="typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
          
//           <form onSubmit={handleSubmit} className="chatbot-input">
//             <input
//               type="text"
//               value={inputValue}
//               onChange={handleInputChange}
//               placeholder="Ask about sales data..."
//               disabled={isListening}
//             />
//             <button 
//               type="button" 
//               className={`voice-btn ${isListening ? 'listening' : ''}`}
//               onClick={toggleVoiceInput}
//               title={isListening ? 'Stop listening' : 'Voice input'}
//             >
//               {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
//             </button>
//             <button type="submit" className="send-btn" title="Send message">
//               <BsSendFill />
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;