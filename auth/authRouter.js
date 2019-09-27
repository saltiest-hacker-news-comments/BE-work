const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');
// const db = require('../database/dbDSConfig.js');

const Users = require('../users/users-model');

/**
 *
 * @api {post} /api/auth/register Register a User
 * @apiName Register
 * @apiGroup Register
 *
 * @apiParam {String} username Users name
 * @apiParam {String} password Password
 *
 * @apiSuccess {Number} id Users id
 * @apiSuccess {String} username Users name
 * @apiSuccess {String} password Password Bcrypted
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 201 OK
 *{
 * "id": 4,
 * "username": "test2",
 * "password": "$2a$10$QIkv7M52OgZHY65za0W/rOSl3doj3pT0CuSidCGR0i.8MUhasRIkW"
 *}
 *
 * @apiError 500 Error.message
 *
 *
 */

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
});

/**
 *
 * @api {post} /api/auth/login login as User
 * @apiName login
 * @apiGroup login
 *
 * @apiParam {String} username Users name
 * @apiParam {String} password Password
 *
 * @apiSuccess {String} message Welcome user
 * @apiSuccess {String} token token
 *
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 * "message": "Welcome mariam!",
 * "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlhbSIsImlkIjoxMCwiaWF0IjoxNTY5NTI5MjIwLCJleHAiOjE1Njk2MTU2MjB9.wxS04PV8VZYImc8E39B50CrnysBxbyDdA5C7uVgyqZA"
 *}
 *
 *
 * @apiError 401 Invalid Credentials
 *
 */

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
function generateToken(user) {
  const payload = {
    username: user.username,
    id: user.id,
  };

  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
