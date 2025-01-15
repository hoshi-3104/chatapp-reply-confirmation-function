var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート

require('dotenv').config();

var app = express();

app.put('/api/threads/:messageId', function (req, res, next) {
  const messageId = req.params.messageId;
  const { threadId } = req.body; // リクエストボディから thread_id を取得

  // 現在の thread_id を取得
  const checkSql = `SELECT THREAD_ID FROM MESSAGES WHERE MESSAGE_ID = ?`;
  
  db.query(checkSql, [messageId], function (err, results) {
    if (err) {
      console.error("データベースエラー:", err);
      return next(err);
    }

    // thread_id が 0 の場合のみ更新する
    if (results.length > 0) {
      const sql = `
        UPDATE MESSAGES
        SET THREAD_ID = ?
        WHERE MESSAGE_ID = ?
      `;
      
      db.query(sql, [threadId, messageId], function (err, results) {
        if (err) {
          console.error("データベースエラー:", err);
          return next(err);
        }

        if (results.affectedRows === 1) {
          res.status(200).json({
            result_code: 1,
            message: "スレッドID更新成功",
          });
        } else {
          res.status(400).json({
            result_code: 0,
            message: "スレッドID更新失敗",
          });
        }
      });
    } else {
      res.status(400).json({
        result_code: 0,
        message: "thread_id は 0 の場合のみ更新できます",
      });
    }
  });
});

module.exports = app;