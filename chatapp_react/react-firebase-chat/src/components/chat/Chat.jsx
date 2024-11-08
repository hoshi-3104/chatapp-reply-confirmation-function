import "./chat.css"
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react"
const Chat = () =>{
    const[open,setOpen]=useState(false);
    const[text,setText]=useState("");
    const[messages, setMessages] = useState([]);
    const endRef= useRef(null);

    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    const handleEmoji = e =>{
        setText(prev=>prev+e.emoji)
        setOpen(false)
    };
    const handleSend = async () => {
        if (text.trim() === "") return; // 空メッセージの送信を防ぐ

        // API呼び出しでメッセージをデータベースに保存
        try {
            const sendUserId = 1; // サンプルとして固定値。実際にはユーザーIDを使用
            const toUserId = 2;   // 宛先も固定値。実際には動的な値にする
            const response = await fetch('http://localhost:3001/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sendUserId,
                    toUserId,
                    messages: text,  // 入力されたメッセージ
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.result_code === 1) {
                    // メッセージを追加し、テキスト入力をクリア
                    setMessages(prevMessages => [...prevMessages, { 
                        text, 
                        user: sendUserId, 
                        time: "just now" // 実際のタイムスタンプは必要に応じてAPIから取得
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
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>hello
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>a
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>b
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own"> 
                    <div className="texts">
                        <img src="https://www.hiroshima-cu.ac.jp/top-img/mainvisual01.jpg" alt="" />
                        <p>c
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>b
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>a
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div ref={endRef}></div>
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
                <button className="sendButton" onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Chat