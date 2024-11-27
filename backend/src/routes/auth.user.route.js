const express = require('express');
const User =  require('../model/user.model');
const generateToken = require('../middleware/generateToken');
const router = express.Router();

//register a new user

router.post('/register',async(req,res) => {
    try{
        const {email,password,username} = req.body
        const user = new User({email, password, username})
        // console.log(user)
        await user.save();
        res.status(200).send({message:"User registered successfully!", user:user})

    }catch(error){
            console.log("failed to register",error);
            res.status(500).json({message: 'Registration failed!'});
            
        }
    
})

//login a user
router.post("/login",async(req,res) => {
    try{
        console.log(req.body);
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).send({message: 'User not found!'})
        }
        const isMatch = await user.comparePassword(password)

        if(!isMatch) {
            return res.status(401).send({message: 'Invalid password'})
        }

        //generate token here....

        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,// enable this only when you have https
            secure: true,
            sameSize: true
        })
        // console.log("Generated Token:",token);
        

        res.status(200).send({message:'Login successfull!', token,user:{
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        }})


    }catch(error){
        console.error("failed to login",error);
        res.status(500).json({message:'Login failed! Try Again'})
    }
})


//logout a user

router.post("/logout", async(req,res)=> {
    try{
        res.clearCookie('token');
        res.status(200).send({message: 'Logget out Successfully done!'})

    }catch(error){
        console.error("failed to log out",error);
        res.status(500).json({message:'Logout Failed'})
    }
})

//get all users
router.get('/users', async(req,res) => {
    try{
        const users = await User.find({},'id email role');
        res.status(200).send({message: "Users found successfully", users})

    }catch(error){
        console.log("Error fetching users",error);
        res.status(500).json({message:'Failed to fetch users'});
    }
})

//delete a user

router.delete('/users/:id', async(req,res) => {
    try{
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);

        if(!user) {
            return res.status(404).send({message:"User not found!"})
        }
        res.status(200).send({message:"User deleted successfully!"})

    }catch(error){
        console.error("Error deleting user",error);
        res.status(500).json({message:'Error deleting user'})
    }
})

//update a user role
router.put('/users/:id',async(req,res) => {
    try{
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new:true});
        if(!user){
            return res.status(404).send({message: "user not found"})
        }
        res.status(200).send({message: "user role updated successfully!",user})

    }catch(error){
        console.error("Error updating user role",error);
        res.status(500).json({message:'Failed updating user role'})
    }
})
module.exports = router;