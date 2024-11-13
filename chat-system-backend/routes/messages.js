var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
require('dotenv').config();

var app = express();
app.use(express.json());

/**
 * メッセージ登録API
 * 
 * フロントで下記のように記載して呼び出し (ユーザID:1 → ユーザID:2 に送信したメッセージを登録)
 * ※ src\components\Chat.tsx の handleSend を参照
 * const response = await fetch('http://localhost:3001/api/messages', {
 *     method: 'POST',
 *     headers: {
 *         'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *         sendUserId: 1, // 送信元ユーザID
 *         toUserId: 2,   // 送信先ユーザID
 *         messages: '送信されたメッセージ',
 *     }),
 * });
 */
app.post('/api/messages', function(req, res, next) {
  try {
    var sql = `INSERT INTO MESSAGES(MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_SENT, SEND_TIME)
     VALUES (?, ?, ?, ?, false, false, CURRENT_TIMESTAMP);`;
    // フロントエンドの "messages" プロパティを使うように変更
    const {messages, to_user_id, send_user_id, thread_id } = req.body;
    const finalThreadId = thread_id || 0;
    // BODYの値が空でないことを確認
    if (!messages || messages.trim() === "") {
      return res.status(400).json({
        result_code: 0,
        message: "メッセージ本文が空です。"
      });
    }

    db.query(sql, 
      [messages, to_user_id, send_user_id, finalThreadId],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          return res.status(500).json({ result_code: 0, message: "データベースエラー" });
        }

      return res.status(200).json({
          result_code: 1,
          message: "message saved successfully"
      });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});

//メッセージ取得API
app.get('/api/messages', function(req, res, next) {
  try {
    const { send_user_id, to_user_id, thread_id } = req.query;

    // クエリパラメータが不正の場合のエラーハンドリング
    if (!send_user_id || !to_user_id) {
      return res.status(400).json({
        result_code: 0,
        message: "送信者IDと受信者IDは必須です。"
      });
    }

    // SQLクエリの構築
    let sql = `
      SELECT MESSAGE_ID, MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_SENT, SEND_TIME
      FROM MESSAGES
      WHERE (SEND_USER_ID = ? AND TO_USER_ID = ?)
        OR (SEND_USER_ID = ? AND TO_USER_ID = ?)
    `;

    // スレッドIDが指定されている場合、そのスレッドのメッセージだけを取得
    if (thread_id) {
      sql += " AND THREAD_ID = ?";
    }

    // メッセージを取得
    db.query(sql, [send_user_id, to_user_id, to_user_id, send_user_id, thread_id], (err, result) => {
      if (err) {
        return res.status(500).json({ result_code: 0, message: "データベースエラー" });
      }

      return res.status(200).json({
        result_code: 1,
        messages: result
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = app;
