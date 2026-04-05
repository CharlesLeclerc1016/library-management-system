const express = require("express");
const adminUserController = require("../controllers/adminUserController");
const router = express.Router();

// TODO: 等队友完成了权限校验中间件（requireAuth 和 requireAdmin），你需要把它们加在这里。
// 现在为了方便你本地直接测试，先不加权限保护。
router.post("/admin/librarians", adminUserController.createLibrarian);
router.put("/admin/librarians/:id", adminUserController.updateLibrarian);

module.exports = router;