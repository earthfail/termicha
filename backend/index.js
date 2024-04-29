const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
//const user_routes = require('./routes/auth_users.js').authenticated;
const general_routes = require('./routes/general.js');

const app = express();

app.use(express.json());

app.use("/user",session({secret:"messi7",resave: true, saveUninitialized: true}))
app.use("/user/auth/*", function auth(req, res, next) {
    if (req.session.authorization && req.session.authorization['accessToken']) {
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, "siuuu", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(403).json({ message: "Invalid token" });
                } else {
                    return res.status(403).json({ message: "User not authenticated" });
                }
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

 
const PORT =8080;

//app.use("/user/auth", user_routes);
app.use("/user", general_routes);

app.listen(PORT,()=>console.log("Server is running on port " + PORT));
