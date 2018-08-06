var express = require("express");
var router = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");

//===============================
//  CAMPGROUND ROUTES
//===============================

//INDEX - DISPLAYS LIST OF CAMPGROUNDS
router.get("/",function(req,res){
    //get all campgrounds from DB
    Campground.find({},function(err,cpdbs){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{cg:cpdbs});
        }
    });
});

//CREATE - ADD NEW CAMPGROUNDS TO THE DATABASE
router.post("/", middleware.isLoggedIn, function(req,res){
  //to add new data to campgrounds array
  var name = req.body.cpname;
  var price = req.body.cpprice;
  var image = req.body.cpimage;
  var desc = req.body.cpdesc;
  var author ={
      id: req.user._id,
      username: req.user.username
  };
  var newdata = {name:name, price:price, image:image, description:desc, author:author};
  // Create new campground and save to database
  Campground.create(newdata, function(err,newcp){
      if(err){
          console.log(err);
      } else{
          res.redirect("/campgrounds");
      }
  });
});

//NEW - DISPLAYS FORM TO MAKE NEW CAMPGROUND
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW - SHOWS INFORMATION ABOUT 1 CAMPGROUND
router.get("/:id",function(req,res){
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcp){
        if(err){
            req.flash("error","Campground does not exist!");
            res.redirect("/campgrounds");  
        }else{
            //show template with that campground
            res.render("campgrounds/show",{cg:foundcp});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampOwner, function(req, res){
    Campground.findById(req.params.id, function(err,foundcp){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");  
        } else{
            res.render("campgrounds/edit", {cg:foundcp});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampOwner, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.cp, function(err,updatedcp){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success","Campground detail updated!");
            res.redirect("/campgrounds/"+req.params.id );
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampOwner, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success","Campground deleted!")
            res.redirect("/campgrounds/");
        }
    });
});

    
module.exports = router;