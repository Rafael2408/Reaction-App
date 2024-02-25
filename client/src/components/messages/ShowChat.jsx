import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { Avatar, Box, Button, Dialog, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MessagesBox from './MessagesBox';
import { useSocket } from '../../context/socketContext';

function ShowChat({ userProfile, user, open, handleClose }) {
    const { register, handleSubmit, reset } = useForm();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (open) {
            socket.emit('get_messages', { userId1: user._id, userId2: userProfile._id });
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            socket.emit('get_messages', { userId1: user._id, userId2: userProfile._id });
        }

        socket.on('messages', (messages) => {
            setMessages(messages);
        });

        return () => {
            socket.off('messages');
        };
    }, [open]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);


    const handleSend = (value) => {
        setMessages([...messages, { sender: user, content: value, date: new Date() }]);
        socket.emit('send_message', { senderId: user._id, receiverId: userProfile._id, content: value });
    };


    const onSubmit = (data) => {
        if (data.message.trim() !== '') {
            handleSend(data.message);
            reset();
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(onSubmit)();
        }
    };


    return (
        <div>
            <Dialog open={open} onClose={handleClose} sx = {{width: '100%', height: '100%'}}>
                <Box sx={{width: '300px', p: 1}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1,
                        borderBottom: '1px solid #E5E5EA', paddingBottom: 0.5, 
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={userProfile.username} src={userProfile.image?.url}
                                sx={{
                                    justifyContent: 'center',
                                    width: 50,
                                    height: 50,
                                }}
                            />
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="body1" color="initial"
                                    fontWeight={550}
                                >@{userProfile?.username}</Typography>
                                <Typography variant="body2" color="gray">{userProfile?.name}</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon fontSize='large' />
                            </IconButton>
                        </Box>

                    </Box>
                    <MessagesBox messages={messages} />

                    <form onSubmit={handleSubmit(onSubmit)} >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                {...register('message', { required: true })}
                                placeholder="Message"
                                fullWidth
                                multiline
                                onKeyDown={handleKeyPress}
                            />

                            <Button type="submit" color="primary" sx={{ padding: 0, margin: 0, width: '5%' }}>
                                <SendIcon fontSize='large' />
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Dialog>
        </div>
    );
}

export default ShowChat;