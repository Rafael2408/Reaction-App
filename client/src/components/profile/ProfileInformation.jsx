import { useEffect, useState } from "react"
import { useUser } from "../../context/userContext"
import { Avatar, Badge, Box, Button, Card, CardContent, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import UpdateUserImageModal from "./UploadUserImageModal"
import CircularIndeterminate from '../CircularIndeterminate'
import EditProfile from "./EditProfile"
import ShowChat from "../messages/ShowChat"

function ProfileInformation() {
        const { user, userProfile, 
        getUserByUsername, loading,
        followUser, unfollowUser
    } = useUser()
    const { username } = useParams()
    const [isFollowing, setIsFollowing] = useState(false)
    const [open, setOpen] = useState(false)

    const handleFollowUser = () => {
        followUser(userProfile._id, user._id)
    }

    const handleUnfollowUser = () => {
        unfollowUser(userProfile._id, user._id)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getUserByUsername(username)
    }, [])

    useEffect(() => {
        if (user && userProfile) {
            const isFollowingUser = user.following.includes(userProfile._id);
            setIsFollowing(isFollowingUser);
        }
    }, [userProfile]);


    return (
        userProfile ? (
            <Card sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(to bottom, #D4E7C5, #BFD8AF)'
            }} >

                <CardContent sx={{ p: 2 }}>
                    <Box className="image d-flex flex-column justify-content-center align-items-center">
                        <Box>
                            <Typography variant="h5" color="initial"
                                sx={{ p: 1, fontWeight: 'bold' }}
                            >@{userProfile.username}</Typography>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                   userProfile._id === user._id && 
                                   <UpdateUserImageModal/>
                                }
                            >
                                <Avatar alt={userProfile.username} src={userProfile.image?.url}
                                    sx={{
                                        justifyContent: 'center',
                                        width: 175,
                                        height: 175,
                                    }}
                                />
                            </Badge>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" color="initial" className="mt-2 fw-bold">{userProfile.name}</Typography>
                            <Typography variant="h6" color="initial" className="mt-2">
                                {userProfile.bio ? userProfile.bio : (
                                    userProfile._id === user._id && 'You have not set a bio yet.'
                                )}
                            </Typography>

                            {userProfile._id === user._id ?
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <EditProfile user={ user } />
                                </Box> :
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: '#4F6F52',
                                            '&:hover': {
                                                background: '#739072',
                                            },
                                            '&:active': {
                                                background: '#739072',
                                            },
                                            mr: 2
                                        }}
                                        onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </Button>
                                    
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: '#4F6F52',
                                            '&:hover': {
                                                background: '#739072',
                                            },
                                            '&:active': {
                                                background: '#739072',
                                            },
                                        }}
                                        onClick={handleClickOpen}
                                    >
                                        Message
                                    </Button>
                                    <ShowChat userProfile={userProfile} user={user} open={open} handleClose={handleClose} />
                                </Box>
                            }

                            <Box sx={{ display: 'flex', mt: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', mx: 2 }}>
                                    <Typography variant="subtitle1" color="initial">Posts</Typography>
                                    <Typography variant="h6" color="initial" sx={{ fontWeight: 'bold' }}>{userProfile.posts.length}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', mx: 2 }}>
                                    <Typography variant="subtitle1" color="initial">Followers</Typography>
                                    <Typography variant="h6" color="initial" sx={{ fontWeight: 'bold' }}>{userProfile.followers.length}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', mx: 2 }}>
                                    <Typography variant="subtitle1" color="initial">Following</Typography>
                                    <Typography variant="h6" color="initial" sx={{ fontWeight: 'bold' }}>{userProfile.following.length}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card >) : (
            <CircularIndeterminate />
        )
    )
}

export default ProfileInformation
