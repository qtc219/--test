// middlewares/checkLogin.js

//声明中间件检测登录
let checkLoginMiddleware = (req, res, next) => {
  if(!req.session.username){
    return res.redirect('/login');
  }else{
    next();
  }
}

module.exports = checkLoginMiddleware