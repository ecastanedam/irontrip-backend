const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"&&
            req.headers.authorization.split(" ")[1]
        ){
            console.log("I'm logged");
            const authToken = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(authToken, process.env.JWT_SECRET);
            req.payload = payload;
            next();
        }else{
            res.status(401).json({ message: "Unauthorized" });
        }
    }catch(error){
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
}
}

module.exports = {isAuthenticated};