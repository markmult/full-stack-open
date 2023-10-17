const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    _id: "9wefnsd43589hfds4743t43",
    title: "HTML is easy",
    author: "Test Blogger",
    url: "https://url.com/",
    likes: 9,
    __v: 0,
  },
  {
    _id: "356wfdfnsd43589hfds4743t43",
    title: "Learn React",
    author: "React pro",
    url: "https://react.com/",
    likes: 13,
    __v: 0,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("user");
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
