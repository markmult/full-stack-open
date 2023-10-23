import { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import Blog from "./components/Blog";
import BlogForm from "./components/Blogform";
import blogService from "./services/blogs";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [positive, setPositive] = useState(true);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => {
        blogs.sort((a, b) => b.likes - a.likes);
        setBlogs(blogs);
      });
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const handleBlogCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const blog = await blogService.create(blogObject);
      setBlogs((state) => [...state, blog]);
      setPositive(true);
      setNotificationMessage(
        `a new blog ${blog.title} by ${blog.author} added`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (exception) {
      setPositive(false);
      setNotificationMessage("Unable to add blog");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleBlogDelete = async (id) => {
    await blogService.remove(id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleBlogLike = async (id, blogObject) => {
    const blog = await blogService.update(id, blogObject);
    const newBlogs = blogs.map((oldBlog, i) => {
      if (oldBlog.id === blog.id) {
        const newBlog = oldBlog;
        newBlog.likes = blog.likes;
        return newBlog;
      } else {
        return oldBlog;
      }
    });
    newBlogs.sort((a, b) => b.likes - a.likes);
    setBlogs(newBlogs);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setPositive(false);
      setNotificationMessage("wrong username of password");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} positive={positive} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={handleBlogCreate} />
    </Togglable>
  );

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} positive={positive} />
      <div>{user.name} is logged in</div>
      <button onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleBlogDelete={handleBlogDelete}
          handleBlogLike={handleBlogLike}
        />
      ))}
    </div>
  );
};

export default App;
