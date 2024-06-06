var express = require('express');
var router = express.Router();
const { User, Todo } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretToken, tokenValid } = require('../helpers/util');
const saltRounds = 10;

router.post('/signup', async function (req, res, next) {
  try {
    const { email, name, password } = req.body
    // check password
    const checkUser = await User.findOne({ where: { email } })
    if (checkUser) throw new Error('user already exist')
    const hash = bcrypt.hashSync(password, saltRounds);
    const user = await User.create({ email, name, password: hash });
    var token = jwt.sign({ userid: user.id }, secretToken);
    user.token = token;
    await user.save()
    res.status(201).json({
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/signin', async function (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('user is not exist')
    if (!bcrypt.compareSync(password, user.password)) throw new Error('password is wrong')
    var token = jwt.sign({ userid: user.id }, secretToken);
    user.token = token;
    await user.save()
    res.status(200).json({
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/signout', tokenValid, async function (req, res, next) {
  try {
    const user = await User.update(
      { token: '' }, // BE tahu apakah client sedang login atau tidak
      {
        where: {
          id: req.user.id
        },
        returning: true,
        plain: true
      },
    );
    res.status(201).json(user[1])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/* GET users listing. */
router.get('/', tokenValid, async function (req, res, next) {
  try {
    const users = await User.findAll({
      include: {
        model: Todo
      },
      order: [
        ['id', 'DESC'],
      ]
    });
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { email, name } = req.body
    const user = await User.create({ email, name });
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.update(
      req.body,
      {
        where: {
          id: req.params.id
        },
        returning: true,
        plain: true
      },
    );
    res.status(201).json(user[1])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

module.exports = router;
