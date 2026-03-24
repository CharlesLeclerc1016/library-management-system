// backend/controllers/ratingController.js
const ratingService = require('../services/ratingService');
const { AppError } = require('../lib/errors');
const { successResponse } = require('../lib/response');

class RatingController {
  #对图书评分
  async createOrUpdateRating(req, res, next) {
    try {
      const { bookId } = req.params;
      const { stars } = req.body;
      const userId = req.currentUser.id;

      // 参数验证
      if (!stars || stars < 1 || stars > 5) {
        throw new AppError(400, '评分必须在1-5之间');
      }

      // 检查图书是否存在
      const book = await ratingService.checkBookExists(bookId);
      if (!book) {
        throw new AppError(404, '图书不存在');
      }

      // 检查用户是否曾借阅过这本书
      const hasBorrowed = await ratingService.hasUserBorrowedBook(userId, bookId);
      if (!hasBorrowed) {
        throw new AppError(400, '只有借阅过该图书的读者才能评分');
      }

      // 创建或更新评分
      const { rating, isUpdate } = await ratingService.upsertRating(userId, bookId, stars);

      res.json(successResponse({
        id: rating.id,
        bookId: rating.bookId,
        stars: rating.stars,
        createdAt: rating.createdAt
      }, isUpdate ? '评分已更新' : '评分成功'));

    } catch (error) {
      next(error);
    }
  }

  #获取某本书的所有评分
  async getBookRatings(req, res, next) {
    try {
      const { bookId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      // 检查图书是否存在
      const book = await ratingService.checkBookExists(bookId);
      if (!book) {
        throw new AppError(404, '图书不存在');
      }

      // 获取评分列表
      const ratings = await ratingService.getBookRatings(bookId, page, size);
      
      // 获取评分统计
      const stats = await ratingService.getBookRatingStats(bookId);

      res.json(successResponse({
        ...stats,
        ...ratings
      }));

    } catch (error) {
      next(error);
    }
  }

  #获取当前用户的评分记录
  async getMyRatings(req, res, next) {
    try {
      const userId = req.currentUser.id;
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      const ratings = await ratingService.getUserRatings(userId, page, size);

      res.json(successResponse(ratings));

    } catch (error) {
      next(error);
    }
  }

  #仅获取某本书的评分统计
  async getBookRatingStats(req, res, next) {
    try {
      const { bookId } = req.params;

      // 检查图书是否存在
      const book = await ratingService.checkBookExists(bookId);
      if (!book) {
        throw new AppError(404, '图书不存在');
      }

      const stats = await ratingService.getBookRatingStats(bookId);

      res.json(successResponse(stats));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();