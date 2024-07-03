const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vv131835:BzRzJnEm0voFXXua@cluster0.onyltqk.mongodb.net/tour2?retryWrites=true&w=majority&appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});

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

const inquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Update feedbackSchema in your server.js or app.js file
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  feedback: String,
  date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  bookName: String,
  email: String,
  quantity: Number,
  totalPrice: Number,
  purchaseDate: { type: Date, default: Date.now },
  bookPrice: Number, 
  bookImgUrl: String,
  authorName: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


app.post('/purchase/:id', async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { userId, quantity, email, phone } = req.body;

    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });
    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    if ((book.totalCopies - book.purchasedCopies) < quantity) {
      return res.status(400).json({ message: 'Not enough copies available' });
    }

    const totalPrice = quantity * book.price;

    const order = new Order({
      user: userId,
      book: bookId,
      bookName: book.bookName,
      email,
      phone,
      quantity,
      totalPrice,
      bookPrice: book.price,
      bookImgUrl: book.imgUrl,
      authorName: author.authorName
    });

    book.purchasedCopies += quantity;

    await publisher.save();
    await order.save();

    res.status(200).json({ message: 'Book purchased successfully', order });
  } catch (error) {
    console.error('Error purchasing book:', error);
    res.status(500).json({ message: 'Error purchasing book', error });
  }
});


app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});



app.get('/user-orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const orders = await Order.find({ email }).populate('user', 'name email phone');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error });
  }
});



app.post('/feedback', async (req, res) => {
  try {
    const { name, email, phone, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, phone, feedback });
    await newFeedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



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
    const { quantity } = req.body;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => author.books.id(bookId));
    const book = author.books.id(bookId);

    if ((book.totalCopies - book.purchasedCopies) < quantity) {
      return res.status(400).json({ message: 'Not enough copies available' });
    }

    book.purchasedCopies += quantity;

    await publisher.save();

    res.status(200).json({ message: 'Book purchased successfully', book });
  } catch (error) {
    console.error('Error buying book:', error);
    res.status(500).json({ message: 'Error buying book', error: error.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); 

    const publishers = await Publisher.find({
      $or: [
        { 'authors.books.bookName': { $regex: regex } },
        { 'authors.authorName': { $regex: regex } },
        { publisherName: { $regex: regex } }
      ]
    }).lean();

    const formattedData = publishers.map(publisher => ({
      publisherName: publisher.publisherName,
      authors: publisher.authors.map(author => ({
        authorName: author.authorName,
        books: author.books
          .filter(book => regex.test(book.bookName) || regex.test(author.authorName) || regex.test(publisher.publisherName)) // Filter books to include only those that match the query
          .map(book => ({
            _id: book._id,
            bookName: book.bookName,
            publisherDate: new Date(book.publisherDate).toLocaleDateString('en-US'),
            totalCopies: book.totalCopies,
            purchasedCopies: book.purchasedCopies,
            availableCopies: book.totalCopies - book.purchasedCopies,
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

    let author = publisher.authors.find(author => author.books.id(bookId));
    let book = author.books.id(bookId);

    // Update the book details
    Object.assign(book, bookDetails);

    // Update publisher and author names if they have changed
    if (bookDetails.publisherName && publisher.publisherName !== bookDetails.publisherName) {
      publisher.publisherName = bookDetails.publisherName;
    }

    if (bookDetails.authorName && author.authorName !== bookDetails.authorName) {
      author.authorName = bookDetails.authorName;
    }

    await publisher.save();
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

app.delete('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });
    if (!publisher) return res.status(404).json({ message: 'Book not found' });

    let bookRemoved = false;

    publisher.authors.forEach((author) => {
      const bookIndex = author.books.findIndex((book) => book._id.toString() === bookId);
      if (bookIndex !== -1) {
        author.books.splice(bookIndex, 1);
        bookRemoved = true;
      }
    });

    if (bookRemoved) {
      await publisher.save();
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found in any author' });
    }
  } catch (error) {
    console.error(`Error deleting book with ID ${req.params.bookId}:`, error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
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

app.get('/statistics', async (req, res) => {
  try {
    const totalBooks = await Publisher.aggregate([
      { $unwind: '$authors' },
      { $unwind: '$authors.books' },
      {
        $group: {
          _id: '$authors.books.bookName',
          totalCopies: { $sum: '$authors.books.totalCopies' },
          availableCopies: { $sum: { $subtract: ['$authors.books.totalCopies', '$authors.books.purchasedCopies'] } },
        },
      },
    ]);

    const purchasedBooks = await Publisher.aggregate([
      { $unwind: '$authors' },
      { $unwind: '$authors.books' },
      {
        $group: {
          _id: '$authors.books.bookName',
          purchasedCopies: { $sum: '$authors.books.purchasedCopies' },
        },
      },
    ]).project({ bookName: '$_id', purchasedCopies: 1, _id: 0 });

    const userLogins = await User.aggregate([
      { $project: { name: 1, loginCount: { $size: '$logins' } } },
    ]);

    const statistics = {
      totalBooks,
      purchasedBooks,
      userLogins,
    };

    console.log('Statistics:', statistics);

    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

app.post('/inquiries', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).send({ message: 'Inquiry submitted successfully!' });
  } catch (error) {
    res.status(400).send({ error: 'Failed to submit inquiry.' });
  }
});

app.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

// Add new route to handle feedback submission
app.post('/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add new route to retrieve feedback
app.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
