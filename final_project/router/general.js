const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  // Send JSON response with formatted friends data
   try {
        const data = await new Promise((resolve) => {
            resolve(books);
        });

        res.json(data);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try {
        const data = await new Promise((resolve) => {
            resolve(books[isbn]);
        });
        res.json(data);
  } catch (error) {
        res.status(500).send("Internal Server Error");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        for (let id in books) {
            if (books[id].author === author) {
                resolve(books[id]);  // Found the book, resolve with this book
                return;                          }
        }
        reject(new Error("Book not found")); // If no book found, reject the promise
    })
    .then(book => {
        res.send(book);
    })
    .catch(error => {
        res.status(404).json({ message: error.message });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 //Write your code here
    const title = req.params.title;
    new Promise((resolve, reject) => {
        for (let id in books) {
            if (books[id].title === title) {
                resolve(books[id]);  // Found the book, resolve with this book
                return;                          }
        }
        reject(new Error("Book not found")); // If no book found, reject the promise
    })
    .then(book => {
        res.send(book);
    })
    .catch(error => {
        res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

module.exports.general = public_users;
