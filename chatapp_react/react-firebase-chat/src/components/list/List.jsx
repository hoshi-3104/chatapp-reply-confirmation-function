import "./list.css"
import ChatList from "./chatList/ChatList"
import Userinfo from "./userInfo/Userinfo"
const List = ({username}) => {
    return (
      <div className='list'>
        <Userinfo
        username={username}/>
        <ChatList/>
      </div>
    )
  }
  
  export default List