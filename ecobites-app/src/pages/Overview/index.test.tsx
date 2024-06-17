import React from "react";
import { screen, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import OverviewPage from "./index";


test("should work for the signup button", () => {
  render(<Router><OverviewPage /></Router>);
  const signup = screen.getByText(/Sign Up/i);
  expect(signup).toBeInTheDocument();
  expect(signup).toHaveClass("button_design");
});

test("should work for the login button", () => {
  render(<Router><OverviewPage /></Router>);
  const login = screen.getByText(/Log in/i);
  expect(login).toBeInTheDocument();
  expect(login).toHaveClass("button_white_design");
});
