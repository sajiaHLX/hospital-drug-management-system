var express = require('express');
var router = express.Router();
var sql_connect = require('../public/mysql/sql_connect');
var mysql = require('mysql');
const bodyParse = require('body-parser')
router.use(bodyParse())

// 获取药品列表
router.post('/', function (req, res, next) {
  let query = req.body.params.query
  let pagenum = req.body.params.pagenum
  let pagesize = req.body.params.pagesize
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = 'SELECT * FROM medicine';
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
        data.meta.status = 200
        data.data.total = result.length
        data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  } else {
    connection.query(`${sql} WHERE name = "${query}"`, function (err, result) {
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
  }


  connection.end();
});

// 获取日志操作列表
router.post('/log', function (req, res, next) {
  let query = req.body.params.query
  let pagenum = req.body.params.pagenum
  let pagesize = req.body.params.pagesize
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = 'SELECT * FROM medicine.editlog';
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
    connection.query(`${sql} WHERE user = "${query}"`, function (err, result) {
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
  }
  connection.end();
});

// 获取入库列表
router.post('/in', function (req, res, next) {
  let query = req.body.params.query
  let pagenum = req.body.params.pagenum
  let pagesize = req.body.params.pagesize
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = 'SELECT * FROM medicinein';
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
        data.meta.status = 200
        data.data.total = result.length
        data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  } else {
    connection.query(`${sql} WHERE user = "${query}"`, function (err, result) {
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
  }
  connection.end();
});

// 药品入库
router.put('/in', function (req, res, next) {
  let code = req.body.code
  let name = req.body.name
  let number = req.body.number
  let unit = req.body.unit
  let d_price = req.body.d_price
  let j_price = req.body.j_price
  let newMedicine = [code, name, number, unit, d_price, j_price]
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = 'INSERT INTO medicinein(code,name,number,unit,d_price,j_price,pay_price,user,data) VALUES(?,?,?,?,?,?,?,?,?)';
  let sql1 = `SELECT * FROM medicine WHERE code = ${code}`;
  let sql2 = ''
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  let addForm = []
  let oldNum = 0
  for (const iterator of Object.values(req.body)) {
    addForm.push(iterator)
  }
  // 修改药品库存
  new Promise((resolve, reject) => {
    connection.query(sql1, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        // res.send(data);
        return;
      } else {
        if (result.length !== 0) {
          oldNum = result[0].number
          sql2 = `UPDATE medicine SET number = '${oldNum * 1 + number * 1}' WHERE code = ${code}`
          resolve(sql2)
        } else {
          sql2 = 'INSERT INTO medicine(code,name,number,unit,d_price,j_price) VALUES(?,?,?,?,?,?)'
          reject(sql2)
        }
      }
    });
  }).then((sql2) => {
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        return;
      } else {
        data.meta.status = 200
        console.log("xiugaichenggong")
      }
    });
  }, (sql2) => {
    connection.query(sql2, newMedicine, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        return;
      } else {
        data.meta.status = 200
      }
    });
  })

  // 插入药品入库单
  connection.query(sql, addForm, function (err, result) {
    if (err) {
      console.log(err)
      data.meta.status = 500
      res.send(data);
      return;
    } else {
      data.meta.status = 200
      // data.data.total = result.length
      // data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
      res.send(data);
    }
  });
  // connection.end();
})

// 获取出库列表
router.post('/out', function (req, res, next) {
  let query = req.body.params.query
  let pagenum = req.body.params.pagenum
  let pagesize = req.body.params.pagesize
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = 'SELECT * FROM medicineout';
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
        data.meta.status = 200
        data.data.total = result.length
        data.data.users = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  } else {
    connection.query(`${sql} WHERE user = "${query}"`, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
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
});

// 药品出库
router.put('/out', function (req, res, next) {
  let code = req.body.code
  let number = req.body.number
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = 'INSERT INTO medicineout(code,name,number,unit,pl_price,pd_price,user,data) VALUES(?,?,?,?,?,?,?,?)';
  let sql1 = `SELECT * FROM medicine WHERE code = ${code}`;
  let sql2 = ''
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  let addForm = []
  let oldNum = 0
  for (const iterator of Object.values(req.body)) {
    addForm.push(iterator)
  }
  // 修改药品库存
  new Promise((resolve, reject) => {
    connection.query(sql1, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        reject()
      } else {
        if (result.length !== 0) {
          oldNum = result[0].number
          if (oldNum * 1 - number * 1 < 0) {
            reject("库存不足")
          }
          sql2 = `UPDATE medicine SET number = '${oldNum * 1 - number * 1}' WHERE code = ${code}`
          resolve(sql2)
        } else {
          reject("请检查药品编号是否正确！")
        }
      }
    });
  }).then((sql2) => {
    connection.query(sql2, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        return;
      } else {
        data.meta.status = 200
        return Promise.resolve()
      }
    });
  }).then(() => {
    // 插入药品出库单
    connection.query(sql, addForm, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        res.send(data);
        return;
      } else {
        data.meta.status = 200
        res.send(data);
      }
    });
  }).catch((msg) => {
    data.meta.status = 500
    data.data.msg = msg
    res.send(data);
    return;
  })
  // connection.end();
})

