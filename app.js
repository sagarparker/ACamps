var express     =  require("express");
var app         =  express();
var bodyParser  =  require("body-parser");
var mongoose    =  require("mongoose");
var Campgrounds =  require("./models/campgrounds");
var Comment     =  require("./models/comment");
var flash       =  require("connect-flash");
var passport    =  require("passport");
var LocalStrategy=  require("passport-local").Strategy;
var User        =  require("./models/user");
var methodOverride  = require("method-override");
var commentRoute    = require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");
var indexRoute      = require("./routes/index");

// VIEW ENGINE

app.set("view engine","ejs");

// MONGOOSE CONNECTION

mongoose.connect("mongodb://localhost/ACamps",{ useNewUrlParser: true });

// BODY_PARSER and PUBLIC DIRECTORY

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// FLASH MESSAGES

app.use(flash());

// PASSPORT JS CONFIG

app.use(require("express-session")({
secret:"encode",
resave:false,
saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));




passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});



///////////////////////////////

// ROUTES

///////////////////////////////

//INDEX ROUTE
app.use(indexRoute);

//COMMENT ROUTE
app.use("/campgrounds/:id/comments",commentRoute);

//CAMPGROUND ROUTE 
app.use("/campgrounds",campgroundRoute);




// SERVER
app.listen(5000,function(){
    console.log("Server has started");
});