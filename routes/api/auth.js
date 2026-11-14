var express = require('express');
var router = express.Router();
//导入jwt
const jwt = require('jsonwebtoken');

//导入用户模型
const userModel = require('../../models/userModel');
const md5 = require('md5');

//用户登录
router.post('/login', async (req, res) => {
    //获取用户名和密码
    let {username, password} = req.body; 
    try{
        let data = await userModel.findOne({username:username, password:md5(password)});

        //判断 data
        if(!data){
            res.json({
                code: "2002",
                msg: "账号或密码错误",
                data: null
            })
            return 
        }
        //创建用户token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, 'atguigu', {
            expiresIn: 60 * 60 *24 * 7 //单位是秒 一周
        });

        //响应token
        res.json({
            code:"0000",
            msg:"登录成功",
            data: token
        })
        return
    } catch(err){
        res.json({
            code: "2001",
            msg: "数据库读取失败",
            data: null
        })
        }
});


//为防止跨站请求，将方法从get以为post
router.post('/logout',(req, res) =>{
    //销毀session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'});
    })
});

module.exports = router;
