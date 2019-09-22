const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/authRouter.js');
const usersRouter = require('../users/usersRouter');
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', authenticate, usersRouter)

///sanity check
server.get('/', (req, res) => {
    res.send('working in the servvver')

})



module.exports = server;