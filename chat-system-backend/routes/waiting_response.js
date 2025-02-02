var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート

require('dotenv').config();

var app = express();

// 未返信リスト取得API
app.get('/api/waiting_response/:sendUserId', function (req, res, next) {
    // ユーザーIDを取得
    const sendUserId = req.params.sendUserId;
  
    // SQLクエリ: 未返信メッセージを取得
    const sql = `
      SELECT 
        MESSAGE_ID, 
        MESSAGES, 
        TO_USER_ID, 
        SEND_USER_ID, 
        THREAD_ID, 
        SEND_TIME, 
        LIMIT_TIME 
      FROM MESSAGES
      WHERE IS_REPLIED = 0 
        AND SEND_USER_ID = ?
    `;
  
    db.query(sql, [sendUserId], function (err, results) {
      if (err) {
        console.error("データベースエラー:", err);
        return next(err);
      }
  
      // レスポンスとして未返信リストを返す
      res.status(200).json({
        result_code: 1,
        data: results,
      });
    });
  });

  module.exports = app;