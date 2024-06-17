import React from "react";
import { render, fireEvent, waitFor, cleanup, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import LogoutButton from "./LogoutButton";
 
jest.mock("axios");
 
const mockedAxios = axios as jest.Mocked<typeof axios>;
 
const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
 
describe("LogoutButton", () => {
  afterEach(cleanup);
 
  test("renders LogoutButton component", async () => {
     render(
      <Router>
        <LogoutButton />
      </Router>
    );
  });  
 
  test("handles logout button click", async () => {
     render(
      <Router>
        <LogoutButton />
      </Router>
    );
 
    mockedAxios.post.mockResolvedValue({ data: { status: "ok" } });
 
    fireEvent.click(screen.getByText(/Logout/i));
 
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith("jwt_token");
    });
  });
});
