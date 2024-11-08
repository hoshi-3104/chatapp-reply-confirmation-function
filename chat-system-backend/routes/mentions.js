var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート
const bodyParser = require('body-parser');

require('dotenv').config();

var app = express();
// json形式できたパラメータを変換する
app.use(express.json());

app.post('/api/mentions', function(req, res, next) {
    try {
      var sql = `INSERT INTO MENTION(mention_message_id, to_mention_user_id) VALUES (?,?);`;
  
      db.query(sql, 
        [req.body.mention_message_id, req.body.to_mention_user_id],
        (err, result) => {
          // エラーが発生した場合は、catch (error)の処理に流す
          if (err) {
            throw new Error(err);
          }
  
        return res.status(200).json({
            result_code: 1,
            message: "メンションが追加されました。"
        });
      });
    } catch (error) {
      // 次の処理へ
      next(error);
    }
  });
  // 特定メッセージのメンション取得
app.get('/api/mentions/:messageId', function(req, res, next) {
    const sql = `SELECT * FROM MENTION WHERE mention_message_id = ?`;
    db.query(sql, [req.params.mention_message_id], function(err, results) {
      if (err) return next(err);
      res.status(200).json(results);
    });
  });
  module.exports = app;