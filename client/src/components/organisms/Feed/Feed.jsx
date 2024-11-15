import "./Feed.css";
import Share from "../Share/Share";
import Post from "../Post/Post";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const VITE_API = import.meta.env.VITE_API;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`${VITE_API}/posts/timeline/${user.id}`);
        const sortedPosts = res.data.sort(
          (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
      }
    };

    fetchPosts();
  }, [user, VITE_API]);


  const handleEditPost = async (updatedPost) => {
    try {
      const res = await axiosInstance.put(`${VITE_API}/posts/${updatedPost.id}`, updatedPost);
      if (res.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      } else {
        console.error("Ошибка при редактировании поста");
      }
    } catch (error) {
      console.error("Ошибка при редактировании поста:", error);
    }
  };


const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share
          user={user}
          onNewPost={(newPost) => setPosts((prevPosts) => [newPost, ...prevPosts])}
        />
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              user={user}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <p className="noPostsMessage">Постов пока нет. Поделитесь первым!</p>
        )}
      </div>
    </div>
  );
}