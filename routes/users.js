var express = require('express');
var router = express.Router();
const { User, Todo } = require('../models');

/* GET users listing. */
router.get('/', async function (req, res, next) {
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
