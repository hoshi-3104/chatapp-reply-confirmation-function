var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
require('dotenv').config();

var app = express();
app.use(express.json());

// メッセージ送信（スレッド挿入なし）API
app.post('/api/messages/simple', function (req, res, next) {
  const { messages, to_user_id, send_user_id, thread_id, is_replied, limit_time } = req.body;

  try {
    const insertMessageSql = `
      INSERT INTO MESSAGES (MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME)
      VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, ?);
    `;

    const finalIsReplied = typeof is_replied !== 'undefined' ? is_replied : 0; // is_repliedが未定義の場合は0
    const finalLimitTime = limit_time || new Date().toISOString(); // limit_timeが空なら現在日時

    db.query(insertMessageSql, [messages, to_user_id, send_user_id,thread_id, finalIsReplied, finalLimitTime], (err, result) => {
      if (err) {
        console.error("メッセージ挿入エラー:", err);
        return res.status(500).json({ result_code: 0, message: "メッセージ挿入に失敗しました。" });
      }

      res.status(200).json({
        result_code: 1,
        message: "メッセージ送信に成功しました。",
      });
    });
  } catch (error) {
    console.error("サーバーエラー:", error);
    next(error);
  }
});

app.post('/api/messages', function (req, res, next) {
  const { messages, to_user_id, send_user_id, thread_id, is_replied, limit_time } = req.body;

  try {
    const insertMessageSql = `
      INSERT INTO MESSAGES (MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME)
      VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, ?);
    `;

    const finalThreadId = thread_id || 0; // スレッドIDが指定されていない場合は0
    const finalIsReplied = typeof is_replied !== 'undefined' ? is_replied : 0; // is_repliedが未定義の場合は0
    const finalLimitTime = limit_time || new Date().toISOString(); // limit_timeが空なら現在日時

    // メッセージを挿入
    db.query(insertMessageSql, [messages, to_user_id, send_user_id, finalThreadId, finalIsReplied, finalLimitTime], (err, result) => {
      if (err) {
        console.error("メッセージ挿入エラー:", err);
        return res.status(500).json({ result_code: 0, message: "メッセージ挿入に失敗しました。" });
      }

      // 挿入したメッセージの最大IDを取得
      const getMaxMessageIdSql = `SELECT MAX(MESSAGE_ID) AS max_message_id FROM MESSAGES`;

      db.query(getMaxMessageIdSql, (err, results) => {
        if (err) {
          console.error("最大メッセージID取得エラー:", err);
          return res.status(500).json({ result_code: 0, message: "最大メッセージID取得に失敗しました。" });
        }

        const maxMessageId = results[0].max_message_id;

        // スレッドテーブルに挿入
        const insertThreadSql = `
          INSERT INTO THREAD (PARENT_MESSAGE_ID)
          VALUES (?);
        `;

        db.query(insertThreadSql, [maxMessageId], (err, threadResult) => {
          if (err) {
            console.error("スレッド挿入エラー:", err);
            return res.status(500).json({ result_code: 0, message: "スレッド挿入に失敗しました。" });
          }

          // スレッドテーブルからスレッドIDの最大値を取得
          const getMaxThreadIdSql = `SELECT MAX(THREAD_ID) AS max_thread_id FROM THREAD`;

          db.query(getMaxThreadIdSql, (err, threadResults) => {
            if (err) {
              console.error("最大スレッドID取得エラー:", err);
              return res.status(500).json({ result_code: 0, message: "最大スレッドID取得に失敗しました。" });
            }

            const maxThreadId = threadResults[0].max_thread_id;

            // メッセージテーブルを更新
            const updateMessageThreadSql = `
              UPDATE MESSAGES
              SET THREAD_ID = ?
              WHERE MESSAGE_ID = ?;
            `;

            db.query(updateMessageThreadSql, [maxThreadId, maxMessageId], (err, updateResult) => {
              if (err) {
                console.error("メッセージのスレッドID更新エラー:", err);
                return res.status(500).json({ result_code: 0, message: "メッセージのスレッドID更新に失敗しました。" });
              }

              res.status(200).json({
                result_code: 1,
                message: "メッセージ送信、スレッド挿入、スレッドID更新に成功しました。",
                message_id: maxMessageId,
                thread_id: maxThreadId,
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("サーバーエラー:", error);
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
app.get('/api/messages/thread/:thread_id', function (req, res, next) {
  try {
    const { thread_id } = req.params; // URLパラメータからスレッドIDを取得

    // thread_idが指定されていない場合のエラーハンドリング
    if (!thread_id) {
      return res.status(400).json({
        result_code: 0,
        message: "スレッドIDが指定されていません。",
      });
    }

    // SQLクエリの構築
    const sql = `
      SELECT MESSAGE_ID, MESSAGES, TO_USER_ID, SEND_USER_ID, THREAD_ID, SEEN, IS_REPLIED, SEND_TIME, LIMIT_TIME
      FROM MESSAGES
      WHERE THREAD_ID = ?
      ORDER BY SEND_TIME ASC; -- 送信時間でソート（必要に応じて変更可能）
    `;

    // thread_idでメッセージを取得
    db.query(sql, [thread_id], (err, results) => {
      if (err) {
        console.error("データベースエラー:", err);
        return res.status(500).json({
          result_code: 0,
          message: "データベースエラーが発生しました。",
        });
      }

      // メッセージが見つからなかった場合
      if (results.length === 0) {
        return res.status(404).json({
          result_code: 0,
          message: "指定されたスレッドIDのメッセージが存在しません。",
        });
      }

      // メッセージを正常に取得した場合
      return res.status(200).json({
        result_code: 1,
        messages: results,
      });
    });
  } catch (error) {
    console.error("サーバーエラー:", error);
    next(error);
  }
});

module.exports = app;