const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookie.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secrtephrase');
  } catch (err) {
    return res.status(401).send({ massage: 'Необходима авторизация!' });
  }
  res.user = payload;

  next();
};
