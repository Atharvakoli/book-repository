function isValidateUserDetails(user) {
  let errors = [];
  if (!user.username || typeof user.username !== "string") {
    errors.push("username is required and should be string");
  }
  if (!user.email || typeof user.email !== "string") {
    errors.push("email is required and should be string");
  }
  return errors;
}

function isValidBookDetails(book) {
  let errors = [];
  if (!book.title || typeof book.title !== "string") {
    errors.push("title is required and should be string");
  }
  if (!book.author || typeof book.author !== "string") {
    errors.push("author is required and should be string");
  }
  if (!book.genre || typeof book.genre !== "string") {
    errors.push("genre is required and should be string");
  }
  if (!book.publicationYear || typeof book.publicationYear !== "number") {
    errors.push("publicationYear is required and should be number");
  }
  return errors;
}

function isValidSearchDetails(title, author) {
  let errors = [];

  if (!title || typeof title !== "string") {
    errors.push("title is required and should be string");
  }
  if (!author || typeof author !== "string") {
    errors.push("Author is required and should be string");
  }
  return errors;
}

function isValidReadingListDetails(details) {
  let errors = [];
  if (!details.userId || typeof details.userId !== "number") {
    errors.push("userId is required and should be number");
  }
  if (!details.bookId || typeof details.bookId !== "number") {
    errors.push("BookId is required and should be number");
  }
  if (!details.status || typeof details.status !== "string") {
    errors.push("status is required and should be string");
  }
  return errors;
}

function validateDetailsOfUpdate(book) {
  let errors = [];
  if (!book.title || typeof book.title !== "string") {
    errors.push("title is required and should be string");
  }
  if (!book.genre || typeof book.genre !== "string") {
    errors.push("genre is required and should be string");
  }
  return errors;
}
module.exports = {
  isValidateUserDetails,
  isValidBookDetails,
  isValidSearchDetails,
  isValidReadingListDetails,
  validateDetailsOfUpdate,
};
