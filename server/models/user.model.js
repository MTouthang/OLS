import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from jsonwebtoken

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [5, 'Name must be at least 5 characters'],
      lowercase: true,
      trim: true, // Removes unnecessary spaces
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
      ], // Matches email against regex
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Will not select password upon looking up a document
    },
    subscription: {
      id: String,
      status: String,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);


// Hashes password before saving to the database
userSchema.pre('save', async function (next) {
  if(!this.modified('password')){
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods = {
  // method to compare plain password with hashed password and return true or false
  comparePassword : async function (plainPassword){
    return bcrypt.compare(plainPassword, this.password)
  },

  // generate jwt token
  generateJWTToken: async function (){
    return await jwt.sign (
      {
        id: this._id, 
        role: this.role,
        subscription: this.subscription
      },
      process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
      }
    )
  }
}

const User = model('User', userSchema);
export default User;
