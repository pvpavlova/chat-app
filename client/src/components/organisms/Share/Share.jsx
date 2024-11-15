import "./Share.css";
import { useState } from "react";
import { PermMedia } from "@mui/icons-material";
import axiosInstance from "../../../services/axiosInstance";

export default function Share({ user, onNewPost }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null); 
  const { VITE_API } = import.meta.env;

  const handleShare = async () => {
    if (!content.trim() && !file) {
      alert("Введите текст поста или добавьте изображение");
      return;
    }

    setIsLoading(true);

    try {
      const newPost = new FormData();
      newPost.append("userId", user.id);
      newPost.append("description", content);

      if (file) {
        newPost.append("image", file);
      }

       const res = await axiosInstance.post(`${VITE_API}/posts`, newPost, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", res);

      if (res.status === 200 || res.status === 201) {
        onNewPost(res.data);  
        setContent(""); 
        setFile(null);
      }
    } catch (err) {
      console.error("Failed to share post:", err);
    } finally {
      setIsLoading(false);  
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="share">
      <div className="share-wrapper">
        <div className="share-top">
          <img
            className="share-profile-img"
            src="/assets/logo.webp"
            alt="Profile"
          />
          <input
            placeholder={`Что у вас на уме, ${user.username || "дорогой друг"}?`}
            className="share-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <hr className="share-hr" />
        <div className="share-bottom">
          <div className="share-options">
            <div className="share-option">
              <PermMedia htmlColor="tomato"   onClick={handleFileChange}
                disabled={isLoading} className="share-icon" />
              <input
                type="file"
                accept="image/*"
                className="share-file-input"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            className="share-button"
            onClick={handleShare}
            disabled={!content.trim() && !file || isLoading}
          >
            {isLoading ? "Публикуется..." : "Поделиться"}
          </button>
        </div>
      </div>
    </div>
  );
}