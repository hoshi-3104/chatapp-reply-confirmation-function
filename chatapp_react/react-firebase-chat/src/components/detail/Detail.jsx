import "./detail.css"
import React from "react";

const Detail = ({setSelectedTab}) => {
  const handleReplyClick = () => {
    setSelectedTab("thread1"); // ボタンをクリックしたときに "スレッド1" に切り替える
  };

  return (
    <div className='detail'>
      <div className="response_needed">
        <div className="title">
            <img src="./Respons_Needed.png" alt="" />
            <h3>Response Needed</h3>
        </div>
        <div className="items">

          <div className="message">
            <div className="user">
              <img src="./avatar.png" alt="" />
              <span className="name">和田洸記</span>
              <span className="time">12:00</span>
            </div>      
            <div className="texts">
                <p>hello</p>
            </div>
            <div className="button">
              <button className="reply" onClick={handleReplyClick}>スレッド返信</button>
              <button className="completion">完 了</button>
              <span className="limit">期限 : 2024/12/27 12:00</span>
            </div>
          </div>
          <div className="message">
            <div className="user">
              <img src="./avatar.png" alt="" />
              <span className="name">和田洸記</span>
              <span className="time">12:00</span>
            </div>      
            <div className="texts">
                <p>hello</p>
            </div>
            <div className="button">
              <button className="reply" onClick={handleReplyClick}>スレッド返信</button>
              <button className="completion">完 了</button>
              <span className="limit">期限 : 2024/12/27 12:00</span>
            </div>
          </div>
          <div className="message">
            <div className="user">
              <img src="./avatar.png" alt="" />
              <span className="name">和田洸記</span>
              <span className="time">12:00</span>
            </div>      
            <div className="texts">
                <p>hello</p>
            </div>
            <div className="button">
              <button className="reply" onClick={handleReplyClick}>スレッド返信</button>
              <button className="completion">完 了</button>
              <span className="limit">期限 : 2024/12/27 12:00</span>
            </div>
          </div>

        </div>
      </div>

      <div className="response_waited">
        <div className="title">
            <img src="./Respons_Waited.png" alt="" />
            <h3>Response Needed</h3>
        </div>
        <div className="items">

          <div className="item">
            <div className="message">
              <div className="user">
                <span className="reply_text">返信済み</span>
                <span className="time">12:00</span>
              </div>      
              <div className="texts">
                  <p>hello</p>
              </div>
              <div className="button">
                <div className="replyuser">
                  <img src="./avatar.png" alt="" />
                  <img src="./avatar.png" alt="" />
                  <img src="./avatar.png" alt="" />
                  <span className="limit">3件の返信</span>
                </div>
                <button className="reply">スレッド返信</button>              
              </div>
            </div>
          </div>
          <div className="message completion">
            <div className="user">
              <span className="time">12:00</span>
            </div>      
            <div className="texts">
                <p>hello</p>
            </div>
            <div className="button">
              <div className="replyuser">
                <img src="./avatar.png" alt="" />
                <img src="./avatar.png" alt="" />
                <img src="./avatar.png" alt="" />
                <span className="limit">3件の返信</span>
              </div>
              <button className="reply">スレッド返信</button>              
            </div>
          </div>
          <div className="message completion">
            <div className="user">
              <span className="time">12:00</span>
            </div>      
            <div className="texts">
                <p>hello</p>
            </div>
            <div className="button">
              <div className="replyuser">
                <img src="./avatar.png" alt="" />
                <img src="./avatar.png" alt="" />
                <img src="./avatar.png" alt="" />
                <span className="limit">3件の返信</span>
              </div>
              <button className="reply">スレッド返信</button>              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail