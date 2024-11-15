import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

export default function GalleryPage({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.userId);

    try {
      await axiosInstance.post("/upload/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(true);
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
    }
  };

  return (
    <div className="upload-photo">
      <h2>Загрузить фото</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Preview" className="preview-img" />
        </div>
      )}
      <button onClick={handleUpload}>Загрузить фото</button>
      {uploadSuccess && <p>Фото успешно загружено!</p>}
    </div>
  );
}