const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { requireAuth } = require('../middleware/auth');

// 需要登录的接口
router.post('/ratings/books/:bookId', requireAuth, ratingController.createOrUpdateRating);
router.get('/ratings/me', requireAuth, ratingController.getMyRatings);

// 公开接口
router.get('/ratings/books/:bookId', ratingController.getBookRatings);
router.get('/ratings/books/:bookId/stats', ratingController.getBookRatingStats);

module.exports = router;