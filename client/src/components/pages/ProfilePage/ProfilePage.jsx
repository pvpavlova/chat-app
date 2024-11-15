import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axiosInstance from '../../../services/axiosInstance';
import Sidebar from '../../organisms/SideBar/SideBar';
import './ProfilePage.css'

const ProfilePage = ({ user }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    city: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { VITE_API } = import.meta.env;

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    setFormData({
      username: userData.username,
      email: userData.email,
      description: userData.description || '',
      city: userData.city || '',
    });
    setProfileImage(userData.profilePicture || null);
    setCoverImage(userData.coverPicture || null);
  } else if (user) {
    setFormData({
      username: user.username,
      email: user.email,
      description: user.description || '',
      city: user.city || '',
    });
    setProfileImage(user.profilePicture || null);
    setCoverImage(user.coverPicture || null);
  }
}, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); 
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file)); 
    }
  };

  const fetchUpdatedUserData = async () => {
    try {
      const response = await axiosInstance.get(`${VITE_API}/users/${user.id}`);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        description: response.data.description,
        city: response.data.city,
      });
      setProfileImage(response.data.profilePicture); 
      setCoverImage(response.data.coverPicture);
    } catch (error) {
      console.error('Error fetching updated user data:', error);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const updatedData = new FormData();

  updatedData.append('username', formData.username);
  updatedData.append('email', formData.email);
  updatedData.append('description', formData.description);
  updatedData.append('city', formData.city);

  if (profileImage) {
    updatedData.append('profilePicture', profileImage); 
  }
  if (coverImage) {
    updatedData.append('coverPicture', coverImage); 
  }

  try {
    await axiosInstance.put(`${VITE_API}/users/${user.id}`, updatedData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    fetchUpdatedUserData();
    localStorage.setItem('user', JSON.stringify({
      ...formData,
      profilePicture: profileImage,
      coverPicture: coverImage,
    }));

    alert('Profile updated successfully');
    setOpenDialog(false);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="home-container">
      <Sidebar />
      <Box className="profile-page">
        <div className="cover-image">
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Редактировать
          </Button>
        </div>

        <div className="profile-header">
          <Avatar
            sx={{ width: 150, height: 150, border: '5px solid white' }}
            src={profileImage || ''}
          />
          <Typography variant="h5" className="profile-name">{formData.username}</Typography>
          <Typography variant="h6" className="profile-name2">{formData.city}</Typography>
          <Typography variant="h6" className="profile-name2">{formData.description}</Typography>
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Редактировать</DialogTitle>
          <DialogContent>
            <form className="profile-form" onSubmit={handleSubmit}>
            
              <div className="image-upload">
                <Button variant="contained" color="primary" component="label">
                  Загрузить фото профиля
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfileImageChange}
                  />
                </Button>
                {profileImage && (
                  <div>
                    <img
                      src={profileImage} 
                      alt="Profile"
                      style={{ width: '100px', height: '100px' }}
                    />
                  </div>
                )}
              </div>


              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
              />

              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                 Отмена
                </Button>
                <Button type="submit" color="danger">
                  Сохранить
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default ProfilePage;