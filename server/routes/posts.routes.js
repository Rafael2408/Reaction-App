import { Router } from 'express'
import { getPosts, createPost, updatePost, deletePost, getPost } from '../controllers/post.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/posts', getPosts)

router.post('/posts', createPost)

router.put('/posts/:id', updatePost)

router.delete('/posts/:id', deletePost)

router.get('/posts/:id', getPost)



export default router