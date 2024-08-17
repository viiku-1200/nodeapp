import { name } from "ejs";
import express, { application } from "express";
import mongoose, { model } from "mongoose";
import cookieParser from "cookie-parser";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"




const llm=express()


mongoose.connect("mongodb://localhost:27017",{dbName:"zzz"}).then(()=>{console.log(
  "mongo chl rha"
)})
const userschema=new mongoose.Schema({
name:String,email:String,password:String,

})

const boy=mongoose.model("boyz",userschema)
llm.set("view engine","ejs")

llm.use(express.urlencoded({extended:true}))

llm.use(cookieParser())

const isAuthenticated=async(req,res,next)=>{

  const {token}=req.cookies
  if(token){
   const decoded= jwt.verify(token,"kkkkkk")
   
   req.user=await boy.findById(decoded._id)   
   

   
    next()
  } else{
    res.render("login")
  }
}

llm.get("/",isAuthenticated,(req,res)=>{
   console.log(req.user)
  res.render("logout")
  
  

})

llm.get("/reg",(req,res)=>{
  
 res.render("reg")
 
 

})

llm.post("/login",async(req,res)=>{
  const {email,password}=req.body

  let user=await boy.findOne({email})
  if(!user){

    return res.redirect("/reg")
  }


  let isMatched=await bcrypt.compare(password,user.password)


  if(!isMatched){

    return res.render("login",{message:"incorrect password"})

  }


    user=await boy.create({email,password})
  const token=jwt.sign({_id:user._id},"kkkkkk")
  
  
  res.cookie("token",token,{

    httpOnly:true,
    expires:new Date(Date.now()+1*1000)
  })

  res.redirect("/")
})

llm.post("/reg",async(req,res)=>{
  const {name,email,password}=req.body

  let user=await boy.findOne({email})
  if(user){

    return res.redirect("/login")
  }
const hashPassword=await bcrypt.hash(password,10)

    user=await boy.create({name,email,password:hashPassword})
  const token=jwt.sign({_id:user._id},"kkkkkk")
  
  
  res.cookie("token",token,{

    httpOnly:true,
    expires:new Date(Date.now()+1*1000)
  })

  res.redirect("/")
})




llm.get("/logout",(req,res)=>{
  res.cookie("token",null,{

    httpOnly:true,
    expires:new Date(Date.now())
  })

  res.send("logout")
})






// llm.get("/",(req,res)=>{
//   const {token}=req.cookies
//   if(token){
//     res.render("logout")
//   } else{
//     res.render("login")
//   }
  
// })

// llm.post("/login",(req,res)=>{
//   res.cookie("token","imm",{
//     httpOnly:true,
//     expires:new Date(Date.now()+60*1000)
//   })
//   res.redirect("/")
  
// })
// llm.get("/logout",(req,res)=>{
  
//   res.cookie("token",null,{
//     httpOnly:true,
//     expires:new Date(Date.now())
//   })
//   res.redirect("/")
// })
llm.get("/profile",(req,res)=>{
  res.render("index")
})


llm.listen(4500,()=>{
    console.log("llm start")
})