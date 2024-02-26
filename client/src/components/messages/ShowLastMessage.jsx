import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { alpha } from '@mui/system';
import { useUser } from "../../context/userContext"
import ShowChat from "./ShowChat";
import { useState } from "react";

export const ShowLastMessage = ({lastMessage, bg}) => {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = () => {
        
        handleMenuClose();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setOpen(false);
    };

    return (
        <>
            {lastMessage.sender._id === user._id ? (
                <Box
                    sx={{
                        p: 1,
                        display: 'flex',
                        width: '100%',
                        backgroundColor: lastMessage.read ? 'initial' : theme => alpha(theme.palette.primary.dark, 0.2),
                        '&:hover': {
                            backgroundColor: "#B4D4FF",
                        }
                    }}
                    onClick={handleClickOpen}
                >
                    <Avatar src={lastMessage.receiver.image?.url} alt={user.username} />
                    <Box sx={{ ml: 1}}>
                        <Typography variant="body1" >@{lastMessage.receiver.username}</Typography>
                        <Box sx={{ display: 'flex', maxWidth: '100%', ml: 0.5}}>
                            <Typography variant="body2" color="gray">You:</Typography>
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ml: 0.5 }}>
                                <Typography variant="body2" color="gray">{lastMessage.content}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 1,
                        display: 'flex',
                        width: '100%',
                        backgroundColor: lastMessage.read ? 'initial' : theme => alpha(theme.palette.primary.dark, 0.2),
                        '&:hover': {
                            backgroundColor: "#B4D4FF",
                        }
                    }}
                >      
                </Box>
            )}

            <ShowChat
                handleClose={handleClose}
                user={lastMessage.sender._id === user._id ? lastMessage.sender : lastMessage.receiver}
                userProfile={lastMessage.sender._id === user._id ? lastMessage.receiver : lastMessage.sender}
                open={open}
            />


            {bg && <>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {!lastMessage.read && <MenuItem onClick={handleMarkAsRead}>Mark as read</MenuItem>}
                    <MenuItem onClick={handleDelete}
                        sx={{ color: 'error.main' }}
                    >
                        Delete this
                    </MenuItem>
                </Menu>
            </>}
        </>
    )
}
