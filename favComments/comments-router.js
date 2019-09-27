const router = require('express').Router();
const Trolls = require('./comments-model.js');
const Users = require('../users/users-model.js');

/**
 * @api {get} /api/comments/topsalt Get top 15 salty comments
 * @apiName GetTop15saltyComments
 * @apiGroup Salt
 *
 * @apiSuccess {Number} id Author id
 * @apiSuccess {String} by Author by
 * @apiSuccess {String} author Name author
 * @apiSuccess {Number} time Time
 * @apiSuccess {Number} time_ts Time Stamp
 * @apiSuccess {String} parent Parent Comment
 * @apiSuccess {Number} score Salt Score
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": "6972554",
 *    "by": "aet",
 *   "author": "aet",
 *   "time": "1388177319",
 *   "time_ts": "2013-12-27T20:48:39.000Z",
 *   "text": "Fuck war, too? Right?",
 *   "parent": "6972199",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -1.6249
 * }
 *
 * @apiError 500 Problem getting salty comments.
 *
 */

//retrieving 15 saltly comments from DS DB//
router.get('/topsalt', (req, res) => {
  Trolls.getTopSaltyComments()
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({ message: 'Problem getting salty comments' });
    });
});

//get all the fav comment id's a user saves//not for production//for development purposes
router.get('/:id/fav', validateUserId, (req, res) => {
  const id = req.params.id;
  Trolls.getCommentsByUserID(id)
    .then(comments => {
      console.log(comments);
      res.status(200).json(comments);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});
//testing route to see if i can get the user id from the token//SUCCESS
router.get('/favorites', (req, res) => {
  const id = req.user.id;
  Trolls.getCommentsByUserID(id)
    .then(comments => {
      console.log(comments);
      res.status(200).json(comments);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});

//retrieve the favorite comments of a user where id is in req.params from DS db//
router.get('/:id/fav/salts', validateUserId, (req, res) => {
  const id = req.params.id;
  Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
      const commentIDs = saltyIDs.map(id => id.comment_id);
      console.log(commentIDs);
      Trolls.getSaltyCommentsByID(commentIDs).then(comments => {
        res.status(200).json(comments);
      });
    })
    .catch(err => {
      console.log('error in second catch', err);
      res.status(500).json({ message: "user saved comments don't exist" });
    });
});

/**
 * @api {get} /api/comments/allfavsalt Get users favorite salty comments
 * @apiName GetUsersFavoriteSaltyComments
 * @apiGroup Salt
 *
 * @apiSuccess {Number} id Author id
 * @apiSuccess {String} by Author by
 * @apiSuccess {String} author Name author
 * @apiSuccess {Number} time Time
 * @apiSuccess {Number} time_ts Time Stamp
 * @apiSuccess {String} parent Parent Comment
 * @apiSuccess {Number} score Salt Score
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 *{
 *   "id": "6972554",
 *   "by": "aet",
 *   "author": "aet",
 *   "time": "1388177319",
 *   "time_ts": "2013-12-27T20:48:39.000Z",
 *   "text": "Fuck war, too? Right?",
 *   "parent": "6972199",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -1.6249
 * }
 *
 * @apiError 500 User saved comments don't exist.
 *
 */
//testing retrieving fav comments from DS with user id token//SUCCESS
router.get('/allfavsalt', (req, res) => {
  const id = req.user.id;
  Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
      const commentIDs = saltyIDs.map(id => id.comment_id);
      console.log(commentIDs);
      Trolls.getSaltyCommentsByID(commentIDs).then(comments => {
        res.status(200).json(comments);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "user saved comments don't exist" });
    });
});
//testing delete with  user id from token//SUCCESS
router.delete('/deletefav', (req, res) => {
  const id = req.body.id;
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeComment(id, comment_id)
    .then(comments => {
      res.status(200).json({ message: 'comment deleted' });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: 'trouble deleting comment' });
    });
});

/**
 * @api {delete} /api/comments/:comment_id/deletefav Delete 1 of users favorite comments
 * @apiName DeleteFavoriteComment
 * @apiGroup FavComments
 *
 * @apiParam {Number} id Comment id
 *
 * @apiSuccess {String} message Comment deleted
 *
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 * {
 * "message": "comment deleted"
 * }
 *
 * @apiError 500 Trouble deleting comment
 *
 */

router.delete('/:comment_id/deletefav', (req, res) => {
  const id = req.user.id;
  const comment_id = parseInt(req.params.comment_id, 10);
  Trolls.removeComment(id, comment_id)
    .then(comments => {
      res.status(200).json({ message: 'comment deleted' });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: 'trouble deleting comment' });
    });
});

