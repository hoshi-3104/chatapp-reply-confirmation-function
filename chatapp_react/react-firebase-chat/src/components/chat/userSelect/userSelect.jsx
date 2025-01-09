import React, { useState, useEffect } from "react";
import "./userSelect.css";

const userSelect = ({ text, handleSend }) => {
  const [showPopup, setShowPopup] = useState(true); // ポップアップ全体の状態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [users, setUsers] = useState([]); // ユーザー情報を格納する状態
  const [text, setText] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // チェックされたユーザーを管理

  const onSendMessage = () => {
    if (text.trim() === "") return;
    handleSend(text);
    setText(""); // メッセージ送信後にテキストをクリア
  };

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
  const handleCalendarSend = () => {
    // テキストが空でなければ送信
    if (text.trim() !== "") {
      handleSend(); // 親の送信関数を呼び出す
      setShowPopup(false);
    }
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

  const handleSave = () => {
    console.log("選択された日付:", selectedDate);
    console.log("選択された時間:", selectedTime);
    setShowDatePicker(false); // カレンダーポップアップを閉じる
    setShowPopup(false); // 全体のポップアップも閉じる
  };

  const handleSettings = () => {
    console.log("設定ボタンが押されました");
    console.log("設定された日付:", selectedDate);
    console.log("設定された時間:", selectedTime);
    setShowDatePicker(false); // カレンダーポップアップを閉じる
  };


  return (
    <div className="userSelect">
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
          <button className="icon-button">
            <img src="./カレンダー.png" alt="" />
          </button>
        </div>
        <button className="send" onClick={onSendMessage}>
          送信
        </button>
      </div>
    </div>
  );
};

export default userSelect;