import React, { useState } from "react";

function AIChatbot({ familyData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! 👋 I'm FamilyCare AI Assistant. How can I help you with health insurance?",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message.trim();

    const userMessage = {
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,

            // Send FamilyCare recommendation data
            familyData: familyData || null,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              data.message ||
              "Sorry, I could not process your question.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't connect to the FamilyCare server. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          right: "25px",
          bottom: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#0f766e",
          color: "white",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "25px",
            bottom: "95px",
            width: "350px",
            height: "480px",
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#0f766e",
              color: "white",
              padding: "18px",
            }}
          >
            <strong>FamilyCare AI</strong>

            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                opacity: 0.9,
              }}
            >
              Insurance Assistant
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "#f8fafc",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 13px",
                    borderRadius: "14px",
                    background:
                      msg.sender === "user"
                        ? "#0f766e"
                        : "white",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "#334155",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.08)",
                    fontSize: "14px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading message */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 13px",
                    borderRadius: "14px",
                    background: "white",
                    color: "#64748b",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.08)",
                    fontSize: "14px",
                  }}
                >
                  FamilyCare AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "12px",
              borderTop: "1px solid #e2e8f0",
              background: "white",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about insurance..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "0 15px",
                background: loading
                  ? "#94a3b8"
                  : "#0f766e",
                color: "white",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "600",
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;