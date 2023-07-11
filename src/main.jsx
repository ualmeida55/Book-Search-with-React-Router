import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/searchResults" element={<SearchResults />} />
    </Routes>
  </Router>
);

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    setIsLoading(true);
    const searchTerm = document.getElementById("search-bar").value;

    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        setSearchResults(data.docs);
      })
      .catch(error => {
        console.error("Error fetching search results:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-xxl-11 gx-2">
          <label htmlFor=""></label>
          <input
            type="text"
            className="form-control bg-dark text-white"
            placeholder="Type book name"
            id="search-bar"
          />
        </div>
        <div className="col-xxl-1 searchButton">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}

      {!isLoading && searchResults.length > 0 && (
        <div>
          <h1>Search Results</h1>
          {searchResults.map(result => (
            <div key={result.key}>
              <img
                src={`https://covers.openlibrary.org/b/olid/${result.cover_edition_key}-M.jpg`}
                alt="Book Cover"
              />
              <p>{result.title}</p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchResults.length === 0 && (
        <p>No results found.</p>
      )}
    </div>
  );
}

function SearchResults() {
  return (
    <div>
      <h1>Search Results Page</h1>
    </div>
  );
}
