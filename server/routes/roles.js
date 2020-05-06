var express = require('express');
var router = express.Router();
var sql_connect = require('../public/mysql/sql_connect');
var mysql = require('mysql');


// 获取角色列表
router.get('/', function (req, res, next) {
  let data = {
    meta: {
      status: 200
    },
    data: [{
      id: 1,
      roleName: 'user'
    }, {
      id: 2,
      roleName: 'super_user'
    }]
  }
  res.send(data);
});
// 获取单位列表
router.get('/unit', function (req, res, next) {
  let unit = req.query.unit
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM medicine.unit`;
  var sql1 = `INSERT INTO medicine.unit(unit) VALUES(?)`
  if (unit) {
    connection.query(sql1, unit, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        data.meta.status = 500
        res.send(data);
        return
      } else {
        if (result.length == 0) {
          data.meta.status = 500
          data.meta.msg = "添加失败！请稍后再试！"
          res.send(data);
        } else {
          data.meta.status = 200
          data.data.data = result
          res.send(data);
        }
      }
    })
  } else {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        data.meta.status = 500
        res.send(data);
        return
      } else {
        if (result.length == 0) {
          data.meta.status = 500
          data.meta.msg = "获取单位列表失败！请稍后再试！"
          res.send(data);
        } else {
          console.log(result)
          data.meta.status = 200
          data.data.data = result
          res.send(data);
        }
      }
    });
  }
  connection.end();
})
// 删除单位
router.delete('/unit', function (req, res, next) {
  let id = req.query.id
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = `DELETE FROM medicine.unit where id=${id}`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      if (result.length == 0) {
        data.meta.status = 500
        data.meta.msg = "删除失败！请稍后再试！"
        res.send(data);
      } else {
        data.meta.status = 200
        data.data.data = result
        res.send(data);
      }
    }
  })
  connection.end();
})
// 获取供货商列表
router.get('/company', function (req, res, next) {
  let company = req.query.company
  console.log(company)
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM medicine.company`;
  var sql1 = `INSERT INTO medicine.company(name) VALUES(?)`
  if (company) {
    connection.query(sql1, company, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        data.meta.status = 500
        res.send(data);
        return
      } else {
        if (result.length == 0) {
          data.meta.status = 500
          data.meta.msg = "添加失败！请稍后再试！"
          res.send(data);
        } else {
          data.meta.status = 200
          data.data.data = result
          res.send(data);
        }
      }
    })
  } else {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        data.meta.status = 500
        res.send(data);
        return
      } else {
        if (result.length == 0) {
          data.meta.status = 500
          data.meta.msg = "获取供货商列表失败！请稍后再试！"
          res.send(data);
        } else {
          console.log(result)
          data.meta.status = 200
          data.data.data = result
          res.send(data);
        }
      }
    });
  }
  connection.end();
})
// 删除供货商列表
router.delete('/company', function (req, res, next) {
  let id = req.query.id
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = `DELETE FROM medicine.company where id=${id}`
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      if (result.length == 0) {
        data.meta.status = 500
        data.meta.msg = "删除失败！请稍后再试！"
        res.send(data);
      } else {
        data.meta.status = 200
        data.data.data = result
        res.send(data);
      }
    }
  })
  connection.end();
})
module.exports = router;