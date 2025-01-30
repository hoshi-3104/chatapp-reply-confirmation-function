import React, { useState, useEffect } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";

const ChatList = () => {
    const sendUserId = 1;
    const [users, setUsers] = useState([]);
    const [sendUserName, setSendUserName] = useState(""); // 自分のユーザー名
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [addMode, setAddMode] = useState(false);

    //送信者ユーザ名取得処理
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.data); 
                    const sendUser = data.data.find(user => user.USER_ID === sendUserId);
                    if (sendUser) {
                        setSendUserName(sendUser.USER_NAME);
                    }
                    const filtered = data.data.filter(user => user.USER_ID !== sendUserId);
                    setFilteredUsers(filtered); // フィルタリング結果をセット
                } else {console.error("ユーザー名取得エラー");}
            } catch (error) {console.error("ユーザー名取得中にエラーが発生しました:", error);}
        };
        fetchUser();
    }, [sendUserId]);

    return (
        <div className="chatList">
            <div className='userInfo'>
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <h2>{sendUserName || "ユーザー名取得中..."}</h2>
                </div>
            </div>
            <div className="member_and_search">
                <div className="member">
                    <img src="./Member_icon.png" alt="" />
                    <h1>Member</h1>
                </div>
            </div>

            <div className="items">
                {filteredUsers.map((filteredUser) => (
                <div className="item">
                    <img src={`./${filteredUser.ICON_PATH || "./avatar.png"}`} alt="" />
                    <div className="texts">
                        <span>{filteredUser.USER_NAME}</span>
                    </div>
                </div>
                ))}
            </div>

            {addMode && <AddUser/>}
        </div>
    );
};

export default ChatList;
