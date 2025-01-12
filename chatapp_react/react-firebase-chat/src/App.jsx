import React, { useState } from 'react';
import Detail from "./components/detail/Detail";
import List from "./components/list/list";
import Chat from "./components/chat/Chat";

const App = () => {
    const [tabs, setTabs] = useState([
    { id: "chat", label: "チャット" },
  ]);
  const [selectedTab, setSelectedTab] = useState(1);

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
