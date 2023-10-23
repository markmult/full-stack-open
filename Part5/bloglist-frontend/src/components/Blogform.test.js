import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./Blogform";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createBlog = jest.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");
  const sendButton = screen.getByText("create");

  await user.type(titleInput, "testTitle");
  await user.type(authorInput, "testAuthor");
  await user.type(urlInput, "http://testsite.com");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  console.log(createBlog.mock.calls[0][0]);
  expect(createBlog.mock.calls[0][0].title).toBe("testTitle");
  expect(createBlog.mock.calls[0][0].author).toBe("testAuthor");
  expect(createBlog.mock.calls[0][0].url).toBe("http://testsite.com");
});
