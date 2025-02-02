var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
require('dotenv').config();

var app = express();
app.use(express.json());

//メッセージ送信api（postメソッド）
app.post('/api/messages', function(req, res, next) {
  const {messages, to_user_id, send_user_id, thread_id, is_replied, limit_time} = req.body;

  try {
    const sql = `INSERT INTO MESSAGES(MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME)
     VALUES (?, ?, ?, ?,0, ? , CURRENT_TIMESTAMP, ?);`;
    const finalThreadId = thread_id || 0;
    // BODYの値が空でないことを確認
    if (!messages || messages.trim() === "") {
      return res.status(400).json({
        result_code: 0,
        message: "メッセージ本文が空です。"
      });
    }
    // is_repliedの値を確認（未設定の場合はデフォルトで0を使用）
    const finalIsReplied = typeof is_replied !== 'undefined' ? is_replied : 0;

    const finalLimitTime = limit_time || new Date().toISOString();  // limit_timeが空なら現在の日時を設定
    db.query(sql, 
      [messages, to_user_id, send_user_id, finalThreadId, finalIsReplied, finalLimitTime],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          return res.status(500).json({ result_code: 0, message: "データベースエラー" });
        }

      return res.status(200).json({
          result_code: 1,
          message: "メッセージが正常に送信されました。"
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
      SELECT MESSAGE_ID, MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME
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
app.get('/api/messages/:message_id', function(req, res, next) {
  try {
    const { message_id } = req.params;  // URLパラメータからmessage_idを取得

    // message_idが指定されていない場合のエラーハンドリング
    if (!message_id) {
      return res.status(400).json({
        result_code: 0,
        message: "メッセージIDが指定されていません。"
      });
    }

    // SQLクエリの構築
    const sql = `
      SELECT MESSAGE_ID, MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME
      FROM MESSAGES
      WHERE MESSAGE_ID = ?
    `;

    // message_idでメッセージを取得
    db.query(sql, [message_id], (err, result) => {
      if (err) {
        return res.status(500).json({ result_code: 0, message: "データベースエラー" });
      }
      
      // メッセージが見つからなかった場合
      if (result.length === 0) {
        return res.status(404).json({
          result_code: 0,
          message: "指定されたメッセージは存在しません。"
        });
      }

      // メッセージを正常に取得した場合
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