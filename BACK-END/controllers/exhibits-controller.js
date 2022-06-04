const router = require('express').Router()
const db = require('../models')

router.get('/', (req, res) => {
    db.Exhibit.find()
        .then((exhibits) => {
            res.render('exhibits/index', { exhibits })
        })
        .catch(err => {
            console.log('err', err)
            res.render('error404')
        })
})

router.post('/', (req, res) => {
    if (req.body.description === '') { req.body.pic = undefined }
    if (req.body.images === '') { req.body.city = undefined }
    if (req.body.videos === '') { req.body.state = undefined }
    db.Exhibit.create(req.body)
        .then(() => {
            res.redirect('/exhibits')
        })
        .catch(err => {
            if (err && err.name == 'ValidationError') {
                let message = 'Validation Error: '
                for (var field in err.errors) {
                    message += `${field} was ${err.errors[field].value}. ${err.errors[field].message}\n`
                }
                res.render('exhibits/new', { message })
            }
            else {
                res.render('error404')
            }
        })
})

router.get('/new', (req, res) => {
    res.render('exhibits/new')
})

router.get('/:id', (req, res) => {
    db.Exhibit.findOne({ _id: req.params.id })
        .populate('comments')
        .then(exhibit => {
            console.log(exhibit.comments)
            res.render('exhibits/show', { exhibit })
        })
        .catch(err => {
            console.log('err', err)
            res.render('error404')
        })
})

router.put('/:id', (req, res) => {
    db.Exhibit.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.redirect(`/exhibits/${req.params.id}`)
        })
        .catch(err => {
            console.log('err', err)
            res.render('error404')
        })
})

router.delete('/:id', (req, res) => {
    db.Exhibit.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/exhibits')
        })
        .catch(err => {
            console.log('err', err)
            res.render('error404')
        })
})

router.get('/:id/edit', (req, res) => {
    db.Exhibit.findById(req.params.id)
        .then(exhibit => {
            res.render('exhibits/edit', { exhibit })
        })
        .catch(err => {
            res.render('error404')
        })
})

router.post('/:id/comment', (req, res) => {
    console.log('post comment', req.body)
    if (req.body.author === '') { req.body.author = undefined }
    req.body.rant = req.body.rant ? true : false
    db.Pxhibit.findById(req.params.id)
        .then(exhibit => {
            db.Comment.create(req.body)
                .then(comment => {
                    exhibit.comments.push(comment.id)
                    exhibit.save()
                        .then(() => {
                            res.redirect(`/exhibits/${req.params.id}`)
                        })
                        .catch(err => {
                            res.render('error404')
                        })
                })
                .catch(err => {
                    res.render('error404')
                })
        })
        .catch(err => {
            res.render('error404')
        })
})

router.delete('/:id/comment/:commentId', (req, res) => {
    db.Comment.findByIdAndDelete(req.params.commentId)
        .then(() => {
            console.log('Success')
            res.redirect(`/exhibits/${req.params.id}`)
        })
        .catch(err => {
            console.log('err', err)
            res.render('error404')
        })
})


module.exports = router