import { screen, render } from "@testing-library/react";
import HomePage from ".";
import React from "react";
import { BrowserRouter } from "react-router-dom";


describe("HomePage", () => {
  test("render for the summary text part of the page", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const summary = screen.getByText(
      /Recipes and ingredients will appear here once added, Lets cook/i
    );
    expect(summary).toBeInTheDocument();
  });
  test("render for the explore recipe button", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const addRecipe = screen.getByText(/Explore Recipe/i);
    expect(addRecipe).toBeInTheDocument();
    expect(addRecipe).toHaveClass("button_design");
  });
});
