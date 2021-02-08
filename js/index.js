const bookList = document.querySelector('#list')
const show = document.querySelector('#show-panel')
const booksUrl = 'http://localhost:3000/books'

const fetchBookList = _ => {
  fetch (booksUrl)
  .then( response => response.json() )
  .then( books => {
    for (book of books) {
      let bookItem = document.createElement("li")
      bookItem.dataset.id = book.id
      bookItem.className = "book-item"
      bookItem.textContent = book.title

      bookList.append(bookItem)
    }
  })
}

fetchBookList()

const fetchBook = id => {
  fetch(booksUrl+`/${id}`)
    .then(r => r.json() )
    .then( bookData => showBook(bookData))
}

const showBook = book => {
  Array.from(show.children).forEach( child => child.remove() )
  show.dataset.id = book.id

  let bookImage = document.createElement("img")
  bookImage.src = book.img_url
  bookImage.alt = book.title

  let bookTitle = document.createElement("h2")
  bookTitle.textContent = book.title

  let bookSubtitle = document.createElement("h3")
  bookSubtitle.textContent = book.Subtitle

  let bookAuthor = document.createElement("h3")
  bookAuthor.textContent = book.author

  let bookDescription = document.createElement("p")
  bookDescription.textContent = book.description

  let likeButton = document.createElement("button")
  likeButton.id = "like-button"
  likeButton.textContent = "Like"

  let userList = document.createElement("ul")

  for (user of book.users) {
    let userLike = document.createElement("li")
    userLike.textContent = user.username
    userLike.dataset.id = user.id
    userList.append(userLike)
    if (user.username === "pouros"){
      likeButton.id = "unlike-button"
      likeButton.textContent = "Unlike"
    }
  }


  show.append(bookImage, bookTitle, bookSubtitle, bookAuthor, bookDescription, userList, likeButton)
  
}

const likeBook = id => {

  fetch(booksUrl +`/${id}`)
  .then( r => r.json() )
  .then( bookInfo => updateUserList(bookInfo) )

  const updateUserList = bookInfo => {
    let userList = bookInfo.users
    let currentUserIndex = userList.findIndex( user => user.id == "1")
    if (currentUserIndex >= 0) {
      userList.splice(currentUserIndex,1)
    } else {
      userList.push( {id: 1, username: "pouros"} )
    }
    
    config = {
      "method":"PATCH",
      "headers": {
        "Content-type": "application/json"
      },
      "body": JSON.stringify({users: userList})
    }

    fetch(booksUrl+`/${id}`, config)
    .then( r => r.json() )
    .then( data => showBook(data))
  }

}

const handleClicks = e => {
  switch (true){
    case (e.target.className === "book-item"):
      fetchBook(e.target.dataset.id)
      break
    case (e.target.id === "like-button"):
      likeBook(show.dataset.id)
      break
    case (e.target.id === "unlike-button"):
      likeBook(show.dataset.id)
      break
  }
}

bookList.addEventListener('click', handleClicks)
show.addEventListener('click', handleClicks)