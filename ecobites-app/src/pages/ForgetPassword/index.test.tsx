import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Forgetpassword from "./index";
import axios from "axios";
import { ErrorMsg } from "../../common/constants/constants";

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
  post: jest.fn()
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("renders the forget password page", () => {
  render(
    <Router>
      <Forgetpassword />
    </Router>
  );
  expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
});

test("displays email input field", () => {
  render(
    <Router>
      <Forgetpassword />
    </Router>
  );
  const emailInput = screen.getByLabelText("E-mail");
  expect(emailInput).toBeInTheDocument();
});

test("updates email state when typing in email input field", () => {
  render(
    <Router>
      <Forgetpassword />
    </Router>
  );
  const emailInput = screen.getByLabelText("E-mail");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  expect(emailInput).toHaveValue("test@example.com");
});

test("handles server error", async () => {
  render(<Router><Forgetpassword /></Router>);
  const email = "test@example.com";
  const emailInput = screen.getByLabelText("E-mail");
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.submit(screen.getByTestId('forgot-password-form'));
  await waitFor(() => {
    const errorMsg = screen.queryByTestId('error-message');
    expect(errorMsg).toBeTruthy();
  });
});

test("displays error if email format is not valid", async () => {
  render(
    <Router>
      <Forgetpassword />
    </Router>
  );

  const email = "test@example";
  const emailInput = screen.getByLabelText("E-mail");

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.submit(screen.getByTestId('forgot-password-form'));

  await waitFor(() => {
    expect(emailInput).toHaveClass("email-input-error-class"); 
  });
});


test("handles successful server response", async () => {
  mockedAxios.post.mockResolvedValueOnce({ data: { password: 'newPassword123' } });

  render(<Router><Forgetpassword /></Router>);

  const emailInput = screen.getByLabelText("E-mail");

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.submit(screen.getByTestId('forgot-password-form'));

  await waitFor(() => {
    expect(screen.getByText(/Your new temporary password is:/i)).toBeInTheDocument();
    expect(screen.getByText(/newPassword123/i)).toBeInTheDocument();
  });
});

test("handles server error without error message", async () => {
  const mockError = {
    response: {
      data: {},
    },
  };

  mockedAxios.post.mockRejectedValueOnce(mockError);

  render(
    <Router>
      <Forgetpassword />
    </Router>
  );

  const email = "test2@example.com";
  const emailInput = screen.getByLabelText("E-mail");

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.submit(screen.getByTestId('forgot-password-form'));

  await waitFor(() => {
    const errorMsg = screen.getByTestId('error-message');
    expect(errorMsg).toBeInTheDocument();
  });
});

test("handles axios error without response", async () => {
  const mockError = new Error();
  mockedAxios.post.mockImplementationOnce(() => Promise.reject(mockError));

  render(
    <Router>
      <Forgetpassword />
    </Router>
  );

  const email = "test3@example.com";
  const emailInput = screen.getByLabelText("E-mail");

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.submit(screen.getByTestId('forgot-password-form'));

  await waitFor(() => {
    const errorMsg = screen.getByTestId('error-message');
    expect(errorMsg).toHaveTextContent(ErrorMsg);
  });
});