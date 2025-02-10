import React, { useEffect, useState } from "react";
import "./detail.css";

const Detail = ({onAddTab}) => {   
  const toUserId =1;
  const sendUserId = 2;
  const [unrepliedMessages, setUnrepliedMessages] = useState([]); // 未返信リスト
  const [waitingResponseMessages, setWaitingResponseMessages] = useState([]); // 返信待ちリスト
  const [userName, setUserName] = useState(""); // 送信者ユーザー名の状態を管理
  const [toUserName, setToUserName] = useState(""); // 送り先ユーザー名の状態を管理
  const [threadStatuses, setThreadStatuses] = useState({});

  const fetchThreadMessages = async (threadId) => {
    try {
      console.log("sureddo:",threadId)
      const response = await fetch(`http://localhost:3001/api/messages/thread/${threadId}`);
      const data = await response.json();
  
      if (data.result_code === 1) {
        const messages = data.messages;
        console.log(messages)
        if (messages.length >= 2) {
          console.log(`スレッドID ${threadId} に一致するメッセージが2つ以上存在します`);
          return { messages, hasMultipleMessages: true }; // 条件を満たす場合のフラグ付き
        } else {
          console.log(`スレッドID ${threadId} に一致するメッセージは1つ以下です`);
          return { messages, hasMultipleMessages: false }; // 条件を満たさない場合
        }
      } else {
        console.error("スレッドメッセージの取得に失敗しました");
        return [];
      }
    } catch (error) {
      console.error("エラー:", error);
      return [];
    }
  };
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

  // 未返信メッセージ取得
  const fetchUnrepliedMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/unreplied/${sendUserId}`);
      const data = await response.json();
      console.log("Unreplied messages:", data); // データの確認
      if (data.result_code === 1) {
        const filteredMessages = data.data.filter(msg => msg.TO_USER_ID === sendUserId);
        setUnrepliedMessages(filteredMessages);
      }
    } catch (error) {console.error("未返信メッセージ取得エラー:", error);}
  };

  // 返信待ちメッセージ取得
  const fetchWaitingResponseMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/waiting_response/${sendUserId}`);
      const data = await response.json();
      if (data.result_code === 1) {
        const filteredMessages = data.data.filter(msg => msg.SEND_USER_ID === sendUserId);
        setWaitingResponseMessages(filteredMessages);
      }
    } catch (error) {console.error("返信待ちメッセージ取得エラー:", error);}
  };

  // メッセージ完了ボタンの処理
  const handleComplete = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/unreplied/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.result_code === 1) {
        console.log(`Message ${messageId} marked as replied`);
        // 未返信リストを更新
        setUnrepliedMessages((prev) => prev.filter((msg) => msg.MESSAGE_ID !== messageId));
      } else {console.error("完了処理失敗:", data.message);}
    } catch (error) {console.error("完了処理エラー:", error);}
  };
  useEffect(() => {
    fetchUnrepliedMessages();
    fetchWaitingResponseMessages();
  }, [toUserId, sendUserId]);

  // 日時フォーマット関数
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const month = date.getMonth() + 1; // 月は0から始まるので+1
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0"); // 2桁に揃える
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 2桁に揃える

    return `${month}/${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchAllThreadStatuses = async () => {
      const statuses = {};
  
      for (const message of waitingResponseMessages) {
        const threadId = message.THREAD_ID;
        console.log(threadId)
  
        if (threadId) {
          const { hasMultipleMessages } = await fetchThreadMessages(threadId);
          console.log("hasMultipleMessages:", hasMultipleMessages)
          statuses[threadId] = hasMultipleMessages;
        }
      }
  
      setThreadStatuses(statuses); // 状態を更新
    };
  
    fetchAllThreadStatuses();
  }, [toUserId, sendUserId, waitingResponseMessages]); // 依存関係にメッセージ一覧を追加
  return (
    <div className="detail">
      {/* 未返信リスト */}
      <div className="response_needed">
        <div className="title">
          <img src="./Respons_Needed.png" alt="" />
          <h3>未返信</h3>
        </div>
        <div className="items">
          {unrepliedMessages.map((data) => (
            <div className="message" key={data.MESSAGE_ID}>
              <div className="user">
                <img src="./avatar.png" alt="" />
                <span className="name">{toUserName}</span>
                <span className="time">{formatDateTime(data.SEND_TIME)}</span>
              </div>
              <div className="texts">
                <p>{data.MESSAGES}</p>
              </div>
              <div className="button">
                <button className="reply" onClick={() =>onAddTab(data.MESSAGE_ID)} >スレッド返信 </button>
                <button className="completion" onClick={() => handleComplete(data.MESSAGE_ID)}>
                  完 了
                </button>
                <span className="limit">期限：{formatDateTime(data.LIMIT_TIME)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 返信待ちリスト */}
      <div className="response_waited">
        <div className="title">
          <img src="./Respons_Waited.png" alt="" />
          <h3>返信待ち</h3>
        </div>
        <div className="items">
          {waitingResponseMessages.map((data) => (
            <div className={`item ${
              threadStatuses[data.THREAD_ID] ? "reply-done" : ""
            }`}>
            <div className="message"  key={data.MESSAGE_ID}>
              <div className="user">
                {threadStatuses[data.THREAD_ID] && (
                <span className="reply_text">返信済み</span> 
                )}
                <span className="time">{formatDateTime(data.SEND_TIME)}</span>
              </div>
              <div className="texts">
                <p>{data.MESSAGES}</p>
              </div>
              <div className="button">
                <div className="replyuser">
                </div>
                <button className="reply" onClick={() =>onAddTab(data.MESSAGE_ID)}>スレッド返信</button>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;