var express = require("express");
var router = express.Router({mergeParams: true});
var Campground  =   require("../models/campground");
var Comment =       require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err, foundcp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{cg:foundcp});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup campgrounds using ID
    Campground.findById(req.params.id,function(err, foundcp){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        } else{
            //create new comment
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("/campgrounds");
                } else{ 
                    // add username and id to comment
                    console.log(req);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    foundcp.comments.push(comment);
                    foundcp.save();
                    console.log(comment);
                    req.flash("success","Comment created successfully!");
                    res.redirect("/campgrounds/"+ foundcp._id);
                }
            });

        }
    });
});

//comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundcomment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.render("comments/edit",{cg_id:req.params.id, comment:foundcomment});
        }
    });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedcomment){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success","Comment updated!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    }); 
});

//comment destroy
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds"+req.params.id);
        } else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;