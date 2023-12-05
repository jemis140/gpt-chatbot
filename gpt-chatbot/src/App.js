// App.js
import React, { useState } from "react";
import { Input, Button, List } from "antd";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, user: "user" }]);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt: input,
          max_tokens: 50, // Adjust as needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
        }
      );

      const botMessage = response.data.choices[0].text;
      setMessages([...messages, { text: botMessage, user: "bot" }]);
    } catch (error) {
      console.error("OpenAI API Error:", error);
    }
  };

  return (
    <div style={{ width: 400, margin: "auto", marginTop: 50 }}>
      <List
        dataSource={messages}
        renderItem={(message, index) => (
          <List.Item
            style={{ textAlign: message.user === "user" ? "right" : "left" }}
          >
            <div
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: message.user === "user" ? "#e6f7ff" : "#fff",
              }}
            >
              {message.text}
            </div>
          </List.Item>
        )}
      />
      <div style={{ marginTop: 10 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default App;
