var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
require('dotenv').config();

var app = express();
app.use(express.json());

//メッセージ送信api（postメソッド）
app.post('/api/messages', function(req, res, next) {
  const {messages, to_user_id, send_user_id, thread_id } = req.body;

  try {
    const sql = `INSERT INTO MESSAGES(MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME)
     VALUES (?, ?, ?, ?,0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
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

module.exports = app;







var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
require('dotenv').config();

var app = express();
app.use(express.json());

// メッセージ送信API（メンション対応）
app.post('/api/messages', function (req, res, next) {
 const { messages, to_user_id, send_user_id, thread_id, mention_user_ids } = req.body;

 // SQLクエリ: メッセージを挿入
 const insertMessageSql = `
   INSERT INTO MESSAGES (
     MESSAGES, 
     TO_USER_ID, 
     SEND_USER_ID, 
     THREAD_ID, 
     SEEN, 
     IS_REPLIED, 
     SEND_TIME, 
     LIMIT_TIME
   ) VALUES (?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY));
 `;

 // SQLクエリ: メンション情報を挿入
 const insertMentionSql = `
   INSERT INTO MENTION (
     mention_message_id, 
     to_mention_user_id
   ) VALUES (?, ?);
 `;

 // 入力検証
 if (!messages || messages.trim() === "") {
   return res.status(400).json({
     result_code: 0,
     message: "メッセージ本文が空です。"
   });
 }

 // トランザクションを開始
 db.beginTransaction(function (err) {
   if (err) return next(err);

   // MESSAGESテーブルにメッセージを挿入
   db.query(insertMessageSql, [messages, to_user_id, send_user_id, thread_id || 0], function (err, result) {
     if (err) {
       return db.rollback(function () {
         return res.status(500).json({
           result_code: 0,
           message: "メッセージの送信に失敗しました。"
         });
       });
     }

     const insertedMessageId = result.insertId;

     // メンションがある場合、MENTIONテーブルに挿入
     if (mention_user_ids && Array.isArray(mention_user_ids) && mention_user_ids.length > 0) {
       const mentionPromises = mention_user_ids.map((mentionUserId) => {
         return new Promise((resolve, reject) => {
           db.query(insertMentionSql, [insertedMessageId, mentionUserId], function (err) {
             if (err) return reject(err);
             resolve();
           });
         });
       });

       // 全てのメンション挿入クエリが成功したか確認
       Promise.all(mentionPromises)
         .then(() => {
           // コミットして完了
           db.commit(function (err) {
             if (err) {
               return db.rollback(function () {
                 return res.status(500).json({
                   result_code: 0,
                   message: "トランザクションのコミットに失敗しました。"
                 });
               });
             }

             return res.status(200).json({
               result_code: 1,
               message: "メッセージとメンションが正常に送信されました。",
               //message_id: insertedMessageId
             });
           });
         })
         .catch((err) => {
           // メンション挿入のいずれかが失敗した場合
           return db.rollback(function () {
             return res.status(500).json({
               result_code: 0,
               message: "メンションの追加に失敗しました。",
               error: err.message
             });
           });
         });
     } else {
       // メンションがない場合はそのままコミット
       db.commit(function (err) {
         if (err) {
           return db.rollback(function () {
             return res.status(500).json({
               result_code: 0,
               message: "トランザクションのコミットに失敗しました。"
             });
           });
         }

         return res.status(200).json({
           result_code: 1,
           message: "メッセージが正常に送信されました。",
           //message_id: insertedMessageId
         });
       });
     }
   });
 });
});

module.exports = app;