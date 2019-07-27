var express = require("express");
app=express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose model
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var Blog =mongoose.model("Blog",blogSchema);

//Restful Routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("err");
		}
		else{ 
			res.render("index",{blogs:blogs});
		}
	});
});
//New Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//Create Route
app.post("/blog",function(req,res){
	Blog.create(req.body.Blog ,function(err,newBlog){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs");
		}
	})
});

//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,fBlog){
		if(err){
			console.log("We got error");
		}else{
			res.render("show",{blog:fBlog});
		}
	});
});
//Edit Route
app.get("/blogs/:id/edit",function(req,res){
		Blog.findById(req.params.id,function(err,fBlog){
		if(err){
			console.log("We got error");
		}else{
			res.render("edit",{blog:fBlog});
		}
	})
});
//Update Route
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.Blog,function(err,UpdatedBlog){
		if(err){
			console.log("error");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//Delete Route
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log("error");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000,function(){
	console.log("server Has started");
})
