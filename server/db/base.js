var mysql = require('mysql');
// var logger = require('../../common/logger.js')(__filename);
var config = process.appConfig.datasource;

var db = {
  pool: null
};
/**
 * 初始化连接池
 */
function initMysqlPool() {
  db.pool = mysql.createPool(config);
}
if (!db.pool) {
  initMysqlPool();
}
/**
 * 执行sql查询
 * @param  {string}   sql        sql语句
 * @param  {Array}    sqlParams  sql语句参数
 * @param  {Function} callback   回调函数
 * @param  {Object}   connection 数据库连接(可选)
 * @return Promise
 */
db.query = function(sql, sqlParam, connection) {
  var query;
  var p = new Promise(function(resolve, reject) {
    if (connection) {
      query = connection.query(sql, sqlParam, function(err, rows) {
        // logger.log(query.sql);
        if (err) {
          reject(err)
        } else {
          resolve(rows);
        }
      });
    } else {
      db.getConnection().then(function(connection){
          query = connection.query(sql, sqlParam, function(err, rows) {
              // logger.log(query.sql);
              connection.release();
              if (err) {
                reject(err)
              } else {
                resolve(rows);
              }
            });
      }).catch(function(err){
          reject(err);
      });
    }
  });
  return p;
}

/**
 * 获取一个mysql连接
 * @param  {Function} callback 回调函数
 * @return {Void}
 */