// 查询药品名称
router.get('/', function (req, res, next) {
  let code = req.query.code
  console.log(req.query)
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM medicine WHERE code = ${code}`;
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err)
      data.meta.status = 500
      // data.data.users = result
      // console.log(req.query)
      res.send(data);
      return;
    } else {
      data.meta.status = 200
      data.data.users = result
      res.send(data);
    }
  });
  connection.end();
});

// 药品采购
router.get('/buy', function (req, res, next) {
  let query = req.query.query
  let pagenum = req.query.pagenum
  let pagesize = req.query.pagesize
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  var sql = `SELECT * FROM medicinebuy`
  if (query == '') {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        res.send(data)
      } else {
        data.meta.status = 200
        data.data.total = result.length
        data.data.buyList = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data)
      }
    })
  } else {
    connection.query(`${sql} WHERE user = "${query}"`, function (err, result) {
      if (err) {
        console.log(err)
        data.meta.status = 500
        res.send(data);
        return;
      } else {
        data.meta.status = 200
        data.data.total = result.length
        data.data.buyList = result.splice((pagenum - 1) * pagesize, pagesize)
        res.send(data);
      }
    });
  }
})

// 更新药品库存
router.post('/buy', function (req, res, next) {
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  let id = req.body.id
  var connection = mysql.createConnection(sql_connect);
  console.log(req.body)
  connection.connect();
  let sql = `UPDATE medicinebuy SET handle = '${req.body.handle}' WHERE id = ${id}`;
  let addForm = []
  for (const iterator of Object.values(req.body)) {
    addForm.push(iterator)
  }
  connection.query(sql, addForm, function (err, result) {
    if (err) {
      console.log(err)
      data.meta.status = 500
      res.send(data)
    } else {
      data.meta.status = 200
      res.send(data)
    }
  });

  // connection.end();
})

// 修改药品库存
router.put('/buy', function (req, res, next) {
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = `INSERT INTO medicinebuy(name,number,unit,manufacturers,order_unit,supply_unit,user,mobile,date,handle) VALUES(?,?,?,?,?,?,?,?,?,'未处理')`;
  let addForm = []
  console.log(req.body)
  for (const iterator of Object.values(req.body)) {
    addForm.push(iterator)
  }
  // 修改药品库存
  connection.query(sql, addForm, function (err, result) {
    if (err) {
      console.log(err)
      data.meta.status = 500
      res.send(data)
    } else {
      data.meta.status = 200
      res.send(data)
    }
  });

  // connection.end();
})

// 数据错误时修改药品库存
router.post('/medicineEdit', function (req, res, next) {
  let data = {
    meta: {
      status: 200
    },
    data: {
      total: 0
    }
  }
  let code = req.body.params.code
  let item = req.body.params.editItem
  let value = req.body.params.editValue
  let name = req.body.params.name
  let editItem = ''
  switch (req.body.params.editItem) {
    case 'number':
      editItem = '药品数量'
      break;
    case 'name':
      editItem = '药品名称'
      break;
    case 'd_price':
      editItem = '单价'
      break;
  }
  let old = req.body.params.old
  let user = req.body.params.user
  let date = req.body.params.date
  let arry = [code, name, editItem, old, value, user, date]

  var connection = mysql.createConnection(sql_connect);
  connection.connect();
  let sql = `UPDATE medicine.medicine SET ${item} = '${value}' WHERE code = ${code}`;
  // 修改药品库存
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err)
      data.meta.status = 500
      res.send(data)
    } else {
      let sql1 = 'INSERT INTO medicine.editlog(code,name,edititem,old,new,user,date) VALUES(?,?,?,?,?,?,?)'
      connection.query(sql1, arry, function (err, result) {
        if (err) {
          console.log(err)
          data.meta.status = 500
          res.send(data)
        } else {
          data.meta.status = 200
          res.send(data)
        }
      })
    }
  });


  // connection.end();
})

module.exports = router;