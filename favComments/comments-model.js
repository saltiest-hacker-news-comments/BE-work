const dbDS = require('../database/dbDSConfig.js');
const db = require('../database/dbConfig.js');

module.exports = {
  getTopSaltyComments,
  savedComment,
  findBy,
  getCommentsByUserID,
  removeCommentByUserID,
  getSaltyCommentsByID,
  removeComment 
};

function getTopSaltyComments() {
  return dbDS('salt')
    .orderBy('saltiness', 'desc')
    .limit(15);
}

function getSaltyCommentsByID(commentIDs){
  return dbDS('salt').whereIn('id', commentIDs);
}

function savedComment(comment) {
  return db('favorite_comments').insert(comment);
}

function findBy(filter) {
  return db('favorite_comments').where(filter);
}

function getCommentsByUserID(id){
  return db('favorite_comments').select('comment_id').where({"favorite_comments.user_id": id})

}

function removeCommentByUserID({user_id, comment_id}){
     return getCommentsByUserID(user_id).where({comment_id}).del()
}

///for new thing with token//removing
function removeComment(id ,comment_id){
  return getCommentsByUserID(id).where({"favorite_comments.comment_id": comment_id}).del()
}