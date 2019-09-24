const dbDS = require('../database/dbDSConfig.js');
const db = require('../database/dbConfig.js');

module.exports = {
  getTopSaltyComments,
  savedComment,
  findBy,
};

function getTopSaltyComments() {
  return dbDS('salt')
    .orderBy('saltiness', 'desc')
    .limit(15);
}

function savedComment({ comment_id }) {
  return db('favorite_comments').insert({ comment_id });
}

function findBy(filter) {
  return db('favorite_comments').where(filter);
}
