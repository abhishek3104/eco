import React from "react";
jest.mock('axios');
import axios from 'axios';
import { render, screen,fireEvent,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./index";
import {BrowserRouter as Router} from "react-router-dom";
import { useNavigate as originalUseNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
  post: jest.fn()
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("renders the login page", () => {
  render( 
    <Router>
      <Login/> 
    </Router>
  );
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Password');
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(screen.getAllByText(/Log in/i)).toHaveLength(2);
});

test("display error when password length is less than 8", async () => {
  render(<Router><Login /></Router>);
  
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: /log in/i });
  
  userEvent.type(emailInput, 'test@gmail.com');
  userEvent.type(passwordInput, 'pass1'); // password with less than 8 characters
  
  fireEvent.click(loginButton);
  
  expect(screen.getByText(/Password must be at least 8 characters and not more than 15 characters/i)).toBeInTheDocument();
});

test("can enter email and password into the fields", () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

  expect(screen.getByLabelText(/E-mail/i)).toHaveValue('test@example.com');
  expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
});

test("renders the forget password link", () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  const forgetPasswordLink = screen.getByText(/Forget password\?/i);
  expect(forgetPasswordLink).toBeInTheDocument();

  fireEvent.click(forgetPasswordLink);

  // Assert the navigation to the forgetpassword route
  expect(window.location.pathname).toBe("/forgetpassword");
});

test("renders the sign up link", () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  const signUpLink = screen.getByText(/Sign up/i);
  expect(signUpLink).toBeInTheDocument();

  fireEvent.click(signUpLink);

  // Assert the navigation to the sign up route
  expect(window.location.pathname).toBe("/signup");
});


test("submits the form and calls the login API", async () => {
  render(
    <Router>
      <Login/>
    </Router>
  );
  
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: /log in/i });

  // Fill out the form
  userEvent.type(emailInput, 'test@gmail.com');
  userEvent.type(passwordInput, 'password123');
  // Mock the API call
  (axios.post as jest.MockedFunction<typeof axios.post>)
    .mockResolvedValueOnce( Promise.resolve({ data: { success: true } }));

    fireEvent.click(loginButton);

  // Wait for the promise to resolve
  await waitFor(() => expect(axios.post).toBeCalledWith(
    "http://localhost:8080/users/login", 
    {
      email: 'test@gmail.com',
      password: 'password123'
    },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  ));
});

test("shows error when password is wrong", async () => {
  mockedAxios.post.mockRejectedValueOnce({
    response: { data: { error: '401 UNAUTHORIZED', status: 'Wrong Password' } },
  });
  render(<Router><Login /></Router>);
  fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
  await waitFor(() => {
    const errorElement = document.querySelector('p.error');
    expect(errorElement).toBeTruthy();
  });
});
test("shows error when email is not found", async () => {
  mockedAxios.post.mockRejectedValueOnce({
    response: { data: { error: '404 NOT FOUND', status: 'Email not found' } },
  });
  render(<Router><Login /></Router>);
  fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
  await waitFor(() => {
    const errorElement = document.querySelector('p.error');
    expect(errorElement).toBeTruthy();
  });
});

test("handles network errors", async () => {
  mockedAxios.post.mockImplementationOnce(() => Promise.reject(new Error()));
  
  render(<Router><Login /></Router>);
  
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByRole('button', { name: /log in/i });

  userEvent.type(emailInput, 'test@gmail.com');
  userEvent.type(passwordInput, 'password123');
  
  fireEvent.click(loginButton);
  
  await waitFor(() => {
    const errorElement = screen.getByText(/An error occurred. Please try again later./i);
    expect(errorElement).toBeTruthy();
  });
});

test("handle successful login", async () => {
  const fakeResponse = { 
    status: 200, 
    data: { token: "fake_token", id: "fake_id" } 
  };

  mockedAxios.post.mockResolvedValueOnce(fakeResponse);

  // Spy on sessionStorage.setItem calls
  const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

  // Provide your mock implementation
  const mockNavigate = jest.fn();
  (originalUseNavigate as jest.Mock).mockReturnValue(mockNavigate);  // Here!

  render(<Router><Login /></Router>);

  const emailInput = screen.getByLabelText(/E-mail/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole('button', { name: /Log in/i });

  userEvent.type(emailInput, 'test@example.com');
  userEvent.type(passwordInput, 'password123');

  fireEvent.click(loginButton);

  // Wait for all calls to be completed
  await waitFor(() => {
    // Check if sessionStorage.setItem was called with correct values
    expect(setItemSpy).toHaveBeenCalledWith('jwt_token', fakeResponse.data.token);
    expect(setItemSpy).toHaveBeenCalledWith('user_id', fakeResponse.data.id);

    // Check if 'navigate' was called
    expect(mockNavigate).toHaveBeenCalledWith('/profile2');
  });
});