// components/ChatModal.jsx - Streamlit Chat Modal

import { useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import './ChatModal.css';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button 
        className="chat-fab"
        onClick={() => setIsOpen(true)}
        title="Open AI Shopping Assistant"
      >
        <FiMessageCircle />
        <span className="fab-label">AI Assistant</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chat-modal-header">
              <h3>🤖 AI Shopping Assistant</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="chat-modal-body">
              <iframe
                src="http://localhost:8501/"
                title="AI Shopping Assistant"
                className="streamlit-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
