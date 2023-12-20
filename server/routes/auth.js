const express = require("express");
const router = express.Router();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");
/* passport use */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.familyName,
                lastName: profile.name.givenName,
                profileImage: profile.photos[0].value,
            };
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    )
);
/*  */
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login-failure",
    })
);
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.send("Error Logout");
        } else {
            res.redirect("/");
        }
    });
});
router.get("/login-failure", (req, res) => {
    res.send("Something went wrong...");
});
/* serializeUser */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
/* deserializeUser */
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

module.exports = router;
