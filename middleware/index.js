var Campgrounds   = require("../models/campgrounds");
var Comment       = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function(err, EditCamp){
            if(err){
                req.flash("error","Campground not found!");
                console.log(err);
                res.redirect("back");
            }
            else{
                if(EditCamp.author.id.equals(req.user._id)){
                    next();

                }
                else{
                    req.flash("error","You dont have permission to do that!");
                    res.redirect("back");
                }
               
            }
            });
            
    }
    else{
       req.flash("error","You need to be logged in to that!");
       res.redirect("back");
    }

}



middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, EditComment){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            else{
                if(EditComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
               
            }
            });
            
    }
    else{
       res.redirect("back");
    }

}

middlewareObj.isLoggedIn = function (req,res,next){

    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
