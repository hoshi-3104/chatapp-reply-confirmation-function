import React, { useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";

const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const handleSelectUser = (userId, userName) => {
        onSelectUser(userId, userName); // 親コンポーネントに選択されたユーザーの情報を渡す
      };
    return (
        <div className="chatList">
            <div className="member_and_search">
                <div className="member">
                    <img src="./Member_icon.png" alt="" />
                    <h1>Member</h1>
                </div>
                <div className="search">
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                />
                </div>
            </div>

            <div className="items">
                <div className="item">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>Wada</span>
                        <p>こんにちは</p>
                    </div>
                </div>
                <div className="item">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>Hoshino</span>
                        <p>こんにちは</p>
                    </div>
                </div>
            </div>

            {addMode && <AddUser/>}
        </div>
    );
};

export default ChatList;
