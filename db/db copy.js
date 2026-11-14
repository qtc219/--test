/**
 * 
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = function(success, error){
    //导入 mongoose
    const mongoose = require('mongoose');

    //3.连接 mongodb服务 
    mongoose.connect('mongodb://127.0.0.1:27017/bilibili');

    //4.连接数据库
    mongoose.connection.once('open', async () => {
        success();
    });

    //设置连接错误的回调
    mongoose.connection.on('error', () => {
        error();
    });

    //设置连接关闭的回调
    mongoose.connection.on('close', () => {
        console.log('连接关闭');
    })
}
