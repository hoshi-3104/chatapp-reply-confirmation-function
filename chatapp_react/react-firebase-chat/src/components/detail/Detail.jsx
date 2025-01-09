import React, { useEffect, useState } from "react";
import "./detail.css";

const Detail = ({ userId = 2, sendUserId = 1 }) => {
  const [unrepliedMessages, setUnrepliedMessages] = useState([]); // 未返信リスト
  const [waitingResponseMessages, setWaitingResponseMessages] = useState([]); // 返信待ちリスト

  // 未返信メッセージ取得
  const fetchUnrepliedMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/unreplied/${userId}`);
      const data = await response.json();
      console.log("Unreplied messages:", data); // データの確認
      if (data.result_code === 1) {
        setUnrepliedMessages(data.data);
      }
    } catch (error) {console.error("未返信メッセージ取得エラー:", error);}
  };

  // 返信待ちメッセージ取得
  const fetchWaitingResponseMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/waiting_response/${sendUserId}`);
      const data = await response.json();
      if (data.result_code === 1) {
        setWaitingResponseMessages(data.data);
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
  }, [userId, sendUserId]);

  return (
    <div className="detail">
      {/* 未返信リスト */}
      <div className="response_needed">
        <div className="title">
          <img src="./Respons_Needed.png" alt="" />
          <h3>Response Needed</h3>
        </div>
        <div className="items">
          {unrepliedMessages.map((data) => (
            <div className="message" key={data.MESSAGE_ID}>
              <div className="user">
                <img src="./avatar.png" alt="" />
                <span className="name">{data.SEND_USER_ID}</span>
                <span className="time">{data.SEND_TIME}</span>
              </div>
              <div className="texts">
                <p>{data.MESSAGES}</p>
              </div>
              <div className="button">
                <button className="reply">スレッド返信</button>
                <button className="completion" onClick={() => handleComplete(data.MESSAGE_ID)}>
                  完 了
                </button>
                <span className="limit">{data.LIMIT_TIME}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 返信待ちリスト */}
      <div className="response_waited">
        <div className="title">
          <img src="./Respons_Waited.png" alt="" />
          <h3>Response Waited</h3>
        </div>
        <div className="items">
          {waitingResponseMessages.map((data) => (
            <div className="message" key={data.MESSAGE_ID}>
              <div className="user">
                <span className="reply_text">返信済み</span>
                <span className="time">{data.SEND_TIME}</span>
              </div>
              <div className="texts">
                <p>{data.MESSAGES}</p>
              </div>
              <div className="button">
                <div className="replyuser">
                  <img src="./avatar.png" alt="" />
                  <span className="limit">{data.THREAD_ID} 件の返信</span>
                </div>
                <button className="reply">スレッド返信</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;