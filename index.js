const showBookInfo = document.querySelector('#add-book');
const addBookInfo = document.querySelector('.add-book-info');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('.form-container');
const overlay = document.querySelector('.modal-overlay');
const bookList = document.querySelector('.book-card-list');

//loop through the array and append to the DOM
let myBookLibrary = [];

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
  myBookLibrary.push(this);
};

Book.prototype.renderBook = function () {
  const bookElement = document.createElement('div');
  bookElement.classList.add('book-card', 'card', 'rounded', 'shadow-lg');

  const randomIntImage = Math.floor(Math.random() * 100) + 1;
  bookElement.innerHTML = `
  <div class="card-content pb-3">
   <img src="https://picsum.photos/200/300?+book=randomIntImage" alt="book-img" class="card-img" />
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
    bookInfo.read
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
    // formContainer.classList.toggle('scale-out');
  }
});

// ///event
/*
bookList.addEventListener('click', function (e) {
  e.preventDefault();
  const parent = e.target.parentElement;
  if (parent.classList.contains('del-book')) {
    console.log('deleted');
  } else if (parent.classList.contains('checked-book')) {
    console.log('checked');
  }
});

*/

function addBookToStorage(book) {
  const existBook = myBookLibrary.find((b) => {
    b.title === book.title && b.author === book.author;
  });

  if (existBook) {
    alert('book exist');
  } else {
    myBookLibrary.push(book);
    localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
    // newBook.renderBook()
  }
}

function removeBookToStorage(book) {
  if (myBookLibrary.includes(book)) {
    myBookLibrary = myBookLibrary.filter((b) => b !== book);
    localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
  }
}