//delete a favorite comment that has been saved where user id is in req.params
router.delete('/:id/fav', validateUserId, (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeCommentByUserID({ user_id, comment_id })
    .then(removed => {
      console.log(res);
      res.status(200).json({ message: 'comment deleted' });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: 'error deleting comment' });
    });
});

//add a favortite comment for a user where user id is in req.parms
router.post('/:id/fav', validateUserId, (req, res) => {
  const comment_id = parseInt(req.body.comment, 10);
  const user_id = parseInt(req.params.id, 10);
  Trolls.savedComment({ comment_id, user_id })
    .then(comment => {
      console.log(comment);
      res.status(201).json({ message: 'comment successfully saved' });
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });
});

/**
 * @api {post} /api/comments/newfav Save a comment to Favorite list
 * @apiName SaveFavoriteComment
 * @apiGroup FavComments
 *
 * @apiParam {Number} id Comment id
 *
 * @apiSuccess {String} message Comment saved
 *
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 * {
 * "message": "comment successfully saved"
 *}
 *
 * @apiError 500 Error saving comment to the database
 *
 */

//testing add a favorite comment for a user using id from token//SUCCESS//
router.post('/newfav', (req, res) => {
  const user_id = req.user.id;
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.savedComment({ comment_id, user_id })
    .then(comment => {
      console.log(comment);
      res.status(201).json({ message: 'comment successfully saved' });
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });
});

/**
 * @api {get} /api/comments/salt Get a list of top 25 saltiest users
 * @apiName Top25Saltiest
 * @apiGroup Salt
 *
 *
 *
 * @apiSuccess {String} author Authors name
 * @apiSuccess {Number} avg_score Authors score
 *
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 * {
 *   "author": "antonyh",
 *   "avg_score": -1.4708
 * },
 * {
 *   "author": "WWWade",
 *   "avg_score": -1.3318
 * },
 * {
 *   "author": "sadris",
 *   "avg_score": -1.3203
 * },
 * {
 *   "author": "NaNaN",
 *   "avg_score": -1.3038
 * },
 * {
 *   "author": "pokoleo",
 *   "avg_score": -1.3038
 * },
 * {
 *   "author": "rhygar",
 *   "avg_score": -1.2997
 * },
 * {
 *   "author": "finnn",
 *   "avg_score": -1.296
 * },
 * {
 *   "author": "r4vik",
 *   "avg_score": -1.296
 * },
 * {
 *   "author": "louhike",
 *   "avg_score": -1.2936
 * },
 * {
 *   "author": "wwosik",
 *   "avg_score": -1.2856
 * },
 * {
 *   "author": "esalman",
 *   "avg_score": -1.2774
 * },
 * {
 *   "author": "budu",
 *   "avg_score": -1.2774
 * },
 * {
 *   "author": "antris",
 *   "avg_score": -1.2708
 * },
 * {
 *   "author": "ramses",
 *   "avg_score": -1.2638
 * },
 * {
 *   "author": "minamea",
 *   "avg_score": -1.2513
 * },
 * {
 *   "author": "fwn",
 *   "avg_score": -1.23485
 * },
 * {
 *   "author": "fffggg",
 *   "avg_score": -1.2329
 * },
 * {
 *   "author": "casta",
 *   "avg_score": -1.2315
 * },
 * {
 *   "author": "hash9",
 *   "avg_score": -1.2311
 * },
 * {
 *   "author": "calvins",
 *   "avg_score": -1.2263
 * },
 * {
 *   "author": "josai",
 *   "avg_score": -1.2234
 * },
 * {
 *   "author": "dinergy",
 *   "avg_score": -1.2213
 * },
 * {
 *   "author": "alaloka",
 *   "avg_score": -1.2209
 * },
 * {
 *   "author": "ringe",
 *   "avg_score": -1.2125
 * },
 * {
 *   "author": "w00pla",
 *   "avg_score": -1.2051
 * }
 *
 * @apiError 500 Error getting top 25 saltiness
 *
 */

// To get top 25 saltiest users
router.get('/salt', (req, res) => {
  Trolls.getTop25Saltiest()
    .then(salt => {
      res.status(200).json(salt);
    })
    .catch(error => {
      console.log('error', error.message);
      res.status(500).json({ message: 'error getting top 25 saltiness' });
    });
});

