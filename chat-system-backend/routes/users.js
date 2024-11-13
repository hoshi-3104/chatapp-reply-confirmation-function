var express = require('express');
var db = require('../utils/db'); // データベース接続の設定をインポート

require('dotenv').config();

var app = express();

/**
 * ユーザー取得API
 * 
 * フロントで下記のように記載して呼び出し (ユーザID:1のユーザ情報を取得)
 * var userId = 1;
 * const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
 *     method: 'GET',
 *         headers: {
 *             'Content-Type': 'application/json',
 *         },
 * });
 * 
 * if (!response.ok) {
 *    throw new Error('ネットワークエラー');
 * }
 * // レスポンスをJSON形式に変換
 * const result = await response.json();
 * 
 * // 取得したユーザ名をコンソールに出力（複数データがある場合、data[n]を変動させる）
 * console.log(result.data[0].USER_NAME);
 */
app.get('/api/users/:userId', function(req, res, next) {
  try {
    var sql = `
SELECT *
FROM USER_MASTER
WHERE USER_ID = ?;
`;

    db.query(sql, 
      [req.params.userId],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          throw new Error(err);
        }

      return res.status(200).json({
          result_code: 1,
          message: "",
          data: result
      });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});
// ユーザー一覧を取得するコード
app.get('/api/users', function(req, res, next) {
  try {
    var sql = `SELECT * FROM USER_MASTER;`;

    db.query(sql, (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          throw new Error(err);
        }

      return res.status(200).json({
          result_code: 1,
          message: "ユーザ一覧取得完了",
          data: result
        });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});
/**
 * ユーザー登録API
 * 
 * フロントで下記のように記載して呼び出し 
 * ER図でメインのIDの型を下記となっていれば、IDは連番で設定される
 * データ型:INT unsigned auto_increment
 * 
 * const response = await fetch('http://localhost:3001/api/users', {
 *     method: 'POST',
 *         headers: {
 *             'Content-Type': 'application/json',
 *         },
 *         body: JSON.stringify({
 *             userName: '登録したいユーザ名'
 *         }),
 * });
 */
app.post('/api/users', function(req, res, next) {
  try {
    var sql = `INSERT INTO USER_MASTER(USER_NAME, ICON_PATH) VALUES (?,?);`;

    db.query(sql, 
      [req.body.userName, req.body.iconPath],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          throw new Error(err);
        }

      return res.status(200).json({
          result_code: 1,
          message: "ユーザーが正常に登録されました"
      });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});

/**
 * ユーザー更新API
 * 
 * フロントで下記のように記載して呼び出し (ユーザID:1のユーザ名を更新)
 * const response = await fetch('http://localhost:3001/api/users', {
 *     method: 'PUT',
 *         headers: {
 *             'Content-Type': 'application/json',
 *         },
 *         body: JSON.stringify({
 *             userId: 1,
 *             userName: '更新したいユーザ名'
 *         }),
 * });
 */
app.put('/api/users', function(req, res, next) {
  try {
    var sql = `UPDATE USER_MASTER
     SET USER_NAME = ?
     WHERE USER_ID = ?;`;

    db.query(sql, 
      [req.body.userName, req.body.userId],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          throw new Error(err);
        }

      return res.status(200).json({
          result_code: 1,
          message: ""
      });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});

/**
 * ユーザー削除API
 * 
 * フロントで下記のように記載して呼び出し (ユーザID:1のユーザ情報を削除)
 * const response = await fetch('http://localhost:3001/api/users', {
 *     method: 'DELETE',
 *         headers: {
 *             'Content-Type': 'application/json',
 *         },
 *         body: JSON.stringify({
 *             userId: 1
 *         }),
 * });
 */
app.delete('/api/users', function(req, res, next) {
  try {
    var sql = `
DELETE FROM USER_MASTER
WHERE USER_ID = ?;
`;

    db.query(sql, 
      [req.body.userId],
      (err, result) => {
        // エラーが発生した場合は、catch (error)の処理に流す
        if (err) {
          throw new Error(err);
        }

      return res.status(200).json({
          result_code: 1,
          message: "ユーザーの削除が完了しました。"
      });
    });
  } catch (error) {
    // 次の処理へ
    next(error);
  }
});

module.exports = app;
