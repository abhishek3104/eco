import { screen, render } from "@testing-library/react";
import Ecobites from "../components/Ecobites";
import React from "react";


test("render for the summary text part of the page", () => {
  render(<Ecobites />);
  
  const ecobitesText = screen.getByText(/Ecobites/i);
  expect(ecobitesText).toBeInTheDocument();
  expect(ecobitesText).toHaveClass("ecobites");
});
