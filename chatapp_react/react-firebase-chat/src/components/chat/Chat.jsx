import "./chat.css"
import React, { useState, useRef, useEffect } from "react";

const Chat = () =>{
    const[open,setOpen]=useState(false);
    const[text,setText]=useState("");
    const[messages, setMessages] = useState([]);
    const endRef= useRef(null);
    const sendUserId = 1; // サンプルとして固定値。実際にはユーザーIDを使用
    const toUserId = 2;   // 宛先も固定値。実際には動的な値にする

    const handleSend = async () => {
        if (text.trim() === "") return; // 空メッセージの送信を防ぐ
        const threadId = 0;

        // API呼び出しでメッセージをデータベースに保存
        try {
            const response = await fetch('http://localhost:3001/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    send_user_id: sendUserId,
                    to_user_id: toUserId,
                    messages: text,  // 入力されたメッセージ
                    thread_id: threadId,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.result_code === 1) {
                    // メッセージを追加し、テキスト入力をクリア 大文字のMESSAGESと SEND_USER_IDには登録後の、新しいメッセージと送信者IDが入っている。
                    setMessages(prevMessages => [...prevMessages, { 
                        MESSAGES: text, 
                        SEND_USER_ID: sendUserId,
                        SEND_TIME: (() => {
                          const now = new Date();
                          const hours = String(now.getHours()).padStart(2, '0');
                          const minutes = String(now.getMinutes()).padStart(2, '0');
                          return `${hours}:${minutes}`;
                      }),
                    }]);

                    setText("");
                }
            } else {
                console.error('メッセージ送信エラー');
            }
        } catch (error) {
            console.error('メッセージ送信中にエラーが発生しました:', error);
        }
    };
  // メッセージ取得処理
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/messages?send_user_id=${sendUserId}&to_user_id=${toUserId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages); // APIから取得したメッセージをセット
          console.log(data.messages)
        } else {
          console.error("メッセージ取得エラー");
        }
      } catch (error) {
        console.error("メッセージ取得中にエラーが発生しました:", error);
      }
    };
    fetchMessages();
  
  }, [sendUserId,toUserId]);

  // メッセージ表示用のコンポーネントを作成
  const renderMessages = () => {
    return messages.map((message, index) => {
      const isOwnMessage = message.SEND_USER_ID === sendUserId;
      return (
        <div
          key={index}
          className={`message ${isOwnMessage ? "own" : "other"}`} // 自分のメッセージと相手のメッセージを区別
        >
          {/* 相手のメッセージにはアイコンを表示 */}
          {!isOwnMessage && (
            <div className="user">
              <img src="./avatar.png" alt="User Avatar" />
              <span className="name">和田洸記</span>
              <span className="time">{message.SEND_TIME}</span>
            </div>
          )}
          <div className={`texts ${isOwnMessage ? "ownText" : "otherText"}`}>
            <p>{message.MESSAGES}</p>
          </div>
        </div>
      );
    });
  };

    return(
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
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>wada</span>
                    </div>
                </div>
            </div>
            <div className="center">
              {renderMessages()} {/* メッセージを表示 */}
              <div ref={endRef}></div> {/* メッセージの一番下 */}
              </div>
            
            <div className="bottom">
                {/* <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div> */}
                <input 
                type="text" 
                placeholder="Type a message..." 
                value={text}
                onChange={e=>setText(e.target.value)}
                />
                {/* <div className="emoji">
                    <img 
                        src="./emoji.png" 
                        alt="" 
                        onClick={()=>setOpen(prev=>!prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                </div> */}
                <div className="sendButtons">
                    <img 
                    src="./send.png"
                    alt="Send Mention" 
                    className="sendButton" 
                    onClick={handleSend} 
                    />
                    <img 
                    src="./send_mention.png" 
                    alt="Send Message" 
                    className="sendButton" 
                    onClick={handleSend} 
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat