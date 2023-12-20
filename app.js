require("dotenv").config();
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const app = express();
const port = 4000 || process.env.PORT;

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
        // cookie: { maxAge: new Date(Date.now() + 3600000) },
        // Date.now() - 30 * 24 * 24 * 60 * 1000
    })
);

app.use(passport.initialize());
app.use(passport.session());
/* express middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(expressEjsLayouts);
/* connect database */
connectDB();
/* set template Engine */
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
/* routes */
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));
/* handle 404 */
app.use("*", (req, res) => {
    res.status(404).render("404");
});

app.listen(port, () => {
    console.log(`Example app listen on port : ${port}`);
});
