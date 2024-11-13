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
                <div className="message">
                    <div className="user">
                        <img src="./avatar.png" alt="" />
                        <span className="name">和田洸記</span>
                        <span className="time">12:00</span>
                    </div>
                    <div className="texts">
                        <p>Lorem ipsum dolor sit, amet consectetur 
                            adipisicing elit. Suscipit eius voluptas 
                            labore repellat quisquam veniam, optio tempora 
                            fugit atque nisi provident a nemo consequuntur 
                            expedita ad dolores soluta ab fugiat?
                        </p>
                        <div className="replyuser">
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <span className="reply_num">3件の返信</span>
                            <button className="reply">スレッド返信</button>    
                        </div>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <span>12:00</span>
                        <p>Lorem ipsum dolor sit, amet consectetur 
                            adipisicing elit. Suscipit eius voluptas 
                            labore repellat quisquam veniam, optio tempora 
                            fugit atque nisi provident a nemo consequuntur 
                            expedita ad dolores soluta ab fugiat?</p>    
                    </div>
                </div>
                <div className="message">
                    <div className="user">
                        <img src="./avatar.png" alt="" />
                        <span className="name">和田洸記</span>
                        <span className="time">12:00</span>
                    </div>
                    <div className="texts">
                        <p>hello
                        </p>
                        <div className="replyuser">
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <span className="reply_num">3件の返信</span>
                            <button className="reply">スレッド返信</button>    
                        </div>
                        
                    </div>
                </div>
                <div className="message own"> 
                    <div className="texts">
                        {/* <img src="https://www.hiroshima-cu.ac.jp/top-img/mainvisual01.jpg" alt="" /> */}
                        <p>caaaaaaaaa
                        </p>
                        <span>12:00</span>
                    </div>
                </div>
                <div className="message">
                    <div className="user">
                        <img src="./avatar.png" alt="" />
                        <span className="name">和田洸記</span>
                        <span className="time">12:00</span>
                    </div>
                    <div className="texts">
                        <p>hello
                        </p>
                        <div className="replyuser">
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <img src="./avatar.png" alt="" />
                            <span className="reply_num">3件の返信</span>
                            <button className="reply">スレッド返信</button>    
                        </div>
                        
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <span>12:00</span>
                        <p>aaaaaaaaaaaaaaaaaa
                        </p>
                        
                    </div>
                </div>
                <div ref={endRef}></div>
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