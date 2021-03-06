const express = require("express")
const checkAuth = require("../helpers/checkAuth")
const router = express.Router()
const donate = require("./donate")
const cancel = require("./cancel")
router.put("/:id", checkAuth, donate)
router.delete("/:id", checkAuth, cancel)
const app = express()
const cors = require("cors")
app.use(cors({origin: true}))
app.use(router)
module.exports = app