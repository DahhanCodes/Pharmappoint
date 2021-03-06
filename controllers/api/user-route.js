const router = require('express').Router();
const { User } = require('../../models'); 

// get all users
router.get('/', (req, res) => {
    User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// Get a single user
router.get('/:id', (req, res) => {
  User.findOne({
      attributes: { exclude: ['password'] },
      where: {
          id: req.params.id 
      }
  })
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'User not found' });
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// Create a new user
router.post("/signUp", (req, res) => {
  
  User.create({
    password: req.session.password,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,

  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        
        req.session.email = dbUserData.email;
        req.session.firstname = dbUserData.firstname;
        req.session.lastname = dbUserData.lastname;
        req.session.password = dbUserData.password;
        req.session.loggedIn = true;

        res.json(dbUserData);

      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login route 
router.post("/login", (req, res) => {
  console.log(req.body)
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    console.log(dbUserData)
    var validPassword;
    if (req.body.password === dbUserData.dataValues.password){
      validPassword = true;
    }else{
      validPassword = false;
    }

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.email = dbUserData.email;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// Logout Route
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
     req.session.destroy(() => {
        res.status(204).end();
     });
  } else {
     res.status(404).end();
  }
});

// User Update 
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

  // Delete User
  router.delete('/:id', (req, res) => {
        User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });

module.exports = router;