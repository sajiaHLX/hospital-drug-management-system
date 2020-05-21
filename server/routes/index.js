var express = require('express');
var router = express.Router();
var sql_connect = require('../public/mysql/sql_connect');
var mysql = require('mysql');
const bodyParse = require('body-parser')
router.use(bodyParse())
let captcha = -1;

// 用户登录
router.post('/login', function (req, res, next) {
  let name = req.body.username
  let pwd = req.body.password
  let cap = req.body.captcha
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  if (Number(cap) !== captcha) {
    data.meta.status = 500
    data.meta.msg = "验证码错误！"
    res.send(data)
    return
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM user WHERE username = '${name}'`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      if (result.length == 0) {
        data.meta.status = 500
        data.meta.msg = "登陆失败！请检查用户名或密码是否正确！"
        res.send(data);
      } else {
        console.log(result[0]);
        if (result[0].password === pwd) {
          data.meta.status = 200;
          data.data.data = result[0];
          var sql1 = `INSERT INTO loginlog(username,date) VALUES(?,?)`;
          var date = new Date();
          connection.query(sql1, [name, date], function (err, result) {
            if (err) {
              console.log('[SELECT ERROR] - ', err.message);
            } else {
              if(result.length !== 0){
                console.log('添加成功');
              }
            }
          });
          res.send(data);
        } else {
          data.meta.status = 500
          data.meta.msg = "登陆失败！请检查用户名或密码是否正确！"
          res.send(data);
        }
      }
    }
  });
})

// 验证码
router.get('/captcha', function (req, res, next) {
  let a = Math.floor(Math.random() * 9)
  let b = Math.floor(Math.random() * 9)
  let data = {
    meta: {
      status: 200
    },
    data: {
      captcha: `${a} + ${b} = `
    }
  }
  captcha = a + b
  res.send(data)
})

module.exports = router;