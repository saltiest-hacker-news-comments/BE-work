const router = require('express').Router();
const Trolls = require('./comments-model.js');
const Users = require('../users/users-model.js');

router.get('/DS', (req, res) => {
  Trolls.getTopSaltyComments()
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(error => {
      res.status(500).json({ message: 'Problem getting salty comments' });
    });
});
//get all the fav comments a user saves//not for production//for development purposes
router.get('/:id/fav', validateUserId,(req, res) => {
  const id = req.params.id
  Trolls.getCommentsByUserID(id)
    .then(comments => {
      console.log(comments)
      res.status(200).json(comments);
    })
    .catch(error => {
      res
        .status(401)
        .json({ message: 'Comments dont exist with that user_id' });
    });
});
//testing route to see if i can get the user id from the token//SUCCESS
router.get('/favorites', (req,res)=> {
  const id = req.user.id
  Trolls.getCommentsByUserID(id)
  .then(comments => {
    console.log(comments)
    res.status(200).json(comments);
  })
  .catch(error => {
    res
      .status(401)
      .json({ message: 'Comments dont exist with that user_id' });
  });
})
//retrieve the favorite comments a user has saved from the data science db//
router.get('/:id/fav/salts', validateUserId, (req, res) => {
  const id = req.params.id;
  Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
       const commentIDs = saltyIDs.map(id =>  id.comment_id)
       console.log(commentIDs)
          Trolls.getSaltyCommentsByID(commentIDs)
          .then( comments => {
            res.status(200).json(comments)
          })
      })
      .catch(err => {
        console.log('error in second catch', err)
        res.status(500).json({message: "user saved comments don't exist"})
      })
    })

//testing retrieving fav comments from DS with user id token//
router.get('/allsalt', (res, req) => {
   const id = req.user.id;
   Trolls.getCommentsByUserID(id)
    .then(saltyIDs => {
       const commentIDs = saltyIDs.map(id =>  id.comment_id)
       console.log(commentIDs)
          Trolls.getSaltyCommentsByID(commentIDs)
          .then( comments => {
            res.status(200).json(comments)
          })
      })
      .catch(err => {
        console.log('error in second catch', err)
        res.status(500).json({message: "user saved comments don't exist"})
      })
})
//testing delete with id from token//SUCCESS  
router.delete('/deletefav', (req, res)=> {
  const id = req.user.id
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeComment(id, comment_id)
    .then(comments => {
      res.status(200).json({message: 'comment deleted'})
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json({message: 'trouble deleting comment'})
    })
})  

//delete a favorite comment that has been saved
router.delete('/:id/fav', validateUserId, (req, res)=> {
  const user_id = parseInt(req.params.id, 10)
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.removeCommentByUserID({user_id, comment_id})
    .then( removed => {
      console.log(res)
      res.status(200).json({message: 'comment deleted'})
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).json({message: 'error deleting comment'})
    })
})

//add a favortite comment for a user
router.post('/:id/fav', validateUserId, (req, res) => {
  const comment_id = parseInt(req.body.comment, 10);
  const user_id = parseInt(req.params.id, 10);
  Trolls.savedComment({comment_id, user_id})
    .then(comment => {
      console.log(comment)
      res.status(201).json({message: 'comment successfully saved'});
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });
});
//testing add a favorite comment for a user using id from token//SUCCESS//
router.post('/newfav', (req, res)=> {
  const user_id = req.user.id
  const comment_id = parseInt(req.body.comment, 10);
  Trolls.savedComment({comment_id, user_id})
    .then(comment => {
      console.log(comment)
      res.status(201).json({message: 'comment successfully saved'});
    })
    .catch(error => {
      console.log('this is error', error.message);
      res.status(500).json({ message: 'error saving comment to the database' });
    });

})

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
