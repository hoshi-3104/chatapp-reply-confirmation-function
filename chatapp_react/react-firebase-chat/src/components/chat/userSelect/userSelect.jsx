import React, { useState, useEffect } from "react";
import "./userSelect.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddUser = ({ text, handleSend }) => {
  const [showPopup, setShowPopup] = useState(true); // ポップアップ全体の状態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [users, setUsers] = useState([]); // ユーザー情報を格納する状態
  const [selectedUsers, setSelectedUsers] = useState([]); // チェックされたユーザーを管理
  const [limitTime, setLimitTime] = useState(null); // limit_timeの状態を追加

  // バックエンドからユーザーリストを取得する
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users"); // ユーザー情報を取得するAPI
        if (response.ok) {
          const data = await response.json();
          // user_id=2（和田）をフィルタリング
          const filteredUsers = data.data.filter((user) => user.USER_ID === 2);
          setUsers(filteredUsers); // 和田の情報のみを格納
        } else {console.error("ユーザー情報の取得エラー");}
      } catch (error) {console.error("ユーザー情報取得中にエラーが発生しました:", error);}
    };
    fetchUsers();
  }, []);

  // チェックボックスが変更されたときの処理
  const handleCheckboxChange = (event) => {
    const userId = event.target.value;
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId); // チェックを外す場合
      } else {
        return [...prevSelectedUsers, userId]; // チェックを入れる場合
      }
    });
  };

  const handleCalendarClick = () => {
    setShowDatePicker(true); // カレンダーポップアップを表示
  };

  const handleDateChange = (date) => {
    setSelectedDate(date); // 選択された日付を保存
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value); // 選択された時間を保存
  };

  const handleSendWithLimitTime = () => {
    if (selectedDate && selectedTime) {
      // 日付と時間を組み合わせてlimit_timeを生成
      const limitTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      limitTime.setHours(hours);
      limitTime.setMinutes(minutes);
      // ISO形式の文字列に変換
      const limitTimeISO = limitTime.toISOString();
      setLimitTime(limitTimeISO);
      // 送信処理（limitTimeを使用して送信）
      if (text.trim() !== "") {
        handleSend(0, limitTimeISO); // 親の送信関数を呼び出す
        setShowPopup(false);
      }
    }
  };

  const handleSettings = () => {
    if (selectedDate && selectedTime) {
      // 日付と時間を組み合わせてlimit_timeを生成
      const limitTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      limitTime.setHours(hours);
      limitTime.setMinutes(minutes);

      // ISO形式の文字列に変換
      const limitTimeISO = limitTime.toISOString();
      setLimitTime(limitTimeISO); // limitTimeを保存
    }
    setShowDatePicker(false); // カレンダーポップアップを閉じる
  };
  const handleCalendarSend = () => {
    // テキストが空でなければ送信
    if (text.trim() !== "") {
      handleSend(0, limitTime); // 親の送信関数を呼び出す
      setShowPopup(false);
    }
  };


  return (
    <>
    {showPopup && (
      <div className={`userSelect ${showDatePicker ? "expanded" : ""}`}>
        <div className="user">
        {users.map((user) => (
          <label key={user.USER_ID} className="checkboxItem">
            <input
              type="checkbox"
              value={user.USER_ID}
              className="checkbox"
              onChange={handleCheckboxChange}
            />
            <img src={user.ICON_PATH || "./avatar.png"} alt={user.USER_NAME} />
            <span>{user.USER_NAME}</span>
          </label>
        ))}
      </div>

      <div className="buttom">
        <div className="addlist-wrapper">
          <button className="addlist">未返信リストに追加</button>
          <button className="icon-button" onClick={handleCalendarClick}>
            <img src="./カレンダー.png" alt="カレンダー" />
          </button>
        </div>
        <button onClick={handleCalendarSend} className="send">送信</button>
      </div>
      {showDatePicker && (
            <div className="calendar-popup">
              <h3>返信期限を設定</h3>
              <DatePicker
                inline
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd HH:mm"
              />
              <div className="time-input">
                <label>時間を設定：</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                />
              </div>
              <div className="button-group">
                <button onClick={handleSendWithLimitTime} className="save-button">
                  設定して送信
                </button>
                <button onClick={handleSettings} className="settings-button">
                  設定
                </button>
              </div>
            </div>
          )}
          </div>
    )}
    </>
  );
};

export default AddUser;