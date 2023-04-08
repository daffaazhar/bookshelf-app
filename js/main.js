const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const books = [];

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) return bookItem;
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) return index;
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function rackStatus() {
  const bookArr = JSON.parse(localStorage.getItem("BOOK_APPS"));
  const readBookCount = bookArr.filter((obj) => obj.isCompleted === true).length;
  const unreadBookCount = bookArr.filter((obj) => obj.isCompleted === false).length;

  const unreadRackStatus = document.getElementById("unreadRackStatus");
  const readRackStatus = document.getElementById("readRackStatus");

  if (unreadBookCount > 0) {
    unreadRackStatus.style.display = "none";
  } else {
    unreadRackStatus.style.display = "block";
  }

  if (readBookCount > 0) {
    readRackStatus.style.display = "none";
  } else {
    readRackStatus.style.display = "block";
  }
}

function makeBook(bookObject) {
  const spanAuthor = document.createElement("span");
  spanAuthor.innerText = bookObject.author;
  spanAuthor.classList.add("author");

  const spanYear = document.createElement("span");
  spanYear.innerText = bookObject.year;
  spanYear.classList.add("publicationYear");

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.classList.add("bookTitle", "semibold");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author: ";
  textAuthor.classList.add("text-sm");
  textAuthor.append(spanAuthor);

  const textYear = document.createElement("p");
  textYear.innerText = "Publication Year: ";
  textYear.classList.add("text-sm");
  textYear.append(spanYear);

  const descWrapper = document.createElement("div");
  descWrapper.classList.add("desc-wrapper");
  descWrapper.append(textTitle, textAuthor, textYear);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("action");
    const iconUndo = document.createElement("i");
    iconUndo.classList.add("bx", "bx-revision", "text-md", "text-white");
    const spanUndo = document.createElement("span");
    spanUndo.innerText = "Re-read Book";
    spanUndo.classList.add("span-button");
    undoButton.append(iconUndo, spanUndo);

    undoButton.addEventListener("click", function () {
      undoBookFromRead(bookObject.id);
    });

    buttonWrapper.append(undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("action");
    const iconCheck = document.createElement("i");
    iconCheck.classList.add("bx", "bxs-check-circle", "text-md", "text-white");
    const spanCheck = document.createElement("span");
    spanCheck.innerText = "Read Book";
    spanCheck.classList.add("span-button");
    checkButton.append(iconCheck, spanCheck);

    checkButton.addEventListener("click", function () {
      addBookToRead(bookObject.id);
    });

    buttonWrapper.append(checkButton);
  }

  const trashButton = document.createElement("button");
  trashButton.classList.add("action");
  const iconTrash = document.createElement("i");
  iconTrash.classList.add("bx", "bxs-trash", "text-md", "text-white");
  const spanTrash = document.createElement("span");
  spanTrash.innerText = "Delete Book";
  spanTrash.classList.add("span-button");
  trashButton.append(iconTrash, spanTrash);

  trashButton.addEventListener("click", function () {
    const deleteConfirm = confirm(`Are you sure to delete a book called "${bookObject.title}"?`);
    if (deleteConfirm === true) {
      removeBook(bookObject.id);
    }
  });

  buttonWrapper.append(trashButton);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descWrapper, buttonWrapper);
  container.setAttribute("id", `book-${bookObject.id}`);

  return container;
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const publicationYear = parseInt(document.getElementById("publicationYear").value);
  const isCompleted = document.getElementById("isCompleted").checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, parseInt(publicationYear), isCompleted);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function showToast() {
  const toast = document.querySelector(".toast");
  const closeIcon = document.querySelector(".close");
  const progress = document.querySelector(".progress");
  toast.classList.add("active");
  progress.classList.add("active");

  setTimeout(function () {
    toast.classList.remove("active");
  }, 5000);
  setTimeout(function () {
    progress.classList.remove("active");
  }, 5300);

  closeIcon.addEventListener("click", function () {
    toast.classList.remove("active");
    setTimeout(function () {
      progress.classList.remove("active");
    }, 300);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addBookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    showToast();
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("publicationYear").value = "";
    document.getElementById("isCompleted").checked = "";
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  document.querySelector("#searchButton").addEventListener("click", function (e) {
    const titleKeyword = document.querySelector("#searchBox").value;
    const bookItems = document.querySelectorAll(".item");

    bookItems.forEach((bookItem) => {
      const bookTitle = bookItem.querySelector(".bookTitle").innerText;
      if (bookTitle.toLowerCase().includes(titleKeyword.toLowerCase())) {
        bookItem.style.display = "flex";
      } else {
        bookItem.style.display = "none";
      }
    });

    e.preventDefault();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("unreadBookList");
  unreadBookList.innerHTML = "";
  const readBookList = document.getElementById("readBookList");
  readBookList.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unreadBookList.append(bookElement);
    } else {
      readBookList.append(bookElement);
    }
  }
  rackStatus();
});

document.addEventListener(SAVED_EVENT, function () {
  rackStatus();
});
