const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

UserSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
    
})


UserSchema.methods.comparePassword = function(candidatePassword){
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatched)=>{
            if(err){
                return reject(err);
            }
            if(!isMatched){
                return reject(false)
            }
            resolve(true);
        })
    })
}
mongoose.model('User',UserSchema);