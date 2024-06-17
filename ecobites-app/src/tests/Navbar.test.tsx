import React from "react";
import { screen, render } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock("@epam/assets/icons/action-account-fill.svg", () => ({
  ReactComponent: () => <svg data-testid="icon-account" />,
}));
jest.mock("@epam/assets/icons/action-home-fill-opt.2.svg", () => ({
  ReactComponent: () => <svg data-testid="icon-home" />,
}));
jest.mock("@epam/assets/icons/editor-list_bullet-outline.svg", () => ({
  ReactComponent: () => <svg data-testid="icon-list" />,
}));

test("should work for the home link of  the NavbarPage", () => {
 
  render( <Router><Navbar /></Router>);
  
  const homelink = screen.getByRole("link", { name: "Home" });
  expect(homelink).toBeInTheDocument();
  expect(screen.getByTestId("icon-home")).toBeInTheDocument();
  expect(homelink).toHaveClass("link_design");
});


test("should work for the grocery list link of  the NavbarPage", () => {
  render(<Router><Navbar /></Router>);
  const grocerylistlink = screen.getByRole("link", { name: "GroceeryList" });
  expect(grocerylistlink).toBeInTheDocument();
  expect(screen.getByTestId("icon-list")).toBeInTheDocument();
});
test("should work for the profile link of  the NavbarPage", () => {
  render(<Router><Navbar /></Router>);
  const profilelink = screen.getByRole("link", { name: "Profile" });
  expect(profilelink).toBeInTheDocument();
  expect(screen.getByTestId("icon-account")).toBeInTheDocument();
});



