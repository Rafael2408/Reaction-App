import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,   
        trim: true
    },
    image: {
        url: String,
        public_id: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    date: { type: Date, default: Date.now }
})

export default mongoose.model('Post', postSchema)
