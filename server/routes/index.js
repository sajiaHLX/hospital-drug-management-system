var express = require('express');
var router = express.Router();
var sql_connect = require('../public/mysql/sql_connect');
var mysql = require('mysql');
const bodyParse = require('body-parser')
router.use(bodyParse())


// 用户登录
router.post('/login', function (req, res, next) {
  let name = req.body.username
  let pwd = req.body.password
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM user WHERE username = '${name}'`;
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      if(result.length == 0){
        data.meta.status = 500
        data.meta.msg = "登陆失败！请检查用户名或密码是否正确！"
        res.send(data);
      }else{
        console.log(result)
        data.meta.status = 200
        data.data.data = result[0]
        res.send(data);
      }
    }
  });

  connection.end();
})

module.exports = router;