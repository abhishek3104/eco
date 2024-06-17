import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import DietaryPreferences from "./index";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DietaryPreferences", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test("renders the component correctly", () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter image URL")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  test("displays error when no fields are updated", async () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "At least one field (username or image URL) must be updated."
        )
      ).toBeInTheDocument();
    });
  });

  test("displays error when user ID is not found", async () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "newusername" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update profile: User ID not found.")
      ).toBeInTheDocument();
    });
  });
  test("should work for the functionality of button", () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );
    const button = screen.getByText("Update");
    expect(button).toHaveClass("button_design");
    expect(button).toBeInTheDocument();
  });
  test("validates username correctly", async () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, { target: { value: "a" } });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText("Username must be between 3 and 25 characters.")
      ).toBeInTheDocument();
    });

    fireEvent.change(usernameInput, { target: { value: "123username" } });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText("Username should not start with a number.")
      ).toBeInTheDocument();
    });
  });
  test("displays error when image URL is invalid", async () => {
    render(
      <Router>
        <DietaryPreferences />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter image URL"), {
      target: { value: "invalid-url" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(screen.getByText('Invalid image URL. It should start with "https://" and end with ".jpg", ".jpeg", or ".png".')).toBeInTheDocument();
    });
  });


});
