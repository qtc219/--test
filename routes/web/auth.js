var express = require('express');
var router = express.Router();
//导入用户模型
const userModel = require('../../models/userModel');
const md5 = require('md5');

//注册
router.get('/reg', (req, res) => {
    //响应 HTML内容
    res.render('auth/reg');
});

//注册用户
router.post('/reg', async (req, res) => {
    //表单验证
    try{
        await userModel.create({...req.body, password: md5(req.body.password)});
        res.render('success', {msg: '注册成功', url: '/login'});
    } catch(err){
            console.log('注册失败');
            res.status(500).send('注册失败');
            return
        }
});

//登录
router.get('/login', (req, res) => {
    //响应 HTML内容
    res.render('auth/login');
});

//用户登录
router.post('/login', async (req, res) => {
    //获取用户名和密码
    let {username, password} = req.body; 

    try{
        let data = await userModel.findOne({username:username, password:md5(password)});
        //判断 data
        if(!data){
            // return res.send('账号或密码错误~~');
            res.render('success', {msg: '账号或密码错误~~',url:'login'})
            return 
        }
        //写入session
        req.session.username = data.username;
        req.session._id = data._id;

        //登录成功响应
        res.render('success', {msg: '登录成功', url: '/account'});

    } catch(err){
        res.render('success', {msg: '登录失败，请稍后再试~~',url:'login'})
        // res.status(500).send('登录，请稍后再试~~');
        }
});

//退出登录
// router.get('/logout',(req, res) =>{
//     //销毀session
//     req.session.destroy(() => {
//         res.render('success', {msg: '退出成功', url: '/login'});
//     })
// });

//为防止跨站请求，将方法从get以为post
router.post('/logout',(req, res) =>{
    //销毀session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'});
    })
});

module.exports = router;
