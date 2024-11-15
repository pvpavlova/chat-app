import "./Post.css";
import { format } from "timeago.js";
import { useState } from "react";
import { Edit,Delete } from "@mui/icons-material";
import axiosInstance from "../../../services/axiosInstance";

export default function Post({ post, user, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(post.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { VITE_API } = import.meta.env;
  const likesCount = post.likes || 0;

  const handleEdit = async () => {
    if (!newDescription.trim()) {
      setError("Описание не может быть пустым.");
      return;
    }

    setLoading(true);
    setError(null); 
    try {
      const updatedPost = { ...post, description: newDescription };

      const res = await axiosInstance.put(`${VITE_API}/posts/${post.id}`, updatedPost);
      if (res.status === 200) {
        onEdit(updatedPost);
        setIsEditing(false);
      } else {
        setError("Ошибка при обновлении поста. Попробуйте позже.");
      }
    } catch (err) {
      console.error("Ошибка при редактировании поста:", err);
      setError("Не удалось обновить пост.");
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот пост?")) {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.delete(`${VITE_API}/posts/${post.id}` , {
      data: { userId: user.id }, 
    });
        if (res.status === 200) {
          onDelete(post.id);
        } else {
          setError("Ошибка при удалении поста. Попробуйте позже.");
        }
      } catch (err) {
        console.error("Ошибка при удалении поста:", err);
        setError("Не удалось удалить пост.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="post">
      <div className="post-wrapper">
        <div className="post-top">
          <div className="post-top-left">
            <img
              className="post-profile-img"
              src={user.profilePicture || "/assets/logo.webp"}
              alt={user.username || "User"}
            />
            <span className="post-username">{user.username}</span>
            <span className="post-date">{format(post.createdAt)}</span>
          </div>
          <div className="post-top-right">
            {user.id === post.userId && (
              <div className="post-actions">
                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Отменить" : <Edit htmlColor="grey" className="share-icon" />}
                </button>
                <button className="delete-btn" onClick={handleDelete} disabled={loading}>
                  {loading ? "Удаление..." : <Delete htmlColor="grey" className="share-icon" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="post-center">
          {isEditing ? (
            <div>
              <textarea
                className="post-edit-textarea"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <button onClick={handleEdit} disabled={loading}>
                {loading ? "Сохраняем..." : "Сохранить изменения"}
              </button>
            </div>
          ) : (
            <span className="post-text">{post.description}</span>
          )}
          {post.img && (
            <img
              className="post-img"
              src={`http://localhost:3000${post.img}`}
              alt="Post content"
            />
          )}
        </div>

        {/* <div className="post-bottom">
          <div className="post-bottom-left">
            <img className="like-icon" src="assets/like.png" alt="Like" />
            <img className="like-icon" src="assets/heart.png" alt="Heart" />
            <span className="post-like-counter">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
          </div>
        </div> */}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}