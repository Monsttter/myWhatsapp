import jwt from "jsonwebtoken";
const JWT_SECRET= process.env.JWT_SECRET;

const fetchUser= (req, res, next)=>{
    try {
        // console.log(req.path);
        const token= req.headers["auth-token"];
        const preload= jwt.verify(token, JWT_SECRET);
        req.user= preload.user;
        next();
    } catch (error) {
        console.log(error);
        res.send("Wrong token");
    }
}

export default fetchUser;