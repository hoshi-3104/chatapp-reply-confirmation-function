import React, { useState, useRef, useEffect } from "react";
import "./chat.css";
import AddUser from "./userSelect/userSelect";
import Detail from "../detail/Detail"; // Detailコンポーネントをインポート


const Chat = () => {
  const [open, setOpen] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false); // AddUser の表示制御
  const [text, setText] = useState("");
  const [buttonPosition, setButtonPosition] = useState(null); // ボタンの位置情報
  const [messages, setMessages] = useState([]);
   // 現在選択されているタブ
  const endRef = useRef(null);
  const buttonRef = useRef(null); // ボタンの参照

  const handleButtonClick = () => {
    setAddUserVisible((prev) => !prev);

    // ボタンの位置を取得して state に保存
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

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

  const [selectedTab, setSelectedTab] = useState("");

  const updateSelectedTab = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    
    <div className="chat">
      
      {/* <Detail updateSelectedTab={updateSelectedTab} /> */}
      <h2>選択されたタブ: {selectedTab}</h2>

      <div className="tab-1">
        <label>
          <input
            type="radio"
            name="tab-1"
            checked={selectedTab === "chat"}
            onChange={() => setSelectedTab("chat")}
          />
          チャット
        </label>
        <label>
          <input
            type="radio"
            name="tab-1"
            checked={selectedTab === "thread1"}
            onChange={() => setSelectedTab("thread1")}
          />
          スレッド1
        </label>
        <label>
          <input
            type="radio"
            name="tab-1"
            checked={selectedTab === "thread2"}
            onChange={() => setSelectedTab("thread2")}
          />
          スレッド2
        </label>
      </div>
      
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="User Avatar" />
          <div className="texts">
            <span>Wada</span>
          </div>
        </div>
      </div>

      <div className="center">
        {selectedTab === "chat" ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.send_user_id === 1 ? "own" : ""}`}
            >
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
          ))
        ) : (
          <div className="empty-thread">このスレッドにはメッセージはありません。</div>
        )}

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
            style={{
              opacity: text.trim() ? 1 : 0.5, // テキストが入力されていない場合はボタンを半透明に
              pointerEvents: text.trim() ? 'auto' : 'none', // テキストが入力されていない場合はボタンを無効化
            }}
          />
          <img
            src="./send_mention.png"
            alt="Add User"
            className="mention_sendButton"
            onClick={handleButtonClick}
            ref={buttonRef} // ボタンの参照を設定
            style={{
              opacity: text.trim() ? 1 : 0.5, // テキストが入力されていない場合はボタンを半透明に
              pointerEvents: text.trim() ? 'auto' : 'none', // テキストが入力されていない場合はボタンを無効化
            }}
          />
        </div>
      </div>
      {addUserVisible && buttonPosition && <AddUser text={text} handleSend={handleSend} buttonPosition={buttonPosition}/>} {/* AddUser を条件付きで表示 */}
    </div>
  );
};

export default Chat;
