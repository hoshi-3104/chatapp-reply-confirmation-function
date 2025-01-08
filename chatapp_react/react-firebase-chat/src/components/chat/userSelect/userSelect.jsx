import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./userSelect.css";

const AddUser = ({ text, handleSend }) => {
  const [showPopup, setShowPopup] = useState(true); // ポップアップ全体の状態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

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
    <>
      {showPopup && (
        <div className={`userSelect ${showDatePicker ? "expanded" : ""}`}>
          <div className="user">
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user1</span>
            </label>
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user2</span>
            </label>
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user3</span>
            </label>
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user4</span>
            </label>
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user5</span>
            </label>
            <label className="checkboxItem">
              <input
                type="checkbox"
                name="checkbox"
                value="和田洸記"
                className="checkbox"
              />
              <img src="./avatar.png" alt="" />
              <span>user6</span>
            </label>
            {/* 他のユーザー */}
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

          {/* カレンダーと時間設定のポップアップ */}
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
                <button onClick={handleCalendarSend} className="save-button">
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
