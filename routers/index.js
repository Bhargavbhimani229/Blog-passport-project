const { Router } = require("express");

const blogRouter = require("./blogRouter");
const indexRouter = Router();


indexRouter.use("/", blogRouter);

module.exports = indexRouter;