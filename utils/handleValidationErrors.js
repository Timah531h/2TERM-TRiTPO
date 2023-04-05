import { validationResult } from 'express-validator';

export default (req, res, next) => { //если валидация не прошла верни мне ошибку 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};