import React, { useState } from 'react';
import { Card, CardHeader, 
    CardContent, CardMedia, 
    CardActions, IconButton, 
    Typography, Avatar, 
    Box, Menu, MenuItem
 } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/postContext';

function ShowPost({ post }) {
    const { likePost, unlikePost, deletePost } = usePosts()
    const { user } = useUser()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenOptions = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    const handleDeletePost = async (post) => {
        handleCloseOptions()
        await deletePost(post._id, post.user._id)
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar onClick={() => navigate(`/profile/${post.user.username}`)} sx={{ bgcolor: getRandomColor() }} aria-label="recipe">
                        {post.user && post.user.username ? post.user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                }
                action={
                    user._id === post.user._id && (
                        <>
                            <IconButton aria-label="settings" onClick={handleOpenOptions}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleCloseOptions}
                            >
                                <MenuItem onClick={() => { handleDeletePost(post) }}>Delete Post</MenuItem>
                            </Menu>
                        </>
                    )
                }
                title={
                    <Box onClick={() => navigate(`/profile/${post.user.username}`)}>
                        <b>{post.user.username}</b>
                    </Box>
                }
                subheader={formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                sx={{ pb: 0, mb: -1 }}
            />

            <CardContent sx={{ pt: 1.2 }}>
                <Typography variant="h6" color="text.primary">
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.description}
                </Typography>
            </CardContent>

            {post.image &&
                <CardMedia
                    component="img"
                    sx={{ maxHeight: 250, height: 250, objectFit: 'scale-down', mt: -1 }} // Reduce el margen superior
                    image={post.image.url}
                    alt={post.title}
                />
            }
            <CardActions disableSpacing>
                <IconButton
                    aria-label="add to favorites"
                    onClick={() => post.likes.includes(user._id) ? unlikePost(post._id, user._id) : likePost(post._id, user._id)}
                >
                    <FavoriteIcon color={post.likes.includes(user._id) ? "error" : "default"} />
                    <Typography variant="body2" color="text.secondary">
                        {post.likes.length}
                    </Typography>
                </IconButton>

                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default ShowPost;
