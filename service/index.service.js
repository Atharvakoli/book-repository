const { User, Book, ReadingList } = require("../models");

async function addNewUser(user) {
  try {
    const newUser = await User.create(user);

    return newUser;
  } catch (error) {
    throw new Error(`Database query failed ${error}`);
  }
}

async function addNewBook(user) {
  try {
    const newBook = await Book.create(user);
    return newBook;
  } catch (error) {
    throw new Error(`Database query failed ${error}`);
  }
}

async function searchBookByTitleAuthor(title, author) {
  try {
    const book = await Book.findAll({ where: { title, author } });
    return book;
  } catch (error) {
    throw new Error(`Database query failed ${error}`);
  }
}

async function addNewReadingList(details) {
  try {
    const book = await ReadingList.create({
      userId: details.userId,
      bookId: details.bookId,
      status: details.status,
    });
    return book;
  } catch (error) {
    throw new Error(`Database query failed ${error}`);
  }
}
module.exports = {
  addNewUser,
  addNewBook,
  searchBookByTitleAuthor,
  addNewReadingList,
};
