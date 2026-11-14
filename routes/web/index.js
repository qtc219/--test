//导入express
const express = require('express');
//导入模型
const accountModel= require('../../models/accountModel');
//导入 moment
const moment = require('moment');
//导入登录检查中间件
const checkLoginMiddleware = require('../../middlewares/checkLogin')

//创建路由对象
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/account');
  // res.render('index', { title: 'Express' });
});

/* 记账本列表 */
router.get('/account', checkLoginMiddleware,async function (req, res, next) {
  //获取所有的账单信息
  try {
          let result = await accountModel.find().sort({time: -1}); //获取全部文挡 按时间倒序
          res.render('list', { content: result, moment}); //名字要和 list.ejs 里用的对上
      } catch (err) {
          next(err);
      }  
});

//添加记录
router.get('/account/create', checkLoginMiddleware, async function (req, res, next) {
  res.render('create');
});

//新增记录
router.post('/account', checkLoginMiddleware, async(req, res) => {
  //通过moment 将时间字符串转换成对象
  //时间字符串 => Object => new Date()
  console.log(req.body);
  //插入数据库
  try {
    await accountModel.create({
    ...req.body,
    //修改时间属性
    time: moment(req.body.occurrence).toDate(),
    // 约定：true = 收入，false = 支出(默认)
    type: req.body.type === '收入' ? true: false
  });
    //成功提醒
    res.render('success', {msg: '添加成功~~~~', url: '/account'});
  } catch(err) {
    // 11000 就是 unique 索引重复
    if (err.code === 11000) {
      console.log('重复字段:', err.keyValue); // {title: 'xxx'}
      return res.render('success', {msg: '该标题已存在，请换一个~~~', url: '/account'});
    }
    //其它错误
    console.log(err);
    res.status(500).send('添加失败');
  }
});

//删除记录
router.get('/account/:id', checkLoginMiddleware, async(req, res) => {
  try{
    //获取params 中的id
    let id = req.params.id;
    let result = await accountModel.deleteOne({ _id: id });
    //提醒
    res.render('success', {msg: '删除成功~~~', url: '/account'});
  } catch(err){
    res.status(500).send('删除失败');
  }  
})

module.exports = router;
