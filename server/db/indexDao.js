/**
 * Created by heiyue on 15/11/11.
 */

var db = require('./base.js');
// var logger = require('../common/logger.js')(__filename);

var indexDao = {};
var selectSql = ' id,folder_id,name,creator_id,create_time,modifier_id,modify_time,idx ';

/**
 * 获取首页详情
 * @param id
 * @param connection
 * @returns {Promise}
 */
indexDao.get = function(id, connection){
    var p = new Promise(function(resolve, reject) {
        db.query('select * from students where id=?', [id], connection).then(function(result) {
            resolve(result);
        }).catch(function(err) {
            // logger.error(err.stack);
            reject(err);
        });
    });
    return p;
}

module.exports = indexDao;
