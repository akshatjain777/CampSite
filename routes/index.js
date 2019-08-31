var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground")

router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
    }); 
    if(req.body.adminKey === "nfgngfn467-g854ngfn-s74ns*ng8g4n8g"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.render("register");
       }
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome To YelpCamp " + user.username);
               res.redirect("/campgrounds");
           });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfully");
    res.redirect("/campgrounds");
});

router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/");
        }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

module.exports = router;