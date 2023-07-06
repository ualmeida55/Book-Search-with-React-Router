import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/searchResults" element={<SearchResults />}></Route>
    </Routes>
  </Router>
);

function Home() {
  return (
    <div class="container">
      <div class="row">
        <div class="col-xxl-11 gx-2">
          <label htmlFor=""></label>
          <input
            type="text"
            class="form-control bg-dark text-white"
            placeholder="Type book name"
          />
        </div>
        <div class="col-xxl-1 searchButton">
          <button class="btn btn-primary">Search</button>
        </div>
      </div>
    </div>
  );
}
function SearchResults() {
  return (
    <div>
      <input type="text" id="search-bar" placeholder="Type Book" />
      <button type="button" class="btn btn-warning">
        Warning
      </button>
      <h1>aaaa</h1>
    </div>
  );
}
