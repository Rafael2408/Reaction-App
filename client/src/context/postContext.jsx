import { useState, createContext, useContext, useEffect } from "react"
import {
    getPostsRequest, createPostRequest, 
    deletePostRequest, likePostRequest, 
    unlikePostRequest, 
} from '../api/posts'
import { useUser } from "./userContext"
import { io } from 'socket.io-client';

const PostContext = createContext()

export const usePosts = () => {
    const postContext = useContext(PostContext)
    return postContext
}

export const PostProvider = ({ children }) => {
    const { user, checkAuth } = useUser()

    const [posts, setPosts] = useState([])

    useEffect(() => {
        let socket;

        if (user) {
            socket = io('http://localhost:4000', {
                query: {
                    userId: user._id
                }
            });

            socket.on('posts', (posts) => {
                setPosts(posts);
            });

            socket.on('postCreated', async (post) => {
                await getPosts()
            });

            socket.on('postLiked', (updatedPost) => {
                setPosts(prevPosts => prevPosts.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                ));
            });


            socket.on('postUnliked', (updatedPost) => {
                setPosts(prevPosts => prevPosts.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                ));
            });


            socket.on('postDeleted', (postId) => {
                setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    const getPosts = async () => {
        const res = await getPostsRequest()
        setPosts(res.data)
    }

    const createPost = async (post) => {
        const res = await createPostRequest(post)
        return res.status
    }


    const likePost = async (postId, userId) => {
        const res = await likePostRequest(postId, userId)
        getPosts()
        return res.data
    }

    const unlikePost = async (postId, userId) => {
        const res = await unlikePostRequest(postId, userId)
        getPosts()
        return res.data
    }

    const deletePost = async (postId, userId) => {
        try {
            await deletePostRequest(postId, userId)
            await getPosts()
        } catch (error) {
            console.log(error)
        }
    }


    return <PostContext.Provider value={{
        posts,

        getPosts,
        createPost,
        likePost,
        unlikePost,
        deletePost
    }}>
        {children}
    </PostContext.Provider>
}