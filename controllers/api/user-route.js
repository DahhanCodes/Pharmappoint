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

// get a single user
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

router.post('/', (req, res) => {

  User.create({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
  }) //create a new user in teh db saving their user and password

  .then(dbUserData => {
          req.session.save(() => {
              req.session.user_id = dbUserData.id; //session id = user ID
              req.session.username = dbUserData.username; //session username = db username
              req.session.email = dbUserData.email;
              req.session.firstname = dbUserData.firstname;
              req.session.lastname = dbUserData.lastname;
              req.session.loggedIn = true; //set them to formally logged in

              res.json(dbUserData); //parses db user into json
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

    router.delete('/:id', (req, res) => {
        User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
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