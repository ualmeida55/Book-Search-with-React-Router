import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
      <div className="credits text-center">
        <a href="https://github.com/ualmeida55/Book-Search-with-React-Router">
          Code
        </a>{" "}
        by <a href="https://linkedin.com/in/ualmeida">Ubi Almeida</a>
      </div>
      <h1 className="text-center h1Title">Book Search</h1>
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
      {isLoading && <h3 className="centerP">Loading...</h3>}
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
  const authors = book.author_name?.join(", ") || "Unavailable";
  const publishYear = book.first_publish_year || "Unavailable";
  const numPages = book.number_of_pages_median || "Unavailable";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.classList.contains("modal") ||
        event.target.classList.contains("modal-content")
      ) {
        closeModal();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [closeModal]);

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
          {authors}
        </p>
        <p>
          <span className="property-name">Publish Year:</span>{" "}
          {publishYear}
        </p>
        <p>
          <span className="property-name">Number of Pages:</span>{" "}
          {numPages}
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
