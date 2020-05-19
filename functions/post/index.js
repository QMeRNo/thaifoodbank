const express = require("express")
const checkAuth = require("../checkAuth")
const checkRecaptcha = require("../checkRecaptcha")
const router = express.Router()
const createPost = require("./createPost")
const deletePost = require("./deletePost")
const latestPost = require("./latestPost")
const getPost = require("./getPost")
const contactPost = require("./contactPost")
const closePost = require("./closePost")
router.get("/latest", checkAuth, latestPost)
router.post("/create", checkAuth, createPost)
router.get("/:id/contact", checkRecaptcha, contactPost)
router.delete("/:id/delete", checkAuth, deletePost)
router.delete("/:id/close", checkAuth, closePost)
router.get("/:id", getPost)
const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app