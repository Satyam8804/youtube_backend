import mongoose, { Schema } from 'mongoose'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new  Schema({
    userName :{
        type :String ,
        required : true,
        unique :true,
        trim : true,
        lowercase:true,
        index:true // help in optimising searching
    },
    email: {
        type :String ,
        required : true,
        unique :true,
        trim : true,
        lowercase:true,
    },
    email: {
        type :String ,
        required : true,
        unique :true,
        trim : true,
        lowercase:true,
    },
    fullName :{
        type :String,
        required : true,
        trim : true,
        index : true
    },
    avatar :{
        type :String,  // cloudinary url
        require: true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref :"Video"
        }
    ],
    password :{
        type : String,
        required: [true , 'Password is Required ']
    },
    refreshToken :{
        type :String
    }
},{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName

    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRE
    })
}
userSchema.method.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName

    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE
    })
}

export const User = mongoose.model("User",userSchema)