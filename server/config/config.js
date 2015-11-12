
/**
 *  项目配置文件
 */
var configJSON;
var args = process.argv;
var config = {};
var fs = require('fs');
var path = require('path');


/**
 * 初始化配置文件
 * @return {[type]} [description]
 */
var init = function(){
    configJSON = require('./web.json');
    process.appConfig =configJSON;
};

//config.get
config.get = function(key){
    if (!key){
        return configJSON||{};
    }
    key = key.split('.');
    var temp = configJSON;
    key.forEach(function(k){
        temp = temp[k]||{};
    })
    return temp;
}

init();

module.exports = config;

