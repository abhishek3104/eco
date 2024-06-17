import React from "react";
import { render, screen, fireEvent, waitFor,} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUpForm from ".";
 
describe("SignUpForm", () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
 
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        headers: {
          get: jest.fn(),
        },
      })
    ) as jest.Mock;
  });
 
  afterEach(() => {
    jest.resetAllMocks();
  });
 
  test("renders the sign up form", () => {
    renderComponent();
 
    expect(screen.getByPlaceholderText(/username\*/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e-mail\*/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password\*/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });
 
  test("validates form fields", async () => {
    renderComponent();
 
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(/username is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });
 
  test("validates username length", async () => {
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: "ab" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(/username must be between 3 and 25 characters/i)
    ).toBeInTheDocument();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: "a".repeat(26) },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(/username must be between 3 and 25 characters/i)
    ).toBeInTheDocument();
  });
 
  test("validates username format", async () => {
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: "_user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(
        /username should not start with a number, special character, or underscore/i
      )
    ).toBeInTheDocument();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: " user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(/Username should not start or end with a space/i)
    ).toBeInTheDocument();
  });
 
  test("validates email format", async () => {
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/e-mail\*/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
 
    fireEvent.change(screen.getByPlaceholderText(/e-mail\*/i), {
      target: { value: "#user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(
        /email should not start with a special character/i
      )
    ).toBeInTheDocument();
  });
 
  test("validates password format", async () => {
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/password\*/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(
        /password must be between 8 and 15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      )
    ).toBeInTheDocument();
 
    fireEvent.change(screen.getByPlaceholderText(/password\*/i), {
      target: { value: "NoSpecial1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    expect(
      await screen.findByText(
        /password must be between 8 and 15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character/i
      )
    ).toBeInTheDocument();
  });
 
  test("submits the form successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("An unexpected error occurred"),
        headers: {
          get: jest.fn(),
        },
      })
    ) as jest.Mock;
 
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/e-mail\*/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password\*/i), {
      target: { value: "Password1!" },
    });
 
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
    // Check for absence of validation errors
    await waitFor(() => {
      expect(
        screen.queryByText(/username is required/i)
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/password is required/i)
      ).not.toBeInTheDocument();
    });
  });
 
  test("shows API error message on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("An unexpected error occurred"),
        headers: {
          get: jest.fn(),
        },
      })
    ) as jest.Mock;
 
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username\*/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/e-mail\*/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password\*/i), {
      target: { value: "Password1!" },
    });
 
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
 
  });
     
  });
  test("handles specific API validation errors", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("An unexpected error occurred"),
        headers: {
          get: jest.fn(),
        },
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Username already exists"),
        headers: {
          get: jest.fn(),
        },
      })
    ) as jest.Mock
  });
