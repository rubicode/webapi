var express = require('express');
var router = express.Router();
const { Todo, User } = require('../models');


router.get('/', async function (req, res, next) {
    try {
        const todos = await Todo.findAll({
            include: {
                model: User,
                as: 'dataExecutor'
            }
        });
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { title, executor } = req.body
        const todo = await Todo.create({ title, executor });
        res.status(201).json(todo)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const todo = await Todo.update(
            req.body,
            {
                where: {
                    id: req.params.id
                },
                returning: true,
                plain: true
            },
        );
        res.status(201).json(todo[1])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const todo = await Todo.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;
