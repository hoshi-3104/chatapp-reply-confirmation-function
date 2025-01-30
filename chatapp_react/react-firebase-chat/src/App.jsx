import React, { useState, useEffect } from 'react';
import Detail from "./components/detail/Detail";
import List from "./components/list/list";
import Chat from "./components/chat/Chat";

const App = () => {
  // const [messages, setMessages] = useState([]);
  const initialTabs = [{ id:  "chat", label: "チャット", messageId: null }];
  const [tabs, setTabs] = useState(() => {
    const savedTabs = JSON.parse(localStorage.getItem("tabs"));
    return savedTabs || initialTabs; // 保存されていなければ初期値を使用
  });
   //const [selectedTab, setSelectedTab] = useState("chat");
   //初期値を localStorage から取得する
   const [selectedTab, setSelectedTab] = useState(() => {
     const savedTab = localStorage.getItem("selectedTab");
     return savedTab || "chat"; // 保存された値があれば使用、なければ "chat"
   });
   console.log(tabs)
   //localStorage.clear();
  useEffect(() => {
    // タブが変更されるたびにローカルストレージに保存
    if (tabs.length > 0) {
      localStorage.setItem("tabs", JSON.stringify(tabs));
    }
  }, [tabs]);
  useEffect(() => {
    // 選択されたタブが変更されるたびにローカルストレージに保存
    if (selectedTab) {
      localStorage.setItem("selectedTab", selectedTab);
    }
  }, [selectedTab]);

  const [messageThreads, setMessageThreads] = useState([]); // メッセージごとのスレッドIDを保持する配列
  console.log(selectedTab)

  const handleAddTab = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/${messageId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP エラー: ${response.status}`);
      }

      const result = await response.json();
      if (result.result_code === 1) {
        const threadId = result.messages[0].THREAD_ID;
        // 既存のタブをチェック
        const existingTab = tabs.find((tab) => tab.id === threadId);
        if (existingTab) {
          // 既存のタブがある場合は選択状態に変更
          setSelectedTab(threadId);
        } else {
        const threadNumbers = tabs
        .filter(tab => tab.label.startsWith("スレッド"))
        .map(tab => parseInt(tab.label.replace("スレッド", "")));  // 「スレッド X」から番号を取り出す
        const nextTabNumber = Math.max(...threadNumbers, 0) + 1;  // 次に追加するタブ番号を決定
        const newTab = { id: threadId, label: `スレッド${nextTabNumber}`, messageId };

        setTabs((prevTabs) => {
          const updatedTabs = [...prevTabs, newTab];
          return updatedTabs;
        });

        setMessageThreads((prevThreads) => [...prevThreads, { messageId, threadId }]);
        setSelectedTab(threadId);
      }
      } else {
        console.error("スレッドID取得失敗:", result.message);
      }
    } catch (error) {
      console.error("APIエラー:", error);
    }
    //window.location.reload();
  };

  const handleRemoveTab = async (id) => {
    try {
      const tabToRemove = tabs.find((tab) => tab.id === id);
      let messageId = null;
      if (tabToRemove) {
        messageId = tabToRemove.messageId;
      }

      setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));

      if (selectedTab === id) {
        setSelectedTab(tabs[0]?.id || null);
      }
    } catch (error) {
      console.error("エラー:", error);
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