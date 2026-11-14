//middlewares/chekTokenMiddleware.js
const jwt = require('jsonwebtoken');

let checkTokenMiddleware = (req, res, next) => {
  //获取token
  let token = req.get('token');
  //判断
  if(!token){
    return res.json({
      code: "2003",
      msg: "token 缺失",
      data: null
    })
  }
  //校验token
  jwt.verify(token, 'atguigu',(err, data) => {
    if(err){
      return res.json({
        code: "2004",
        msg: 'token校验错误',
        data: null
      })
    }
  })
  //token校验成功
  next();
}

module.exports = checkTokenMiddleware;