var express    =  require("express");
var router     =  express.Router();
var Campgrounds=  require("../models/campgrounds");
var middleware =  require("../middleware/index");

router.get("/",function(req,res){

 
    Campgrounds.find({},function(err,camp){
    if(err){
    console.log(err);
    }
    else{
        res.render("campgrounds/campgrounds",{campgrounds:camp, currentUser:req.user});
    }
    });
    
    });
    
    // NEW CAMPGROUNDS
    
    router.post("/",middleware.isLoggedIn,function(req,res){
        var CampName   = req.body.name;
        var CampImage  = req.body.image;
        var CampDesc   = req.body.descrpt;
        var CampPrice  = req.body.price;
        var CampAuthor = {
            id:req.user._id,
            username: req.user.username
        }
        
        var newCampGround={name:CampName,image:CampImage,description:CampDesc,author:CampAuthor,price:CampPrice}
        Campgrounds.create(newCampGround,function(err,campIns){
        if(err){
            
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
        });
        
    });
    
    router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
    });
    
    //SHOW CAMPGROUNDS
    
    router.get("/:id",function(req,res){
        Campgrounds.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
         if(err)
         {
             console.log(err);
         }
         else
         {
             console.log(foundCamp);
            res.render("campgrounds/show",{campground:foundCamp});
         }
        });
       
    })

//EDIT(UPDATE) ROUTE

router.get("/:id/:edit",middleware.checkCampgroundOwnership,function(req,res){
    
        Campgrounds.findById(req.params.id, function(err, EditCamp){
                    
                    res.render("campgrounds/edit",{campground: EditCamp});
                
        });
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground,function(err, editedCamp){
if(err){
    res.redirect("/campgrounds");
}
else{
    req.flash("success","Edited the campground!");
    res.redirect("/campgrounds/"+ req.params.id);
}
});
});


// DESTROY CAMP

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
Campgrounds.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/campgrounds");
        console.log(err);
    }
    else{
        req.flash("success","Campground deleted!");
        res.redirect("/campgrounds");
    }
})
});





    module.exports = router; 