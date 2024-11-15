import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Sidebar from '../../organisms/SideBar/SideBar';
import './GalleryPage.css';

const GalleryPage = ({ user }) => {
  const [photos, setPhotos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/users/${user.id}`);
        setPhotos(response.data.photos || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddPhoto = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newPhoto = response.data.filePath;

      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      setSelectedFile(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <div className="gallery-page">
      <Sidebar />
      <Box className="gallery-content">
        <Box className="gallery-header">
          <Typography variant="h4" className="gallery-title">
            Мои фотографии
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Добавить
          </Button>
        </Box>

        <Grid container spacing={2} className="photo-grid">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box className="photo-item">
                  <img
                    src={`http://localhost:3000${photo}`}
                    alt={`Photo ${index + 1}`}
                    className="photo-img"
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <Typography className="no-photos-message">
              Здесь пока нет фото 
            </Typography>
          )}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Добавить</DialogTitle>
          <DialogContent>
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleAddPhoto} color="primary">
              Загрузить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default GalleryPage;