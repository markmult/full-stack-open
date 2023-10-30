import { useState } from "react";

const Blog = ({ blog, user, handleBlogDelete, handleBlogLike }) => {
  const [showFull, setShowFull] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: showFull ? "" : "none" };

  const toggleVisibility = () => {
    setShowFull(!showFull);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleBlogDelete(blog.id);
    }
  };

  const handleLike = () => {
    console.log(blog.likes);
    const likes = blog.likes === undefined ? 1 : blog.likes + 1;
    console.log(likes);
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes,
    };
    handleBlogLike(blog.id, blogObject);
  };

  return (
    <div className="blogContent" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{showFull ? "hide" : "view"}</button>
      </div>
      <div style={showWhenVisible} className="additionalBlogContent">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes === undefined ? 0 : blog.likes}{" "}
          <button id="like-button" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {showFull && blog.user.username === user.username && (
          <button id="remove-blog" onClick={handleDelete}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
