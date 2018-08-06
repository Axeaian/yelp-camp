// all middleware
var middlewareObj   = {};
var Comment         = require("../models/comment");
var Campground      = require("../models/campground");

middlewareObj.checkCampOwner = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundcp){
            if(err){
                req.flash("error","Campground not found!");
                res.redirect("back");
            } else{
                //does user own campground
                if(foundcp.author.id.equals(req.user._id)){
                    next();
                } else{
                     req.flash("error","You don't have permission to do that!");
                     res.redirect("back");                
                }
            }
        });
    } else{
        req.flash("error","You need to be logged in!");
        res.redirect("back");
        }
};

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundcomment){
            if(err){
                res.redirect("back");
            } else{
                //does user own campground
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                } else{
                     res.redirect("back");                
                }
            }
        });
    } else{
        req.flash("error","You need to be logged in!");
        res.redirect("back");
        }
};

middlewareObj.isLoggedIn = function (req,res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash("error","You need to be logged in!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;