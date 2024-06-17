import React from "react";
import { render } from "@testing-library/react";
import Layout from "../Layout";


import { BrowserRouter as Router } from 'react-router-dom';

test("should render the layout perfectly", () => {
  render(
    <Router>
      <Layout />
    </Router>
  );
});


