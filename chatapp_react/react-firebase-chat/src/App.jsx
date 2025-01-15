import React, { useState } from 'react';
import Detail from "./components/detail/Detail";
import List from "./components/list/list";
import Chat from "./components/chat/Chat";
import Login from './components/login/Login';

const App = () => {
    const [tabs, setTabs] = useState([
    { id: "chat", label: "チャット" },
  ]);
  const [selectedTab, setSelectedTab] = useState("chat");

  // 新しいタブを追加する関数
  const handleAddTab = () => {
    const newTab = { id: tabs.length , label: `タブ ${tabs.length}` };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setSelectedTab(newTab.id);
  };

  const handleRemoveTab = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    if (selectedTab === id) {
      setSelectedTab(tabs[0]?.id || null); // 削除後に最初のタブを選択するか、何も選択しない
    }
  };

  // const user = true
  const [user, setUser] = useState(false); // user 状態を追加
  const [username, setUsername] = useState(''); // username 状態を追加

  return (
    <div className='container'>
      {
        user ? (
        <>
          <List 
          username={username}/>
          <Chat 
          tabs={tabs} 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab} 
          onRemoveTab={handleRemoveTab}
          username={username}/>
          <Detail onAddTab={handleAddTab} />
        </>
        ) : (
        <Login 
        setUser={setUser}
        setUsername={setUsername} /> )
      }
      
    </div>
  );
};

export default App;
