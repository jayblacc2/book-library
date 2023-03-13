const showBookInfo = document.querySelector('#add-book');
const addBookInfo = document.querySelector('.add-book-info');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('.form-container');
const overlay = document.querySelector('.modal-overlay');
const bookList = document.querySelector('.book-card-list');

//loop through the array and append to the DOM
const myBookLibrary = [];

let bookLocalStorage = JSON.parse(localStorage.getItem('myBookLibrary')) || [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function getBookInfos(title, author, pages, isRead) {
  const bookTitle = document.querySelector('#title').value;
  const bookAuthor = document.querySelector('#author').value;
  const bookPages = document.querySelector('#pages').value;
  const bookRead = document.querySelector('#isRead').checked;

  return {
    title: bookTitle,
    author: bookAuthor,
    pages: bookPages,
    isRead: bookRead,
  };
}

Book.prototype.addBook = function () {
  addBookToStorage(this);
  myBookLibrary.push(this);
};

Book.prototype.deleteBook = function () {
  removeBookToStorage(this);
  myBookLibrary = myBookLibrary.filter((book) => book !== this);
};

Book.prototype.renderBook = function () {
  const bookElement = document.createElement('div');
  bookElement.classList.add(
    'book-card',
    'card',
    'rounded',
    'shadow-lg',
    'scale-up'
  );

  bookElement.innerHTML = `
  <div class="card-content pb-3">
   <div class="read-notice"></div>
   <img src="https://source.unsplash.com/featured/200x300/?book" alt="book-img" class="card-img" />
  <div class="book-card-text text-center my-3">
    <div class="title text-white bg-indigo-500 my-3 py-2"><b>Title: </b>${
      this.title
    }</div>
    <p class="author bg-indigo-500 text-white py-2 font-light">
     <b>Author:</b> ${this.author}
    </p>
    <p class="page bg-indigo-500 text-white py-2 font-light my-2">
     <b>Pages:</b> ${this.pages}
    </p>
  </div>
  <div class="card-btns flex justify-between px-2 mt-3">
    <button type="button" class="del-book bg-indigo-500 text-white rounded px-2" id="delete-book">
      <img class="btn-icon btn-delete" src="images/trash_can.png" alt="" >
    </button>
    <button class="checked-book bg-indigo-500 text-white rounded px-5">
    ${
      this.isRead
        ? '<img class="btn-icon" src="images/check.png" alt="" />'
        : '<img class="btn-icon" src="images/cancel.png" alt="">'
    }
    </button>
  </div>
</div>
`;
  bookList.append(bookElement);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bookInfo = getBookInfos(
    'book-title',
    'book-author',
    'book-pages',
    'book-read'
  );

  const newBook = new Book(
    bookInfo.title,
    bookInfo.author,
    bookInfo.pages,
    bookInfo.isRead
  );

  newBook.addBook();

  document.querySelector('#title').value = '';
  document.querySelector('#author').value = '';
  document.querySelector('#pages').value = '';
  document.querySelector('#isRead').checked = false;

  overlay.classList.toggle('show');
  newBook.renderBook();
});

//eventlistener
showBookInfo.addEventListener('click', () => {
  addBookInfo.classList.add('show');
  formContainer.classList.add('scale-up');
});

overlay.addEventListener('click', (e) => {
  if (e.target.tagName === 'DIV') {
    overlay.classList.remove('show');
  }
});

// event listener for delete book button & toggle checked
bookList.addEventListener('click', (e) => {
  const bookCard = e.target.closest('.book-card');
  if (e.target.closest('.del-book')) {
    const bookIndex = Array.from(bookList.children).indexOf(bookCard);
    const confirmText = 'a';
    if (confirm('Delete this book?😞') === true) {
      bookCard.remove();
      myBookLibrary[bookIndex].deleteBook();
    }
    bookCard.classList.add('animate__animated', 'animate__zoomOut');
  } else if (e.target.closest('.checked-book')) {
    const bookCard = e.target.closest('.book-card');
    const checkedBtn = e.target.closest('.checked-book');
    const checkImg = checkedBtn.querySelector('.btn-icon');
    // Toggle isRead property
    const bookIndex = Array.from(bookList.children).indexOf(bookCard);
    myBookLibrary[bookIndex].isRead = !myBookLibrary[bookIndex].isRead;

    let isReadMessage;
    // Toggle checked button icon
    const readAlert = bookCard.querySelector('.read-notice');
    if (myBookLibrary[bookIndex].isRead) {
      checkImg.setAttribute('src', 'images/check.png');
      isReadMessage = 'Book read';
      readAlert.textContent = isReadMessage;
    } else {
      checkImg.setAttribute('src', 'images/cancel.png');
      isReadMessage = 'Not read';
      readAlert.textContent = isReadMessage;
    }
  }
});

//
function addBookToStorage(book) {
  if (!myBookLibrary.includes(book)) {
    myBookLibrary.push(book);
    localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
  }
}

function removeBookToStorage(book) {
  if (myBookLibrary.includes(book)) {
    myBookLibrary = myBookLibrary.filter((b) => b !== book);
    localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
  }
}

/*
TODO
1- Duplicate book in the local storage
2- In the DOM isRead must change if button toggle check 
3- onload windows- books in the local storage must be shown 
*/
