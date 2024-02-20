import { connectDB } from './db.js'
import {PORT} from './config/config.js'
import { app, server} from './app.js'
import { Server } from 'socket.io'
import { sendNotifications } from './controllers/notification.controller.js'
import { sendPosts } from './controllers/post.controller.js'

connectDB() 

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

export const userSockets = {}

io.on('connection', async (socket) => {
    console.log('A client has connected')
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSockets[userId] = socket;

        sendNotifications(userId, socket);
        sendPosts(socket);
    }
})

server.listen(PORT)
console.log('Server on port', PORT)