db.getConnection = function() {
    var p = new Promise(function(resolve, reject) {
      db.pool.getConnection(function(err, connection) {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
    return p;
  }

/**
 *  开始一个事务
 */
db.beginTransaction = function(){
  var p = new Promise(function(resolve, reject) {
    db.getConnection().then(function(conn){
      conn.beginTransaction(function(err){
        if(err){
          conn.rollback(function(){
            reject(err);
          });
        }else{
          resolve(conn);
        }
      });
    }).catch(function(err){
        reject(err);
    });
  });
  return p;
}


/**
 *  转换数据的字段名（将数据库中字段名转成JSON对象字段名）
 *  @param  {String} tableName 表名
 *  @param  {Object|Array} data  转换数据
 *  @return {Object|Array}
 */
db.convertFieldName = function(tableName, data) {
  var fieldMap = process.fieldMap[tableName];
  if (!fieldMap || !data || typeof(data) !== 'object') {
    return data;
  }
  if (data.length) {
    data.forEach(function(dataRow) {
      for (var o in fieldMap) {
        if (dataRow.hasOwnProperty(o)) {
          dataRow[fieldMap[o]] = dataRow[o];
            if(o!==fieldMap[o]){
                delete dataRow[o];
            }
        }
      }
    });
  } else {
    for (var o in fieldMap) {
      if (data.hasOwnProperty(o)) {
        data[fieldMap[o]] = data[o];
          if(o!==fieldMap[o]){
              delete data[o];
          }
      }
    }
  }
  return data;
}

/**
 *  创建add sql，data为数组时，允许一次插入多条数据
 *  @param  {String} tableName 字段映射表
 *  @param  {Object|Array} fieldNames  转换数据
 *  @param  {Object|Array} data  数据
 *  @return {Object}
 */
// db.createAdd = function(tableName, data, fieldNames) {
//     var sqlArr = ['insert into '],
//       paramArr = [],
//       fieldArr = [],
//       arr = [],
//       fieldMap, 
//       fieldMapOpp,
//       createTime=new Date();
//     if (!Array.isArray(data)) {
//       arr.push(data);
//     } else {
//       arr = data;
//     }
//     arr.forEach(function(obj){
//       obj.createTime = createTime;
//     });
//     fieldMap = process.fieldMap[tableName] || {};
//     fieldMapOpp = bigVizUtil.objectTransform(fieldMap);
//     sqlArr.push(tableName);
//     sqlArr.push(' (');
//     if (fieldNames && fieldNames.length > 0) {
//       fieldArr = fieldNames;
//     } else {
//       for (var o in arr[0]) {
//         var fieldName = o;
//         if (fieldMapOpp[o]) {
//           fieldName = fieldMapOpp[o]
//         }
//         fieldArr.push(fieldName)
//       }
//     }
//     var fieldSqlArr1 = [];

//     fieldArr.forEach(function(field) {
//       fieldSqlArr1.push(field);
//     });

//     var fieldSqlArr2 = [];
//     arr.forEach(function(obj) {
//       var value = [];
//       value.push('(');
//       var valueFields = [];
//       fieldArr.forEach(function(field) {
//         valueFields.push('?');
//         if (fieldMap[field]) {
//           paramArr.push(obj[fieldMap[field]]);
//         } else {
//           paramArr.push(obj[field]);
//         }
//       });
//       value.push(valueFields.join(','));
//       value.push(')');
//       fieldSqlArr2.push(value.join(''));
//     });

//     sqlArr.push(fieldSqlArr1.join(','));
//     sqlArr.push(')values');
//     sqlArr.push(fieldSqlArr2.join(','));

//     return {
//       sql: sqlArr.join(''),
//       param: paramArr
//     }
//   }
  /**
   *  创建update sql
   *  @param  {String} tableName 字段映射表
   *  @param  {Object|Array} fieldNames  转换数据
   *  @param  {Object|Array} data  数据(如果没有fieldNames，会使用data中的字段更新)
   *  @return {Object}
   */
// db.createUpdate = function(tableName, data, fieldNames) {
//   var sqlArr = ['update '],
//     paramArr = [],
//     fieldArr = [],
//     fieldMap, fieldMapOpp,
//     modifyTime = new Date();
//   data.modifyTime = modifyTime;
//   fieldMap = process.fieldMap[tableName] || {};
//   fieldMapOpp = bigVizUtil.objectTransform(fieldMap);
//   sqlArr.push(tableName);
//   sqlArr.push(' set ');
//   if (fieldNames && fieldNames.length > 0) {
//     fieldArr = fieldNames;
//   } else {
//     for (var o in data) {
//       if (o != 'id') {
//         var fieldName = o;
//         if (fieldMapOpp[o]) {
//           fieldName = fieldMapOpp[o]
//         }
//         fieldArr.push(fieldName);
//       }
//     }
//   }
//   var fieldSqlArr = [];
//   fieldArr.forEach(function(field) {
//     fieldSqlArr.push(field + '=?');
//     if (fieldMap[field]) {
//       paramArr.push(data[fieldMap[field]]);
//     } else {
//       paramArr.push(data[field]);
//     }
//   });
//   sqlArr.push(fieldSqlArr.join(','));
//   if (data.hasOwnProperty('id')) {
//     sqlArr.push(' where id=?');
//     paramArr.push(data.id);
//   }
//   return {
//     sql: sqlArr.join(''),
//     param: paramArr
//   }
// }

/**
 * 批量处理更新操作
 *
 *  @param  {String} tableName 表名
 *  @param  {Array} data  数据对象数组
 *          注意：
 *          1.(必须包含主键)
 *          2.此处插入语句依赖db.createAdd生成。key会根据fieldMap做转换。fieldMap.json中有配置过的字段，此处为该字段的映射.
 *          demo:[{
 *            id:1,
 *            userName:'tom',
 *            age:11
*            }]
 *  @param  {Array} fieldNames  要更新的字段名数组。
 *          demo:['user_name','age']
 *  @return Promise
 */
db.batchUpdate = function(tableName, data, fieldNames, connection) {
  var sqlObj = db.createAdd(tableName, data, fieldNames);
  var updateField = [];
  fieldNames.forEach(function(field){
    if(field != 'id')
      updateField.push(field + '=VALUES(' + field + ')');
  });

  var sql = sqlObj.sql + ' ON DUPLICATE KEY UPDATE ' + updateField.join();

  return db.query(sql, sqlObj.param, connection);
}

module.exports = db;

