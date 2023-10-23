import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Blog for testing",
    author: "Test blogger",
    url: "http://testsite.com",
    likes: 5,
    user: {
      id: "1234",
    },
  };
  const user = {
    id: "1234",
  };

  render(<Blog blog={blog} user={user} />);

  const element = screen.getByText("Blog for testing Test blogger");
  expect(element).toBeDefined();
});

test("content after clicking view button", async () => {
  const blog = {
    title: "Blog for testing",
    author: "Test blogger",
    url: "http://testsite.com",
    likes: 5,
    user: {
      id: "1234",
    },
  };
  const user = {
    id: "1234",
  };

  const { container } = render(<Blog blog={blog} user={user} />);

  const div = container.querySelector(".additionalBlogContent");

  expect(div).toHaveTextContent("http://testsite.com");
  expect(div).toHaveTextContent("5");
});

test("like button registered twice", async () => {
  const blog = {
    title: "Blog for testing",
    author: "Test blogger",
    url: "http://testsite.com",
    likes: 5,
    user: {
      id: "1234",
    },
  };
  const user = {
    id: "1234",
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} user={user} handleBlogLike={mockHandler} />);

  const testUser = userEvent.setup();
  const button = screen.getByText("like");
  await testUser.click(button);
  await testUser.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
