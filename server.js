const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const db = require('./my-database')


app.engine('hbs', expressHandlebars({

    defaultLayout: 'main',
    extname:'hbs'
}))

app.use(bodyParser.urlencoded({extended:false}))
app.use(expressSession({
    secret: 'keyboard cat',
    resave:false,
    saveUninitialized: true
}))

    app.get('/home', function(req,res){

        db.getLatestPost(function(error,blog){
            const model = {
                blog: blog[0]
            }
            res.render("Home.hbs",model)
        })
    })

    app.get('/about',function(req,res){
        
        const isLoggedIn = req.session.isLoggedIn

        db.getAllFaqs(function(error,faqs){
            const model = {
                faqs: faqs,
                isLoggedIn: isLoggedIn
            }
            res.render("about.hbs", model)
        })
    })

    app.post("/answer-question/:id", function(req,res){
        if(req.session.isLoggedIn){

            const id = req.params.id
            const question = req.body.question
            const answer = req.body.answer

            db.updateFaqWithId(question,answer,id,function(error){
                res.redirect("/about")
            })
        }
        else{
            res.redirect("/home")
        }   
    })

    app.get("/answer-question/:id", function(req,res){
        const id = req.params.id

        if(req.session.isLoggedIn){

            db.getFaqById(id, function(error,faq){
                const model = {
                    faq:faq
                }
                res.render("answer-question.hbs",model)
                res.status(200)
            })
        }
        else{
            res.redirect("/home")
        }
    })

    app.get("/edit-post/:id", function(req,res){
        
        if(req.session.isLoggedIn)
        {
            const id = req.params.id
            db.getPostById(id, function(error, blog){
                const model = {
                    blog: blog
                }
                res.render("edit-post.hbs", model)
                res.status(200)
            })
        }
        else{
            res.redirect("/blog")
        }
    })

    app.post("/edit-post/:id", function(req,res){
        if(req.session.isLoggedIn){
            const id = req.params.id
            const post = req.body.post

            db.updatePostWithId(post,id,function(error){
                res.redirect("/blog")
            })
        }
        else{
            res.redirect("blog")
        }
    })

    app.get('/blog',function(req,res){
        
        
        const isLoggedIn = req.session.isLoggedIn

         db.getAllPosts(function(error,blog){
            const model = {
                blog: blog,
                isLoggedIn : isLoggedIn
            }
            res.render("Blog.hbs", model)
        })
    })

    app.get("/add-post", function(req,res){

        if(req.session.isLoggedIn)
        {
            res.render("add-post.hbs")
            res.status(200)
        }
        else{
            res.redirect("/home")
        }
    })
    app.post("/add-post", function(req,res){
        const post = req.body.PostMessage
            db.createPost(post,function(error){
                res.redirect("/blog")
            })
    })

    app.post("/deletePost", function(req,res){
        if(req.session.isLoggedIn){

        const id = req.body.id
        db.deletePostWithId(id,function(error){
            res.redirect("/blog")
        })
        }else{
            res.redirect("/blog")
        }
    })

    app.post("/deleteEntry", function(req,res){
        if(req.session.isLoggedIn){

        const id = req.body.id
        db.deleteEntryWithId(id,function(error){
            res.redirect("/guestbook")
        })
        }else{
            res.redirect("/guestbook")
        }
    })


    app.get('/contact',function(req,res){
        res.render("Contact.hbs")
        res.status(200)
    })
    app.get('/Login', function(req,res){
        res.render("Login.hbs")
        res.status(200)
    })

    app.get("/guestbook",function(req,res){
         
        const isLoggedIn = req.session.isLoggedIn

        db.getAllEntries(function(error,guestbook){
        const model = {
            guestbook: guestbook,
            isLoggedIn : isLoggedIn
        }
            res.render("guestbook.hbs", model)
        })
    })

    app.get("/add-entry", function(req,res){
        res.render("add-entry.hbs")
        res.status(200)    
    })
    app.post("/add-entry",function(req,res){
        const entry = req.body.entry
        const name = req.body.name

        db.createEntry(entry,name,function(error){
            res.redirect("/guestbook")
        })
    })



    app.post("/login", function(req,res){

        const username = req.body.username
        const password = req.body.password

        if(username == "McStevens" && password == "apa123")
        {
            req.session.isLoggedIn = true
            res.redirect("/home")
        }else{
            res.render("login.hbs")
        }
    })

    app.get("/add-faq", function(req,res){
        res.render("add-faq.hbs")
        res.status(200)
    })
    app.post("/add-faq", function(req,res){
        const question = req.body.question
        const answer=""

        db.createFaq(question,answer,function(error){
            res.redirect("/about")
        })
    })

    app.post("/deleteFaq", function(req,res){
        if(req.session.isLoggedIn){

        const id = req.body.id
        db.deleteFaqWithId(id,function(error){
            res.redirect("/about")
        })
        }else{
            res.redirect("/about")
        }
    })

app.use(express.static('public',{redirect:false}))

app.listen(8000)
