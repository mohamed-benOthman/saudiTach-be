const mongoose =require ('mongoose')
const Schema = mongoose.Schema;


const UserSchema= new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    country:{type:String, required:true},
    city:{type:String, required:true},
    yearsExperience:{type:String},
    startupExperience:{type:String},
    relocate:{type:String, required:true},
    background:{type:String},
    linkedInProfile:{type:String, required:true},
    twitter:String,
    commitFulltime:String,
    resetToken:String,
    nbVisits:Number,
    tellMore: String,
    remote:String,
    bestAt:String,
    equity: String,
    devops:[{
        type: String
    }],
    frontend:[{
        type: String
    }],
    database:[{
        type: String
    }],
    backend:[{
        type: String
    }],
    design:[{
        type: String
    }],

    signupDate:String,
    whenStart:String,
    resetTokenExpiration:Date,
    confirmToken:String,
    confirmed:Boolean,
    avatarLink:String,
    resetToken:String,
    resetTokenExpiration:String,
    lastLoginDate:String,
    socialLogin:Boolean,
    activated:Boolean


})

module.exports=mongoose.model('User', UserSchema)
