import React from "react";
import "./App.css";
import { CssBaseline } from "@material-ui/core";
import TopBar from "./Components/TopBar";
import Main from "./Components/Main";

export default function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <TopBar />
      <Main />
    </React.Fragment>
  );
}
