const showBookInfo = document.querySelector('#add-book');
const addBookInfo = document.querySelector('.add-book-info');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('#book-info');
const overlay = document.querySelector('.modal-overlay');
const bookList = document.querySelector('.book-card-list');

let myBookLibrary = [];
let isReadMessage;

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function getBookInfos() {
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

Book.prototype.deleteBook = function (title, author) {
  let existBooks = localStorage.getItem('myBookLibrary');
  let bookArray = existBooks ? JSON.parse(existBooks) : [];

  let bookIndex = bookArray.findIndex(
    (book) => book.title === title && book.author === author
  );
  if (bookIndex !== -1) {
    bookArray.splice(bookIndex, 1);
    localStorage.setItem('myBookLibrary', JSON.stringify(bookArray));
    console.log('Book removed from local storage');
    bookList.innerHTML = '';

    myBookLibrary = bookArray.map(
      (book) => new Book(book.title, book.author, book.pages, book.isRead)
    );
    myBookLibrary.forEach((book) => book.RenderBook());
  } else {
    console.log('Book not found in local storage');
  }
};

Book.prototype.renderBook = function () {
  const bookElement = document.createElement('div');

  const randCover = Math.floor(Math.random() * 1000) + 1;
  const randLink = 'https://picsum.photos/300/300';
  const url = `http://covers.openlibrary.org/b/id/${randCover}-M.jpg?source=${randLink}`;

  bookElement.classList.add(
    'book-card',
    'card',
    'rounded',
    'shadow-lg',
    'scale-up'
  );

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content', 'pb-3');
  bookElement.appendChild(cardContent);

  const readNotice = document.createElement('div');
  readNotice.classList.add('read-notice');
  cardContent.appendChild(readNotice);

  const bookImg = document.createElement('img');
  bookImg.src = url;
  bookImg.alt = 'book-cover';
  bookImg.classList.add('card-img');
  cardContent.appendChild(bookImg);

  const bookCardText = document.createElement('div');
  bookCardText.classList.add('book-card-text', 'text-center', 'my-3');
  cardContent.appendChild(bookCardText);

  const title = document.createElement('div');
  title.classList.add('title', 'text-white', 'bg-indigo-500', 'my-3', 'py-2');
  title.innerHTML = `<b>Title: </b>${this.title}`;
  bookCardText.appendChild(title);

  const author = document.createElement('p');
  author.classList.add(
    'author',
    'bg-indigo-500',
    'text-white',
    'py-2',
    'font-light'
  );
  author.innerHTML = `<b>Author:</b> ${this.author}`;
  bookCardText.appendChild(author);

  const page = document.createElement('p');
  page.classList.add(
    'page',
    'bg-indigo-500',
    'text-white',
    'py-2',
    'font-light',
    'my-2'
  );
  page.innerHTML = `<b>Pages:</b> ${this.pages}`;
  bookCardText.appendChild(page);

  const cardBtns = document.createElement('div');
  cardBtns.classList.add(
    'card-btns',
    'flex',
    'justify-between',
    'px-2',
    'mt-3'
  );
  cardContent.appendChild(cardBtns);

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.classList.add(
    'del-book',
    'bg-indigo-500',
    'text-white',
    'rounded',
    'px-2'
  );
  delBtn.id = 'delete-book';
  cardBtns.appendChild(delBtn);

  const delImg = document.createElement('img');
  delImg.classList.add('btn-icon', 'btn-delete');
  delImg.src = 'images/trash_can.png';
  delBtn.appendChild(delImg);

  const checkedBtn = document.createElement('button');
  checkedBtn.classList.add(
    'checked-book',
    'bg-indigo-500',
    'text-white',
    'rounded',
    'px-5'
  );
  cardBtns.appendChild(checkedBtn);

  const checkedImg = document.createElement('img');
  checkedImg.classList.add('btn-icon');
  checkedBtn.appendChild(checkedImg);

  if (this.isRead) {
    checkedImg.src = 'images/check.png';
    checkedImg.alt = '';
    readNotice.textContent = 'Read';
  } else {
    checkedImg.src = 'images/cancel.png';
    checkedImg.alt = '';
    readNotice.textContent = 'Not Read';
  }

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
  localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
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
    if (confirm('Delete this book?😞') === true) {
      bookCard.remove();
      myBookLibrary.splice(bookIndex, 1);
      // update local storage with new myBookLibrary array
      localStorage.setItem('myBookLibrary', JSON.stringify(myBookLibrary));
    }
    bookCard.classList.add('animate__animated', 'animate__zoomOut');
  } else if (e.target.closest('.checked-book')) {
    const bookCard = e.target.closest('.book-card');
    const checkedBtn = e.target.closest('.checked-book');
    const checkImg = checkedBtn.querySelector('.btn-icon');
    const bookIndex = Array.from(bookList.children).indexOf(bookCard);
    myBookLibrary[bookIndex].isRead = !myBookLibrary[bookIndex].isRead;

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

if (typeof localStorage !== 'undefined') {
  window.addEventListener('load', () => {
    let storedBooks = JSON.parse(localStorage.getItem('myBookLibrary'));
    if (storedBooks) {
      myBookLibrary = storedBooks;
      // Render the books to the DOM
      myBookLibrary.forEach((book) => {
        const newBook = new Book(
          book.title,
          book.author,
          book.pages,
          book.isRead
        );
        newBook.renderBook();
      });
    }
  });
}

function changeIsRead(message) {}
