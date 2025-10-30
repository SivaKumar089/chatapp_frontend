import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);

  // Scroll to bottom when new message added
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
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    

    try {
      const res = await axios.post("https://chatapp-backend-app.onrender.com/api/chat/", {
        message: input,
      });

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-card">
        {/* Fixed header */}
        <div className="chat-header">ChatBot</div>

        {/* Scrollable chat messages */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
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

        {/* Fixed input box */}
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
