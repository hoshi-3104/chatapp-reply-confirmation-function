import React, { useState } from 'react';
import Detail from "./components/detail/Detail";
import List from "./components/list/list";
import Chat from "./components/chat/Chat";

const App = () => {
    const [tabs, setTabs] = useState([
    { id: "chat", label: "チャット" },
  ]);
  const [selectedTab, setSelectedTab] = useState("chat");

  // 新しいタブを追加する関数
  const handleAddTab = async(messageId) => {
    const newTabId = tabs.length;
    const newTab = { id: newTabId , label: `タブ ${newTabId}` };
    try {
      // スレッド ID を更新する API を呼び出し
      const response = await fetch(`http://localhost:3001/api/threads/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: newTabId }), // 新しい thread_id を送信
      });
      if (!response.ok) {
        throw new Error(`HTTP エラー: ${response.status}`);
      }
      const result = await response.json();
      if (result.result_code === 1) {
        console.log("スレッド ID 更新成功:", result.message);
        // 新しいタブを追加
        setTabs((prevTabs) => [...prevTabs, newTab]);
        setSelectedTab(newTab.id);
      } else {
        console.error("スレッド ID 更新失敗:", result.message);
      }
    } catch (error) {
      console.error("API エラー:", error);
    }
  };

   const handleRemoveTab = (id) => {
     setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    if (selectedTab === id) {
       setSelectedTab(tabs[0]?.id || null); // 削除後に最初のタブを選択するか、何も選択しない
     }
   };


  return (
    <div className='container'>
      <List />
      <Chat 
      tabs={tabs} 
      selectedTab={selectedTab} 
      setSelectedTab={setSelectedTab} 
      onRemoveTab={handleRemoveTab}/>
      {/* handleAddTab を Detail に渡す */}
      <Detail onAddTab={handleAddTab} />
    </div>
  );
};

export default App;