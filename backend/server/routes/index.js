const express = require("express");

const authRoutes = require("./authRoutes");
const bookRoutes = require("./bookRoutes");
const holdRoutes = require('./holdRoutes');
const loanRoutes = require("./loanRoutes");
const userRoutes = require("./userRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const ratingRoutes = require("./ratingRoutes");  
const acquisitionRoutes = require("./acquisitionRoutes");  
const dashboardRoutes = require("./dashboardRoutes");      
const router = express.Router();

router.use(authRoutes);
router.use(bookRoutes);
router.use(holdRoutes);
router.use(loanRoutes);
router.use(userRoutes);
router.use(wishlistRoutes);
router.use(ratingRoutes);
router.use(acquisitionRoutes);   
router.use(dashboardRoutes);     
module.exports = router;
