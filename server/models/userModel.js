const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
        username: {
                type: String,
                required: [true, 'Username is required'],
                unique: true,
                trim: true,
                minlength: [3, 'Username must be at least 3 characters'],
                maxlength: [30, 'Username cannot exceed 30 characters']
        },
        password: {
                type: String,
                required: [true, 'Password is required'],
                minlength: [6, 'Password must be at least 6 characters']
        },
        role: {
                type: String,
                required: true,
                enum: ["admin", "user"],
                default: "user"
        }
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema)