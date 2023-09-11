const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Usernname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true
    },
    phone: String,
    image: {
        type: Object,
        default: {
            url: "https://media.istockphoto.com/id/1300845620/fr/vectoriel/appartement-dic%C3%B4ne-dutilisateur-isol%C3%A9-sur-le-fond-blanc-symbole-utilisateur.jpg?s=612x612&w=0&k=20&c=BVOfS7mmvy2lnfBPghkN__k8OMsg7Nlykpgjn0YOHj0=",
            publicId: null
        },
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, 'Too short password']
    },
    passwordChangeAt:Date,
    role: {
        type:Boolean,
        default: false
    },
    LikeProduct:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }],
    isAccountVarified:{
         type:Boolean,
         default: false
    }

}, { timestamps: true })

userSchema.pre('save',async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = {
    User
}