const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 必要ならCORSをインポート

const app = express();
const PORT = 3000;

// JSONファイルパス
const jsonFilePath = "./message_data/mockData.json"
// JSONデータの読み込み
const readJSON = () => {
  try {
    if (!fs.existsSync(jsonFilePath)) {
      console.warn('JSONファイルが存在しません。新しいファイルを作成します。');
      return { messages: [] };
    }

    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('JSON読み込みエラー:', error);
    return { messages: [] };
  }
};

// JSONデータの保存
const writeJSON = (data) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('JSON書き込みエラー:', error.message);
    throw new Error('JSONデータの保存に失敗しました。');
  }
};

// ミドルウェア
app.use(cors());
app.use(express.json());

// メッセージ取得エンドポイント
app.get('/api/messages', (req, res) => {
  const data = readJSON();
  res.json(data.messages);
});

// メッセージ保存エンドポイント
app.post('/api/messages', (req, res) => {
  try {
    const newMessage = req.body;

    if (!newMessage || !newMessage.text) {
      return res.status(400).json({ result_code: 0, message: '無効なメッセージデータです' });
    }

    const data = readJSON();
    data.messages = data.messages || [];
    data.messages.push(newMessage);

    writeJSON(data);

    res.json({ result_code: 1, message: 'メッセージが保存されました' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).json({ result_code: 0, message: 'サーバーエラーが発生しました' });
  }
});

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
