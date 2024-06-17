const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vv131835:BzRzJnEm0voFXXua@cluster0.onyltqk.mongodb.net/tour2?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  username: String,
  password: String,
  userType: { type: String, enum: ['admin', 'user'], default: 'user' },
  logins: [
    {
      loginTime: Date,
      logoutTime: Date,
    }
  ],
});

const User = mongoose.model('User', UserSchema);

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  imgUrl: { type: String, required: true },
  description: { type: String, required: true },
  publisherDate: { type: Date, required: true },
  totalCopies: { type: Number, required: true },
  purchasedCopies: { type: Number, default: 0 },
  price: { type: Number, required: true }
});

const authorSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  books: [bookSchema]
});

const publisherSchema = new mongoose.Schema({
  publisherName: { type: String, required: true },
  authors: [authorSchema]
});

const Publisher = mongoose.model('Publisher', publisherSchema);

// Import statements and middleware configurations remain the same

app.post('/books', async (req, res) => {
  try {
    console.log('Received request data:', req.body);
    const { publisherName, authorName, bookDetails } = req.body;

    if (!publisherName || !authorName || !bookDetails) {
      return res.status(400).json({ error: 'Publisher name, author name, and book details are required' });
    }

    let publisher = await Publisher.findOne({ publisherName });

    if (!publisher) {
      publisher = new Publisher({ publisherName, authors: [{ authorName, books: [bookDetails] }] });
    } else {
      let author = publisher.authors.find(author => author.authorName === authorName);
      if (!author) {
        publisher.authors.push({ authorName: authorName, books: [bookDetails] });
      } else {
        author.books.push(bookDetails);
      }
    }

    await publisher.save();
    res.json({ message: 'Book added successfully!', book: bookDetails });
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/books/:id/buy', async (req, res) => {
  try {
    const bookId = req.params.id;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    if (book.totalCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    book.totalCopies -= 1;
    book.purchasedCopies += 1;

    await publisher.save();

    res.status(200).json({ message: 'Book purchased successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing book', error });
  }
});

app.get('/books', async (req, res) => {
  try {
    const publishers = await Publisher.find().lean(); 
    const formattedData = publishers.map(publisher => ({
      publisherName: publisher.publisherName,
      authors: publisher.authors.map(author => ({
        authorName: author.authorName,
        books: author.books.map(book => ({
          _id: book._id,
          bookName: book.bookName,
          publisherDate: new Date(book.publisherDate).toLocaleDateString('en-US'), 
          copies: book.totalCopies,
          availableCopies: book.totalCopies - book.purchasedCopies, 
          price: book.price,
          description: book.description,
          imageurl: book.imgUrl,
        }))
      }))
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const { bookDetails } = req.body;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    Object.assign(book, bookDetails);

    await publisher.save();
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    author.books.id(bookId).remove();

    await publisher.save();
    res.status(200).json({ message: 'Book deleted successfully', bookId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});



app.post('/purchase/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    if (book.totalCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    book.totalCopies -= 1;
    book.purchasedCopies += 1;

    await publisher.save();

    res.status(200).json({ message: 'Book purchased successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing book', error });
  }
});

app.get('/books', async (req, res) => {
  try {
    const publishers = await Publisher.find().lean();
    const formattedData = publishers.map(publisher => ({
      publisherName: publisher.publisherName,
      authors: publisher.authors.map(author => ({
        authorName: author.authorName,
        books: author.books.map(book => ({
          _id: book._id,
          bookName: book.bookName,
          publisherDate: book.publisherDate,
          totalCopies: book.totalCopies,
          purchasedCopies: book.purchasedCopies,
          price: book.price,
          description: book.description,
          imgUrl: book.imgUrl,
        }))
      }))
    }));
    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});






app.put('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const { bookDetails } = req.body;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    Object.assign(book, bookDetails);

    await publisher.save();
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    author.books.id(bookId).remove();

    await publisher.save();
    res.status(200).json({ message: 'Book deleted successfully', bookId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});


app.post('/register', async (req, res) => {
  const { name, phone, email, username, password } = req.body;
  let userType = 'user';
  if (email.endsWith('@numetry.com')) {
    userType = 'admin';
  }
  const user = new User({ name, phone, email, username, password, userType });
  await user.save();
  res.send({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const loginTime = new Date();
      user.logins.push({ loginTime });
      await user.save();
      const loginIndex = user.logins.length - 1;
      if (user.userType === 'admin') {
        res.send({ message: 'Welcome to the admin dashboard', loginIndex });
      } else {
        res.send({ message: 'Welcome to the user dashboard', loginIndex });
      }
    } else {
      res.send({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});


app.post('/logout', async (req, res) => {
  const { email, loginIndex } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const logoutTime = new Date();
    user.logins[loginIndex].logoutTime = logoutTime;
    await user.save();
    res.send({ message: 'Logout successful' });
  } else {
    res.send({ message: 'User not found' });
  }
});

app.get('/user-logs', async (req, res) => {
  const users = await User.find({ userType: 'user' }, 'name email logins');
  res.send(users);
});

app.put('/update-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;
  try {
    await User.findByIdAndUpdate(userId, updatedUserData);
    res.send({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating user' });
  }
});

app.delete('/remove-user-login/:userId/:loginIndex', async (req, res) => {
  const { userId, loginIndex } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.logins.splice(loginIndex, 1);
      await user.save();
      res.send({ message: 'User login removed successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error removing user login' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
