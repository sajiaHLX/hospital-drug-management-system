var express = require('express');
var router = express.Router();
var sql_connect = require('../public/mysql/sql_connect');
var mysql = require('mysql');
const bodyParse = require('body-parser')
router.use(bodyParse())

/* GET users listing. */
// 获取用户列表
router.get('/', function (req, res, next) {
  let query = req.query.query
  let pagenum = req.query.pagenum
  let pagesize = req.query.pagesize
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = 'SELECT * FROM user';
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  //查
  if (query == '') {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        // data.data.users = result
        // console.log(req.query)
        res.send(data);
        return;
      } else {
        console.log(result)
        data.meta.status = 200
        data.data.total = result.length
        data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  } else {
    connection.query(`${sql} WHERE username = "${query}"`, function (err, result) {
      if (err) {
        data.meta.status = 500
        console.log(err)
        // data.data.users = result
        // console.log(req.query)
        res.send(data);
        return;
      } else {
        data.meta.status = 200
        data.data.total = result.length
        data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  }


  connection.end();
});
// 获取编辑用户信息
router.get('/:id', function (req, res, next) {
  let id = req.params.id
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM user WHERE id = '${id}'`;
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  //查
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return;
    } else {
      console.log(result)
      data.meta.status = 200
      data.data.users = result[0]
      res.send(data);
    }
  });
  connection.end();
});
// 插入用户
router.post('/', function (req, res, next) {
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `INSERT INTO user(username,password,email,mobile,role_name,mg_state) VALUES(?,?,?,?,'user',0)`;
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  let addForm = []
  for (const iterator of Object.values(req.body)) {
    addForm.push(iterator)
  }
  connection.query(sql, addForm, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      data.meta.status = 200
      res.send(data);
    }
  });

  connection.end();
})
// 更新用户
router.put('/:id', function (req, res, next) {
  let id = req.params.id
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  let editForm = []
  for (const iterator of Object.values(req.body)) {
    editForm.push(iterator)
  }
  var sql = `UPDATE user SET email = '${req.body.email}',mobile = '${req.body.mobile}' WHERE id = ${id}`;
  // console.log(addForm)
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      console.log(result)
      data.meta.status = 200
      res.send(data);
    }
  });

  connection.end();
})
// 更新用户
router.put('/:id/role', function (req, res, next) {
  let roles = {
    '1':'user',
    '2':'super_user'
  }
  let id = req.params.id
  let rid = req.body.rid
  
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  let editForm = []
  for (const iterator of Object.values(req.body)) {
    editForm.push(iterator)
  }
  var sql = `UPDATE user SET role_name = '${roles[rid]}' WHERE id = ${id}`;
  // console.log(addForm)
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      console.log(result)
      data.meta.status = 200
      res.send(data);
    }
  });

  connection.end();
})
// 更新用户状态
router.put('/:id/state/:mg_state', function (req, res, next) {
  let id = req.params.id
  let state = req.params.mg_state
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let data = {
    meta: {
      status: 200
    },
    data: {}
  }
  let editForm = []
  for (const iterator of Object.values(req.body)) {
    editForm.push(iterator)
  }
  var sql = `UPDATE user SET mg_state = '${state}' WHERE id = ${id}`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      console.log(result)
      data.meta.status = 200
      res.send(data);
    }
  });

  connection.end();
})
// 删除用户
router.delete('/:id',function(req, res, next) {
  let id = req.params.id
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let data = {
    meta:{
      status : 200
    },
    data:{}
  }
  let sql = `DELETE FROM user where id=${id}`
  connection.query(sql,function(err,result){
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      data.meta.status = 500
      res.send(data);
      return
    } else {
      console.log(result)
      data.meta.status = 200
      res.send(data);
    }
  })
})
module.exports = router;