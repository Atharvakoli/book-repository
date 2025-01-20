const express = require("express");
const {
  addUser,
  addBook,
  searchBook,
  addReadingList,
  updateBook,
  getReadingListByUser,
  removeBookFromReadingList,
} = require("./controllers/index.controller");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to book repository");
});

app.post("/api/users", addUser);
app.post("/api/books", addBook);
app.get("/api/books/search", searchBook);
app.post("/api/reading-list", addReadingList);
app.post("/api/books/:bookId", updateBook);
app.get("/api/reading-list/:userId", getReadingListByUser);
app.post("/api/reading-list/:readingListId", removeBookFromReadingList);

module.exports = app;
