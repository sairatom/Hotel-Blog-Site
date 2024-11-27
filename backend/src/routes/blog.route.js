const express = require('express');
const router = express.Router()
const Blog =  require('../model/blog.model')
const Comment = require('../model/comment.model');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin')
//create a blog post
router.post("/create-post",verifyToken,isAdmin, async(req, res) => {
    try{
        // console.log("Blog data from api:", req.body);
        const newPost = new Blog({...req.body, author: req.userId});
        await newPost.save();
        res.status(201).send({
            message:"Post created successfully",
            post: newPost 
        })
    } catch (error){
        console.error("Error creating post:", error);
        res.status(500).send({ message:"Error creating post"})
    }
})
//get all blogs
router.get('/',async(req, res) => {
     try{
        const {search, category, location} = req.query;
        console.log(search);

        
            let query = {};
            
            if(search){
                query = {
                    ...query,
                    $or:[
                        {title: {$regex: search, $options:"i"}},
                        {content:{$regex: search, $options: 'i'}}

                    ]
                }          
        }

        if(category) {
            query = {
                ...query,
                category
            }
        }

        if(location) {
            query = {
                ...query,
                location
            }
        }
        

        const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 }); // Adjust populate fields as necessary
        res.status(200).send(posts);

     } catch (error){
        console.error("Error creating post:", error);
        res.status(500).send({ message:"Error creating post"})
    }
})

//get single blog by id
router.get("/:id", async(req, res) => {
    try{
        // console.log(req.params.id);
        const postId = req.params.id
        const post = await Blog.findById(postId);
        if(!post) {
            return res.status(404).send({message:"Post not Found"})
        }

        const comments =await Comment.find({postId: postId}).populate('user',"username email")
        res.status(200).send({
            post, comments
        })

    } catch (error){
        console.error("Error creating post:", error);
        res.status(500).send({ message:"Error fetching single post"})
    }
})

//update the blog post
router.patch("/update-post/:id",verifyToken, async(req,res) => {
    try{
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new: true});

        if(!updatedPost) {
            return res.status(404).send({message: "post not found"})
        }
        res.status(200).send({
            message:"Post updated successfully",
            post:updatedPost
        })

    } catch (error){
        console.error("Error creating post:", error);
        res.status(500).send({ message:"Error updating post"})
    }
})

//delete a blog post
router.delete("/:id",verifyToken,isAdmin, async(req,res) => {
    try{
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);
        if(!post) {
            return res.status(404).send({ message:"post not found" })
        }

        //delete related comments
        await Comment.deleteMany({postId: postId})

        res.status(200).send({
            message:"post deleted successfully",
            post:post
        })

    } catch (error){
        console.error("Error deleting post:", error);
        res.status(500).send({ message:"Error deleting post"})
    }
})

//related posts
router.get("/related/:id",async(req, res) =>{
    try{
        const{ id} = req.params;
        if(!id) {
            return res.status(400).send({message:"post id is required"})
        }
        const blog = await Blog.findById(id);
        if(!blog) {
            return res.status(404).send({ message:"post is not found!"})
        }
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i')

        const relatedQuery = {
            _id: { $ne: id},//exclude the current blog by the id 
            title: {$regex: titleRegex}
        }
        const relatedPost =  await Blog.find(relatedQuery)
        res.status(200).send(relatedPost)

     } catch (error){
        console.error("Error fetching related post:", error);
        res.status(500).send({ message:"Error fetching related post"})
    }
})
module.exports = router;