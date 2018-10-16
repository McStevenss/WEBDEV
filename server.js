const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const db = require('./my-database')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

let hash = "$2b$10$cZ4fUT5bATfizDKq/xt8KuqbF1bRV2l6epI1icfrBRbyHh.miSxTO"


app.engine('hbs', expressHandlebars({

    defaultLayout: 'main',
    extname:'hbs'
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(expressSession({
    secret: 'monkeyman',
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
            res.render("About.hbs", model)
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
                if(error || blog == null){
                    return res.render('notfound.hbs')
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
        const token = Date.now()
        res.cookie("guestbookToken", token)
        const model = {
            token : token
        }
        res.render("add-entry.hbs",model)
        res.status(200)    
    })
    app.post("/add-entry",function(req,res){
        const entry = req.body.entry
        const name = req.body.name
        const token = req.body.token
        const cookieToken = parseInt(req.cookies.guesbookToken)
        
        if(token == cookieToken)
        {
            db.createEntry(entry,name,function(error){
                res.redirect("/guestbook")
            })
        }
        else{
            res.redirect("/home")
        }
    })
    
    
    app.get('/Login', function(req,res){
        const token = Date.now()
        res.cookie("cookieToken", token)
        const model = {
            token : token
        }
        res.render("Login.hbs",model)
        res.status(200)
    })
    
    app.post("/Login", function(req,res){     
        const username = req.body.username
        const password = req.body.password
        const token = req.body.token
        const cookieToken = parseInt(req.cookies.cookieToken)

        if(username == "McStevens" && bcrypt.compareSync(password,hash)&& token == cookieToken)
        {
            req.session.isLoggedIn = true
            res.redirect("/home")

        }else{
            res.redirect("/Login")
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

app.listen(3000)

app.use(function (req, res) {
    res.render("notfound.hbs");
});
