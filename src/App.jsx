import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a message!");
      return;
    }

    setError("");

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://chatapp-backend-app.onrender.com/api/chat/",
        { message: input }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.response?.data?.error || "Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">AI ChatBot</div>

        {/* Chat Messages */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.sender === "bot" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}

          {loading && (
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}

          {error && <div className="error">{error}</div>}
        </div>

        {/* Input */}
        <form className="input-area" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
