var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");

//models
var Product = require("./models/product");
var User = require("./models/user");

//routes
var productRoute = require("./routes/products");

//Setting ejs
app.set("view engine", "ejs");
//setting css to public directory
app.use(express.static(__dirname + "/public"));
//setting body-parser
app.use(bodyParser.urlencoded({extended:true}));
//use method override
app.use(methodOverride("_method"));

//Connecting Database
mongoose.connect("mongodb://localhost/e_commerce", {useUnifiedTopology:true, useNewUrlParser:true})
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

//Main page
app.get("/", function(req, res){
    res.render("main")
});

//use routes
app.use(productRoute)

//setting up passport
app.use(require("express-session")({
    secret: "the best",
    resave: false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//auth routes
app.get("/signup", function(req, res){
    res.render("signup")
});

app.post("/signup", function(req, res){
    var user = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
    }
    User.register(new User(user), req.body.psw, function(err, created){
        if(err){
            console.log(err);
            return res.render("signup");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/products")
            });
        }
    });
});

app.get("/login", function(req, res){
    res.render("login")
})

//Port
app.listen(3000, function(){
    console.log("E-COMMERCE WEBSITE SERVER STARTED")
});