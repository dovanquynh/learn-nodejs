const express = require('express')
const router = express.Router()

var taskData = require('./taskData')

router.get('/', async (req, res) => {
    res.json({
        result: "ok",
        tasks: taskData,
        message: `Get list of tasks successfully.`
    })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    if (isNaN(parseInt(id)) === true) {
        res.json({
            result: "failed",
            message: `You must enter taks's id. ID must a number.`
        })
        return
    }

    let foundTask = taskData.find(task => task.id === id)
    if (foundTask) {
        res.json({
            result: "ok",
            task: foundTask,
            message: `Get task's detail successfully.`
        })
    }
    else {
        res.json({
            result: "failed",
            message: `Cannot find task with id = ${id} !`
        })
    }
})

router.post('/', async (req, res) => {
    let { title = '', complete = 0 } = req.body

    if (['0', '1'].indexOf(complete) < 0) {
        res.json({
            result: "failed",
            message: `You must enter taks's complete. ID must be 0 or 1.`
        })
        return
    }

    let taksWithMaxId = taskData.sort((item1, item2) => item1.id < item2.id)[0]
    taskData.push({
        id: taksWithMaxId.id + 1,
        title,
        completed: (parseInt(complete) > 0)
    })

    res.json({
        result: "ok",
        task: taskData,
        message: "Insert new task successfully!"
    })
})

router.put('/', async (req, res) => {
    let { id, title, complete } = req.body

    if (isNaN(parseInt(id)) === true) {
        res.json({
            result: "failed",
            message: `You must enter task's id. Id must be a number`
        })
        return
    }

    let foundTask = taskData.find(task => task.id === parseInt(id))

    if (foundTask) {
        foundTask.title = (title !== null) ? title : foundTask.title

        if (["0", "1"].indexOf(completed) >= 0) {
            foundTask.completed = completed
        }

        res.json({
            result: "ok",
            task: foundTask,
            message: "Update a task successfully"
        })
    }
    else {
        res.json({
            result: "failed",
            message: `Cannot find task with ${id} to update`
        })
    }
})

router.delete('/', async (req, res) => {
    let { id } = req.body

    if (isNaN(parseInt(id)) === true) {
        res.json({
            result: "failed",
            message: `You must enter task's id. Id must be a number`
        })
        return
    }

    taskData = taskData.filter(task => task.id !== parseInt(id))

    res.json({
        result: "ok",
        task: taskData,
        message: "Delete a task successfully"
    })
})

module.exports = router