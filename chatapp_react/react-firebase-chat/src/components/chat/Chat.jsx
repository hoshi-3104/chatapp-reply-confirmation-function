import "./chat.css";
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

const Chat = () =>{
    const[open,setOpen]=useState(false);
    const[text,setText]=useState("");
    const[messages, setMessages] = useState([]);
    const endRef= useRef(null);

    const sendUserId = 1; // サンプルとして固定値。実際にはユーザーIDを使用
    const toUserId = 2;   // 宛先も固定値。実際には動的な値にする

    //メッセージ送信後にスクロールする
    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    //絵文字選択時の処理
    const handleEmoji = e =>{
        setText(prev=>prev+e.emoji)
        setOpen(false)
    };

    const handleSend = async () => {
        if (text.trim() === "") return; // 空メッセージの送信を防ぐ

        const threadId = 0;

        try {
            // API呼び出しでメッセージをデータベースに保存
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
                    setMessages(prevMessages => [...prevMessages, { 
                        text, 
                        user: sendUserId, 
                        time: new Date().toLocaleTimeString(), 
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
          {!isOwnMessage && <img src="./avatar.png" alt="User Avatar" className="avatar" />}
          <div className={`texts ${isOwnMessage ? "ownText" : "otherText"}`}>
            <p>{message.MESSAGES}</p>
            <span>{message.SEND_TIME}</span>
          </div>
        </div>
      );
    });
  };

    return(
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>山田</span>
                        <p>山田です</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
            {renderMessages()} {/* メッセージを表示 */}
            <div ref={endRef}></div> {/* メッセージの一番下 */}
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input 
                type="text" 
                placeholder="Type a message..." 
                value={text}
                onChange={e=>setText(e.target.value)}
                />
                <div className="emoji">
                    <img 
                        src="./emoji.png" 
                        alt="" 
                        onClick={()=>setOpen(prev=>!prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                    
                </div>
                <button className="sendButton" onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Chat
