require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
// const mongoConnect = require("./helper/database").mongoConnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const mongo_DB_URI = process.env.MONGO_DB_URI;
const multer = require('multer');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
// app.set("view engine", "pug");
app.set("view engine", "ejs");
app.set("views", "views");

// const rootDir = require("./helper/path");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Multer storage config
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use((req, res, next) => {
  User.findOne()
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      req.user = null;
      next();
    });
});

app.use('/auth', authRoutes);

// JWT auth middleware for all routes except home and /auth/*
app.use(async (req, res, next) => {
  if (
    req.path === '/' ||
    req.path.startsWith('/auth') ||
    req.path.startsWith('/css') ||
    req.path.startsWith('/js') ||
    req.path.startsWith('/images')
  ) {
    return next();
  }
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.redirect('/auth/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    // Fetch the full user document
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(PageNotFound);

mongoose
  .connect(mongo_DB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Database connected");
      User.findOne().then(async (user) => {
        if (!user) {
          const hashedPassword = await bcrypt.hash('password123', 12);
          const user = new User({
            name: "David",
            email: "david@gmail.com",
            password: hashedPassword,
            role: "admin",
            cart: {
              items: [],
            },
          });
          user.save();
        } else {
          console.log("User Already Exist");
        }
      });
      console.log("App is running on the port http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(PORT, () => {
//     console.log("App is running on the port http://localhost:3000");
//   });
// });
