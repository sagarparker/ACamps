var express    =  require("express");
var router     =  express.Router();
var passport   =  require("passport");
var User       =  require("../models/user");


// DEFAULT ROUTES

router.get("/",function(req,res){
    res.render("landing");
    });


// REGISTER ROUTE

router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err, user){
        if(err){
            
            return res.render("register",{error: err.message});
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to ACamps "+ req.body.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// lOGIN ROUTE

router.get("/login",function(req,res){
    res.render("login");
});



router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  function(req, res) {
    req.flash("success","Welcome " + req.body.username);
    res.redirect('/campgrounds');
  });




// LOGOUT ROUTE

router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","You have logged out.");
    res.redirect("/campgrounds");
})



module.exports = router;
