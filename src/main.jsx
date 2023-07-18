import React, { useState, useEffect } from "react";
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
  const [visibleResults, setVisibleResults] = useState(10);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    const searchTerm = document.getElementById("search-bar").value;

    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        setSearchResults(data.docs.filter(result => result.cover_edition_key));
        setVisibleResults(10);
        setSearchPerformed(true);
      })
      .catch(error => {
        console.error("Error fetching search results:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === "Enter") {
        handleSearch();
      }
    };

    document
      .getElementById("search-bar")
      .addEventListener("keypress", handleKeyPress);

    return () => {
      document
        .getElementById("search-bar")
        .removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const loadMoreResults = () => {
    setVisibleResults(prevVisibleResults => prevVisibleResults + 10);
  };

  const handleBookClick = book => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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

      {isLoading && <p className="centerP">Loading...</p>}

      {searchPerformed && searchResults.length > 0 && (
        <div className="search-results-container">
          {searchResults.slice(0, visibleResults).map(result => (
            <div
              key={result.key}
              className="search-result-item col-6"
              onClick={() => handleBookClick(result)}
            >
              <img
                src={`https://covers.openlibrary.org/b/olid/${result.cover_edition_key}-M.jpg`}
                alt="Book Cover"
              />
              <p>{result.title}</p>
            </div>
          ))}
        </div>
      )}

      {searchPerformed && searchResults.length === 0 && (
        <p className="centerP">No results found.</p>
      )}

      {!isLoading && visibleResults < searchResults.length && (
        <div className="load-more-button-container">
          <button className="btn btn-primary" onClick={loadMoreResults}>
            More Results
          </button>
        </div>
      )}

      {showModal && selectedBook && (
        <Modal book={selectedBook} closeModal={closeModal} />
      )}
    </div>
  );
}

function Modal({ book, closeModal }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <img
          src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`}
          alt="Book Cover"
          className="book-cover"
        />
        <h2>{book.title}</h2>
        <p>
          <span className="property-name">Author: </span>
          {book.author_name}
        </p>
        <p>
          <span className="property-name">Publish Year:</span>{" "}
          {book.first_publish_year}
        </p>
        <p>
          <span className="property-name">Number of Pages:</span>{" "}
          {book.number_of_pages_median}
        </p>
      </div>
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