/**
 * @api {get} /api/comments/:id/saltiest Top 10 Saltiest comment by Author
 * @apiName SaltiestOfTheSalt
 * @apiGroup Salt
 *
 * @apiParam {String} author Authors name
 *
 * @apiSuccess {Number} id Author id
 * @apiSuccess {String} by Author by
 * @apiSuccess {String} author Name author
 * @apiSuccess {Number} time Time
 * @apiSuccess {Number} time_ts Time Stamp
 * @apiSuccess {String} parent Parent Comment
 * @apiSuccess {Number} score Salt Score
 *
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 *  {
 *   "id": "5579500",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1366421699",
 *   "time_ts": "2013-04-20T01:34:59.000Z",
 *   "text": "If someone who happens to be Christian carries out terrorism, is this Christian terrorism? Or do we have a special exception for Muslims who carry out terrorism, that their terrorism is Islamic terrorism?",
 *   "parent": "5579468",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -1.371
 * },
 * {
 *   "id": "7327336",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1393726174",
 *   "time_ts": "2014-03-02T02:09:34.000Z",
 *   "text": "I don&#x27;t speak for others but I would find Lua much more suitable than Javascript, for non-browser applications.<p>However, it&#x27;s ridiculous that I cannot easily just use Lua for browser applications!",
 *   "parent": "7327210",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.9226
 * },
 * {
 *   "id": "8927022",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1421891068",
 *   "time_ts": "2015-01-22T01:44:28.000Z",
 *   "text": "The same reason Apple has consistently waged war against clones?",
 *   "parent": "8926951",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.9014
 * },
 * {
 *   "id": "5438373",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1364233106",
 *   "time_ts": "2013-03-25T17:38:26.000Z",
 *   "text": "That is not an acceptable excuse for publicly saying that you wish women would not be in tech. It definitely doesn't make it any more rational to want to punish all women because you feel personally offended about the stupid actions of one person, which did not actually affect you in any way.<p>If this pattern of feeling irrational resentments and using them to justify inflammatory public behavior is \"just being honest\" then Adria Richards was also \"just being honest\".",
 *   "parent": "5438352",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.7306
 * },
 * {
 *   "id": "7750051",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1400168259",
 *   "time_ts": "2014-05-15T15:37:39.000Z",
 *   "text": "HN uses this reasoning all the time. For example, &quot;I don&#x27;t know how to use language x, so language x sucks for sysadmins&quot; or &quot;I don&#x27;t know how to use language x, so it is too slow&quot;",
 *   "parent": "7749652",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.4913
 * },
 * {
 *   "id": "9908292",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1437242358",
 *   "time_ts": "2015-07-18T17:59:18.000Z",
 *   "text": "So &quot;no cause&quot; works out to &quot;any cause, as long as you say no cause and didn&#x27;t leave obvious signs to the contrary&quot;",
 *   "parent": "9907867",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.479
 * },
 * {
 *   "id": "5204187",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1360626060",
 *   "time_ts": "2013-02-11T23:41:00.000Z",
 *   "text": "The issue isn't how you felt, it is what kind of behavior you learned in the simulation context which would transfer to what you did on the real track. Doubtless your intimidation affected your behavior, but if a simulation can improve real performance then it is unlikely that a little intimidation completely erases all the tendencies learned in the simulation. It can't be assumed that things which improve performance will transfer, but things which could be dangerous won't transfer.",
 *   "parent": "5204157",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.2483
 * },
 * {
 *   "id": "5100815",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1358904386",
 *   "time_ts": "2013-01-23T01:26:26.000Z",
 *   "text": "A $100-to-consumers, thoroughly hackable phone would be a bonanza for geeky hobbyists, feature phone users and Chinese companies selling to the developing world. Let's see if they can get prices down to where people will not think too much about how they'd rather have Android.",
 *   "parent": "5097919",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.1901
 * },
 * {
 *   "id": "5490646",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1365043152",
 *   "time_ts": "2013-04-04T02:39:12.000Z",
 *   "text": "Why should it be scary? If you need someone to write some scripts in Perl, it should be just fine to use someone who mainly just knows Perl. Anyway, they can learn other stuff as they need to, once they know one language well, but you haven't made a case that this is actually necessary.",
 *   "parent": "5490466",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": -0.0227
 * },
 * {
 *   "id": "7672079",
 *   "by": "pekk",
 *   "author": "pekk",
 *   "time": "1398844388",
 *   "time_ts": "2014-04-30T07:53:08.000Z",
 *   "text": "After people learn something they don&#x27;t find it entirely cryptic any more, but that doesn&#x27;t mean it isn&#x27;t cryptic.<p>No evidence that using map instead of loops &quot;frees up brainpower.&quot;",
 *   "parent": "7672013",
 *   "deleted": null,
 *   "dead": null,
 *   "ranking": "0",
 *   "score": 0
 * }
 *
 * @apiError 500 Error in getting users saltiness comment
 *
 */

// Saltiest Comment by user
router.get('/:id/saltiest', (req, res) => {
  const id = req.params.id;
  Trolls.saltiestComment(id)
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'error in getting users saltiness comment' });
    });
});

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.findById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'User with id does not exit' });
    }
  });
}

module.exports = router;
