const {
  addNewUser,
  addNewBook,
  searchBookByTitleAuthor,
  addNewReadingList,
} = require("../service/index.service");
const { User, Book, ReadingList } = require("../models");
const {
  isValidateUserDetails,
  isValidBookDetails,
  isValidSearchDetails,
  isValidReadingListDetails,
  validateDetailsOfUpdate,
} = require("./validation/validate");

async function addUser(req, res) {
  try {
    const user = req.body;

    const validateUser = isValidateUserDetails(user);

    if (validateUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Credentails are required", validateUser });
    }

    const existingUser = await User.findOne({ where: { email: user.email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await addNewUser(user);

    if (!newUser) {
      return res
        .status(400)
        .json({ message: "Something went wrong while creating User." });
    }
    res.status(201).json({ message: "User created successfully.", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addBook(req, res) {
  try {
    const book = req.body;

    const validateBook = isValidBookDetails(book);

    if (validateBook.length > 0) {
      return res
        .status(400)
        .json({ message: "Credentails are required", validateBook });
    }

    const newBook = await addNewBook(book);

    if (!newBook) {
      return res
        .status(400)
        .json({ message: "Something went wrong while creating book." });
    }
    res.status(201).json({ message: "Book created successfully.", newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function searchBook(req, res) {
  try {
    const title = req.query.title;
    const author = req.query.author;

    const validateBook = isValidSearchDetails(title, author);

    if (validateBook.length > 0) {
      return res
        .status(400)
        .json({ message: "Credentails are required", validateBook });
    }

    const book = await searchBookByTitleAuthor(title, author);

    if (!book) {
      return res.status(400).json({ message: "Book, NOT FOUND" });
    }
    res.status(200).json({ message: "Book Found successfully.", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addReadingList(req, res) {
  try {
    const body = req.body;

    const validateReadingList = isValidReadingListDetails(body);

    if (validateReadingList.length > 0) {
      return res
        .status(400)
        .json({ message: "Credentails are required", validateReadingList });
    }

    const newReadingList = await addNewReadingList(body);

    if (!newReadingList) {
      return res.status(400).json({
        message: "Something went wrong while creating Reading List .",
      });
    }
    res.status(201).json({
      message: "Book added to reading list",
      newReadingList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBook(req, res) {
  try {
    let { title, genre } = req.body;
    const bookId = req.params.bookId;
    const errors = validateDetailsOfUpdate(req.body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "credentails are required", errors });
    }

    if (!bookId) {
      return res.status(400).json({ message: "BookId are required" });
    }

    const book = await Book.findOne({ where: { id: bookId } });

    book.title = title;
    book.genre = genre;

    await book.save();

    if (!book) {
      return res.status(400).json({
        message: "Book, NOT FOUND.",
      });
    }
    res.status(201).json({
      message: "Book details updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getReadingListByUser(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "UserId are required" });
    }

    const readingList = await ReadingList.findAll({ where: { id: userId } });

    if (!readingList) {
      return res
        .status(404)
        .json({ message: "User not found or no books in reading list" });
    }
    res.status(200).json({ readingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeBookFromReadingList(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "UserId are required" });
    }

    const readingList = await ReadingList.findAll({ where: { id: userId } });

    if (!readingList) {
      return res.status(404).json({ message: "Reading list entry not found" });
    }

    readingList.destroy();

    res
      .status(200)
      .json({ message: "Book removed from reading list", readingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addUser,
  addBook,
  searchBook,
  addReadingList,
  updateBook,
  getReadingListByUser,
  removeBookFromReadingList,
};
