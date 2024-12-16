import "./userSelect.css";

const AddUser = () => {
  return (
    <div className="userSelect">
      <div className="user">
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="和田洸記" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>和田洸記</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="星野立樹" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>星野立樹</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
        <label className="checkboxItem">
          <input type="checkbox" name="checkbox" value="保本隆之介" className="checkbox" />
          <img src="./avatar.png" alt="" />
          <span>保本隆之介</span>
        </label>
      </div>
      <div className="buttom">
        <div className="addlist-wrapper">
          <button className="addlist">未返信リストに追加</button>
          <button className="icon-button">
            <img src="./カレンダー.png" alt="" />
          </button>
        </div>
        <button className="send">送信</button>
      </div>
    </div>
  );
};

export default AddUser;