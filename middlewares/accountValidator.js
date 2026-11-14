// middlewares/accountValidator.js
const { body, validationResult } = require('express-validator');

// 新增账单验证规则
const createAccountRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('标题不能为空')
    .isLength({ max: 50 }).withMessage('标题最多50个字符'),

  body('occurrence')
    .notEmpty().withMessage('发生时间不能为空')
    .isISO8601().withMessage('时间格式不正确'),   // 或根据你前端传的格式调整

  body('type')
    .notEmpty().withMessage('类型不能为空')
    .isIn(['收入', '支出']).withMessage('类型只能是收入或支出'),

  body('account')          // 金额字段，按你实际字段名修改
    .notEmpty().withMessage('金额不能为空')
    .isFloat({ min: 0.01 }).withMessage('金额必须大于0'),

  // 如果有备注
  body('remarks')
    .optional()
    .isLength({ max: 200 }).withMessage('备注最多200个字符')
];

// ========== 更新规则（字段全部改为可选） ==========
const updateAccountRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('标题不能为空')
    .bail()
    .isLength({ max: 50 }).withMessage('标题最多50个字符'),

  body('occurrence')
    .optional()
    .notEmpty().withMessage('发生时间不能为空')
    .bail()
    .isISO8601().withMessage('时间格式不正确'),

  body('type')
    .optional()
    .isIn(['收入', '支出']).withMessage('类型只能是收入或支出'),

  body('account')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('金额必须大于0'),

  body('remarks')
    .optional()
    .isLength({ max: 200 }).withMessage('备注最多200个字符')
];


// 统一处理验证结果的中间件
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      code: '1003',           // 自定义验证错误码
      msg: '表单验证失败',
      data: errors.array()    // 返回详细错误信息
      // 或者只返回第一条：data: errors.array()[0].msg
    });
  }
  next();
};

module.exports = {
  createAccountRules,
  updateAccountRules,
  validate
};