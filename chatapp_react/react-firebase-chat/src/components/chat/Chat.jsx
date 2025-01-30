import "./chat.css"
import React, { useState, useRef, useEffect } from "react";
import AddUser from "./userSelect/userSelect";
import Detail from "../detail/Detail"; // Detailコンポーネントをインポート

const Chat = ({ tabs, selectedTab, setSelectedTab, onRemoveTab}) =>{
  const [userName, setUserName] = useState(""); // 送信者ユーザー名の状態を管理
  const [toUserName, setToUserName] = useState(""); // 送り先ユーザー名の状態を管理
  const [addUserVisible, setAddUserVisible] = useState(false); // AddUser の表示制御
  const [text,setText] = useState(""); // メッセージ入力欄の状態を管理。デフォルトを空のテキストに
  const [messages, setMessages] = useState([]); // メッセージリストの状態管理。デフォルト空
  const endRef= useRef(null); // メッセージリストを一番下にスクロールするために使用
  const sendUserId = 1; // サンプルとして固定値。実際にはユーザーIDを使用
  const toUserId = 2;   // 宛先も固定値。実際には動的な値にする
  const [buttonPosition, setButtonPosition] = useState(null); // ボタンの位置情報
  const buttonRef = useRef(null); // ボタンの参照
  const limit_time = null;

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
    // fetchMessages関数をコンポーネント内で外で定義
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages?send_user_id=${sendUserId}&to_user_id=${toUserId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages); // 最新メッセージをセット
      } else {
        console.error("メッセージ取得エラー");
      }
    } catch (error) {
      console.error("メッセージ取得中にエラーが発生しました:", error);
    }
  };

  const handleSendSimple = async (isReplied, limit_time) => {
    if (text.trim() === "") return;

    const finalThreadId = selectedTab === 'chat' ? 0 : selectedTab; //tabのidを指す.tabのidにはスレッドIDが入っている
    const sendTime = new Date().toISOString();//ISO形式で現在日時取得（例: 2025-01-21T12:34:56.789Z）
    const date = new Date(limit_time);
    const formattedTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    //API呼び出しでメッセージをデータベースに保存
    try {
      const response = await fetch('http://localhost:3001/api/messages/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify({ // 左側がデータベースに送られるカラム(dbのテーブル内のカラムと一致)で、右側がフロントのコード内で使用されているカラム
          send_user_id: sendUserId, // 送信者ID(デフォルトは1)
          to_user_id: toUserId, // 送信先ID(デフォルトは2)
          messages: text,  // 入力されたメッセージ(送信ボタンを押したときに渡されるもの)
          thread_id: finalThreadId, 
          is_replied: isReplied,
          limit_time: formattedTime,
        }),
      });
      if(response.ok) { // httpコードが200~299の範囲の場合にtrueになることをresponse.okという
        const result = await response.json(); // resultにapiレスポンスのデータが格納されている
        if (result.result_code === 1) { //ローカル状態(setMessages)にメッセージデータを追加
          const newMessage = {
            MESSAGES: text,
            SEND_USER_ID: sendUserId,
            SEND_TIME: sendTime,
            THREAD_ID: finalThreadId,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]); // 新しいメッセージを追加
          // 少し遅延を加えてから再取得
        setTimeout(() => {
          fetchMessages(); // メッセージ一覧を再取得
          setText(""); // 入力フィールドをリセット
          endRef.current?.scrollIntoView({ behavior: "smooth" }); // 最新メッセージまでスクロール
        }, 1); 
        }
      } else {
        console.error('メッセージ送信エラー');
      }
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
    }
  }; 
  
  const handleSend = async (isReplied, limit_time) => {
    if (text.trim() === "") return; // 空メッセージの送信を防ぐ

    const finalThreadId = selectedTab === 'chat' ? 0 : selectedTab; // 'chat'の場合は0、それ以外はselectedTab
    const sendTime = new Date().toISOString();
    const date = new Date(limit_time);
    const formattedTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    //API呼び出しでメッセージをデータベースに保存
    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify({
          send_user_id: sendUserId, 
          to_user_id: toUserId, 
          messages: text, 
          thread_id: finalThreadId, 
          is_replied: isReplied,
          limit_time: formattedTime,
        }),
      });
      if(response.ok) { // httpコードが200~299の範囲の場合にtrueになることをresponse.okという
        const result = await response.json(); // resultにapiレスポンスのデータが格納されている
        if (result.result_code === 1) { //ローカル状態(setMessages)にメッセージデータを追加
          setMessages(prevMessages => [...prevMessages, { 
            MESSAGES: text, 
            SEND_USER_ID: sendUserId,
            SEND_TIME: sendTime,
          }]);
          setText(""); // 入力フィールドを空文字にリセットする。
          setTimeout(() => {
            fetchMessages(); // メッセージ一覧を再取得
            setText(""); // 入力フィールドをリセット
            endRef.current?.scrollIntoView({ behavior: "smooth" }); // 最新メッセージまでスクロール
          }, 1); 
        }
      } else {
        console.error('メッセージ送信エラー');
      }
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
    }
  };
  //メッセージ一覧取得処理(useEffect, GETリクエスト送信)
  useEffect(() => {
    fetchMessages();
  }, [sendUserId,toUserId]);
    
  //送信者ユーザ名取得処理
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${sendUserId}`);
        if (response.ok) {
          const data = await response.json();
          setUserName(data.data[0].USER_NAME); // ユーザー名をセット
        } else {console.error("ユーザー名取得エラー");}
      } catch (error) {console.error("ユーザー名取得中にエラーが発生しました:", error);}
    };
    fetchUserName();
  }, [sendUserId]);//送信者ユーザ名取得処理の終了
    
    //送信先ユーザ名取得処理
    useEffect(() => {
      const fetchToUserName = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/users/${toUserId}`);
          if (response.ok) {
            const data = await response.json();
            setToUserName(data.data[0].USER_NAME);
          } else {console.error("ユーザー名取得エラー");}
        } catch (error) {console.error("ユーザー名取得中にエラーが発生しました:", error);}
      };
    fetchToUserName();
  }, [toUserId]);

  const renderMessages = () => {
    const selectedTabId = selectedTab;  // 選択されているタブIDを取得
    const filteredMessages = selectedTabId === 'chat'
    ? messages  // 全メッセージを表示
    : messages.filter((message) => message.THREAD_ID === selectedTabId);  // スレッドIDでフィルタリング
    return filteredMessages.map((message, index) => {
      const isOwnMessage = message.SEND_USER_ID === sendUserId;
      const formattedTime = (() => {
        const date = new Date(message.SEND_TIME); // ISO形式の日付をDateオブジェクトに変換
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      })();
      return (
      <div
      key={index}
      className={`message ${isOwnMessage ? "own" : ""}`}
      >
        {isOwnMessage ? (
          <div className="texts">
            <span className="time">{formattedTime}</span>
            <p>{message.MESSAGES}</p>
            <div ref={endRef}></div>
          </div>
          ) : (
          <>
          <div className="user">
            <img src="./avatar.png" alt="User Avatar" />
            <span className="name">{toUserName}</span>
            <span className="time">{formattedTime}</span>
          </div>
            <div className="texts">
              <p>{message.MESSAGES}</p>
            </div>
          </>
        )}
      </div>
      );
    });
  };

  return(
  <div className="chat">
    <div className="tab-1">
      {tabs.map((tab) => (
        <label key={tab.id}>
          <input
          type="radio"
          name="tab-1"
          checked={selectedTab === tab.id}
          onChange={() => setSelectedTab(tab.id)}
          />
          <span className="tab-label-text">{tab.label}</span>
          {selectedTab !== "chat" && tab.id !==  "chat" && (
            <button className="close-button" onClick={() => onRemoveTab(tab.id)}>✖</button>
            )}

        </label>
      ))}
    </div>
    
    <div className="center">
      {renderMessages()} {/* メッセージを表示 */}
      <div ref={endRef}></div>
    </div>

    <div className="bottom">
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={text}
        onChange={e=>setText(e.target.value)}
      />
      <div className="sendButtons">
        <img
          src="./send.png"
          alt="Send"
          className="sendButton"
          onClick={() => handleSendSimple(1,limit_time)}
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
  )
}

export default Chat