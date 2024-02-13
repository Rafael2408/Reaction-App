import { useState, createContext, useContext, useEffect } from "react"
import { getPostRequest, createPostRequest, deletePostRequest, likePostRequest, unlikePostRequest } from '../api/posts'

const PostContext = createContext()

export const usePosts = () => {
    const postContext = useContext(PostContext)
    return postContext
}

export const PostProvider = ({children}) => {

    const [posts, setPosts] = useState([])

    const getPosts = async () => {
        const res = await getPostRequest()
        setPosts(res.data)
    }

    const createPost = async (post) => {
        const res = await createPostRequest(post)
        await getPosts()
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
            getPosts()
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getPosts()
    }, [])

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