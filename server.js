const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const writerRoutes = require('./routes/writerRoutes')
const dotenv = require('dotenv')
const app = express();

dotenv.config()
// Middleware
app.use(cors());
app.use(bodyParser.json());

console.log('mongo url ', process.env.MONGO_URL);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Welcome to BlogSite!')
})

app.get('/home', (req, res)=> {
  res.send('Welcome to BlogSite Home page')
})

// Routes
app.use("/api/auth", authRoutes);
// app.use('/api/blogs', blogRoutes);
app.use('/api/writer', writerRoutes);



// app.get('/blogs', async(req, res)=> {
//   try {
//     const blogs = await Blog.find();
//     res.json({
//       success:'true',
//       data: blogs
//     })
//   } catch (error) {
//     res.send({
//       success: 'false',
//       error: error
//     })
//   }
//   res.send('Welcome to BlogSite Home page')
// })



// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
