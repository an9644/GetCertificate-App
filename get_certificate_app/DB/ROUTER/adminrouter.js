import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from "../Middleware/auth.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
 
dotenv.config();
const adminrouter=Router()
// const user= new Map()
const secretkey=process.env.Secretkey

const userSchema=new mongoose.Schema({
    fname : String,
    email : String,
    username :{type:String,unique:true},
    password : String,
    role : String

})

const User = mongoose.model("userdetails",userSchema)

//model foe certificate details
const certiSchema=new mongoose.Schema({
    course:String,
    certiid:{type:String,unique:true},
    name:String,
    grade:String,
    issuedt:String
})
const Certi =mongoose.model("Certificatedetails",certiSchema)

mongoose.connect("mongodb://localhost:27017/CERTI-APP")


adminrouter.get('/', (req,res)=>{ // 1 / means home page or index
    res.send("Hello World")
})

adminrouter.post('/signup',async(req,res)=>{
    try{
     //mapping        
        const {Fname,Email,Username,Password,Role}=req.body;   
        if (!Username) {
            return res.status(400).json({ message: "Username is required" });
          }
    //map start
    const existinguser=await User.findOne({username:Username})
    if(existinguser){
        res.status(400).json({message:"User Already exist"})
    }else{
         //password hashing
         const newp=await bcrypt.hash(Password,10)
        //creating new user
        const newUser=new User({
            fname:Fname,
            email:Email,
            username:Username,
            password:newp,
            role:Role
        })
        await newUser.save();
        res.status(201).json({message:"account created successfully"})
    }
}        catch (error) {
    res.status(500).json(error)   
}
})

adminrouter.post('/login',async(req,res)=>{
   try {
    const {Username,Password}=req.body
const result=await User.findOne({username:Username})
    console.log(result)

    if(!result){ 
        res.status(404).json({message:"User not found"})
    }else{
        const valid =await bcrypt.compare(Password,result.password)
        console.log(valid)

        if(valid){
            const token =jwt.sign({Username:result.username,Role:result.role},secretkey,{expiresIn:"1 h"})
            res.cookie('authToken',token,{ httpOnly:true })
            res.status(200).json({token})
            console.log(token)
        }
    }
   } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });

    
   }
})
// const certi=new Map()

adminrouter.post('/issuecerti',authenticate,async(req,res)=>{
    try {
        const {Course,Certiid,Name,Grade,Issuedt}=req.body

        if(req.Role == 'admin'){
            console.log("Admin Logged in Successful")

            const existingcerti=await Certi.findOne({certiid:Certiid})
            if(existingcerti){
                console.log("Certificate Already issued!!")
                return res.status(400).json({message:"Certificate issued already"})
            }
            //creating new certi
            const  newCerti=new Certi({
                course:Course,
                certiid:Certiid,
                name:Name,
                grade:Grade,
                issuedt:Issuedt
            })
            
                await newCerti.save();
                console.log("Certificate Issued Successfully")
                return res.status(200).json({message:"Certificate Issued Successfully"})
         }else {
            console.log("You dont have Permission")
            return res.status(400).json({message:"You dont have Permission"})                
            }       
         } catch (error) {
            console.error(error.message);
            res.status(500).json({message: "Internal Server Error" }) 
         }   
})
adminrouter.get('/getcerti',async (req, res) => {
    // console.log(req.query.Courseid)  
    try {
        const search = req.query.CertiId
        console.log(search);

        const result= await Certi.findOne({certiid:search})
        if(result){
            res.status(200).send(result)
        }else{
            res.status(400).json({message:"No Issued Certificate!"})
        }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })     
    }
  })
  adminrouter.get('/viewuser',authenticate,(req,res)=>{
    try{
    const user=req.Role;
    res.json({user});}
    catch{
        res.status(404).json({message:'user not authorized'});
    }
})


adminrouter.post('/logout',(req,res)=>{
    res.clearCookie('authtoken');
    res.send('logout successfully');
    console.log('logout successfully');
})



export {adminrouter}