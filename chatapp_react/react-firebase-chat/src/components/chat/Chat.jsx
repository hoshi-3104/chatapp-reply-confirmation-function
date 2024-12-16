import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import AddUser from "./userSelect/userSelect";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false); // AddUser の表示制御
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("./message_data/mockData.json");
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages.map(({ user, ...msg }) => msg)); // userキーを無視
        } else {
          console.error("サーバーからデータを取得できませんでした。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (text.trim() === "") return;

    try {
      const sendUserId = 1; // 固定値
      const toUserId = 2;
      const threadId = 101;

      const newMessage = {
        send_user_id: sendUserId,
        to_user_id: toUserId,
        thread_id: threadId,
        text,
        time: new Date().toLocaleString(),
      };

      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result_code === 1) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setText("");
        } else {
          console.error("メッセージ保存エラー:", result.message);
        }
      } else {
        console.error("サーバーエラー");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div className="chat">
      <div className="tab-1">
        <label>
          <input type="radio" name="tab-1" defaultChecked />
          タブ1
        </label>
        <label>
          <input type="radio" name="tab-1" />
          タブ2
        </label>
        <label>
          <input type="radio" name="tab-1" />
          タブ3
        </label>
      </div>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="User Avatar" />
          <div className="texts">
            <span>wada</span>
          </div>
        </div>
      </div>
      <div className="center">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.send_user_id === 1 ? "own" : ""}`}>
            {msg.send_user_id === 1 ? (
              <div className="texts">
                <span>{msg.time}</span>
                <p>{msg.text}</p>
              </div>
            ) : (
              <>
                <div className="user">
                  <img src="./avatar.png" alt="User Avatar" />
                  <span className="name">和田洸記</span>
                  <span className="time">{msg.time}</span>
                </div>
                <div className="texts">
                  <p>{msg.text}</p>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="sendButtons">
          <img
            src="./send.png"
            alt="Send"
            className="sendButton"
            onClick={handleSend}
          />
          <img
            src="./send_mention.png"
            alt="Add User"
            className="mention_sendButton"
            onClick={() => setAddUserVisible((prev) => !prev)} // AddUser の表示トグル
          />
        </div>
      </div>
      {addUserVisible && <AddUser />} {/* AddUser を条件付きで表示 */}
    </div>
  );
};

export default Chat;
