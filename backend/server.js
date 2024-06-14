const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vv131835:BzRzJnEm0voFXXua@cluster0.onyltqk.mongodb.net/tourism?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

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

const PublisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: PublisherSchema, required: true },
  publishedYear: { type: String, required: true },
  copiesAvailable: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  price: { type: Number, required: true },
  summary: { type: String, required: true },
  purchasedCount: { type: Number, default: 0 }, 
});

const Book = mongoose.model('Book', bookSchema);


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

app.post('/add-book', async (req, res) => {
  const { name, author, publisherName, publishedYear, copiesAvailable, photoUrl, price, summary } = req.body;

  const publisher = { name: publisherName };

  const book = new Book({
    name,
    author,
    publisher,
    publishedYear,
    copiesAvailable,
    photoUrl,
    price, 
    summary, 
  });

  try {
    await book.save();
    res.send({ message: 'Book added successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding book' });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching books' });
  }
});

app.put('/books/:id/buy', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.copiesAvailable > 0) {
      book.copiesAvailable -= 1;
      book.purchasedCount += 1; 
      await book.save();
      res.status(200).json({ message: 'Book bought successfully' });
    } else {
      res.status(400).json({ message: 'No copies available' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBookData = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: 'Book deleted successfully', bookId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
