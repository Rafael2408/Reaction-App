import Post from '../models/Post.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { uploadImage, deleteImage } from '../libs/cloudinary.js'
import fs from 'fs-extra'
import { io, userSockets } from '../index.js'
import { getPopulatedNotification } from './notification.controller.js' 

export const sendPosts = async (socket) => {
    try {
        let posts = await Post.find()
            .populate('user', '_id username name image')
            .sort({ date: -1 });

        socket.emit('posts', posts);
    } catch (error) {
        console.error(error);
    }
};


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).populate('user', '_id username name image');
        res.send(posts)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        let image;

        const userFound = await User.findById(userId);
        if (!userFound) return res.status(400).json({ message: 'User not found' });

        if (req.files && req.files.image) {
            const result = await uploadImage(req.files.image.tempFilePath);
            await fs.remove(req.files.image.tempFilePath);
            image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const user = {
            _id: userFound._id,
            name: userFound.name,
            username: userFound.username,
            image: userFound.image
        };

        const postObject = {
            title,
            user
        };

        if (description) {
            postObject.description = description;
        }

        if (image) {
            postObject.image = image;
        }

        const newPost = new Post(postObject);
        await newPost.save();

        userFound.posts.push(newPost);
        await userFound.save();

        io.emit('postCreated', newPost);
        return res.json(newPost);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.send(updatedPost)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postRemoved = await Post.findByIdAndDelete(req.params.id)
        if (!postRemoved) return res.sendStatus(404)

        if (postRemoved.image.public_id) {
            await deleteImage(postRemoved.image.public_id)
        }

        const user = await User.findById(req.body.userId);
        user.posts.pull(postRemoved);
        await user.save();

        io.emit('postDeleted', postRemoved._id);
        return res.status(200).json({ postRemoved });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username');
        if (!post) return res.sendStatus(404)

        return res.json(post)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.sendStatus(404)

        if (post.likes.includes(req.body.userId)) {
            return res.status(400).json({ message: 'User has already liked this post' })
        }

        post.likes.push(req.body.userId);
        await post.save();


        if (post.user.toString() !== req.body.userId) {
            const userFound = await User.findById(req.body.userId);
            if (!userFound) return res.status(400).json({ message: 'User not found' });

            const notification = new Notification({
                user: post.user,
                fromUser: req.body.userId,
                type: 'like',
                target: { postId: post._id },
            });
            await notification.save();

            const populatedNotification = await getPopulatedNotification(notification)

            const userSocket = userSockets[populatedNotification.user._id];
            if (userSocket) userSocket.emit('notification', populatedNotification);
        }

        const updatedPost = await Post.findById(req.params.id).populate('user');
        io.emit('postLiked', updatedPost);  
        return res.json(updatedPost)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};


export const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.body.userId; 
        if (!post) return res.sendStatus(404)

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
        }
        await post.save();

        const updatedPost = await Post.findById(req.params.id).populate('user');
        io.emit('postUnliked', updatedPost); 
        return res.json(updatedPost)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

