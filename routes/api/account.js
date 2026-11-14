//导入 express
const express = require('express');
//导入 jwt
const jwt = require('jsonwebtoken');
//导入中间件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');
const { createAccountRules, updateAccountRules, validate } = require('../../middlewares/accountValidator');

const router = express.Router();
//导入 moment
const moment = require('moment');
const accountModel= require('../../models/accountModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 记账本列表 */
router.get('/account', checkTokenMiddleware, async function (req, res, next) {
  
  try {
      let data = await accountModel.find().sort({time: -1}) .maxTimeMS(3000); //获取全部文挡 按时间倒序
      res.json({
        //响应编号
        code: '0000',
        //响应信息
        msg: '读取成功',
        //响应数据
        data: data
      });
      } catch (err) {
          res.json({
            code: '1001',
            msg: '读取失败',
            data: null
          });
      }  
});

//新增记录
router.post('/account', createAccountRules, validate, checkTokenMiddleware, async (req, res) => {
  try {
    const data = await accountModel.create({
      ...req.body,
      time: moment(req.body.occurrence).toDate(),
      type: req.body.type === '收入' ? true : false
    });

    res.json({
      code: '0000',
      msg: '添加成功',
      data
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        code: '1002',
        msg: '该标题已存在，请换一个',
        data: null
      });
    };
    console.error(err);
    res.json({
      code: '1001',
      msg: '添加失败',
      data: null
    });
  };
});


//删除记录
router.delete('/account/:id', checkTokenMiddleware, async(req, res) => {
  try{
    //获取params 中的id
    let id = req.params.id;
    let data = await accountModel.deleteOne({ _id: id });
    //提醒
    res.json({
      code: "0000",
      msg: "删除成功",
      data: {}
    });
  } catch(err){
    res.json({
      code: "1003",
      msg: "删除失败",
      data: null
    });
  };  
});

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, async(req, res) => {
  let id = req.params.id;
  try {
      let data = await accountModel.findById(id);
      res.json({
        code: "0000",
        msg: "获取单个记录成功",
        data: data
      })
  } catch(err){
    res.json({
      code: "1004",
      msg: "获取单个记录失败",
      data: null
    });
  }
})

//更新单个记录
router.patch('/account/:id', updateAccountRules, validate, checkTokenMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    // 处理字段转换
    const updateData = { ...req.body };

    if (req.body.occurrence) {
      updateData.time = moment.utc(req.body.occurrence, 'YYYY-M-D').toDate();
    }
    if (req.body.type !== undefined) {
      updateData.type = req.body.type === '收入';
    }

    const data = await accountModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.json({
        code: '1004',
        msg: '没有找到对应的记录',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: '数据更新成功',
      data
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: err.name === 'CastError' ? '1004' : '1005',
      msg: err.name === 'CastError' ? 'ID格式不正确' : '数据更新失败',
      data: null
    });
  }
});

module.exports = router;
