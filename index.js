const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require('./config/database');
const connectCloudinary = require('./config/cloudinary');
const helmet = require("helmet");
const errorMiddleware = require('./middlewares/error');
const path = require("path");
const http = require('http');


// Configuration
dotenv.config();


// Database connection
connectDB();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net", // Allow Bootstrap CDN
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://img.youtube.com",
        "https://res.cloudinary.com",
        "https://rukminim1.flixcart.com",
      ],
      frameSrc: ["'self'", "https://www.youtube.com"],
    },
  })
);




app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Cloudinary connection
connectCloudinary();


const NODE_ENV = "production";


// Serve frontend
if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./BEdist")));
  
    app.get("*", (req, res) =>
        res.sendFile(
            path.resolve(__dirname, "./" , "BEdist", "index.html")
        )
    );
} else {
    app.get("/", (req, res) => res.send("Please set to production"));
}

app.use("*", (req, res, next) => {
    app.use("*", (req, res, next) => {
    throw new Error("Not found");
});
    
});



// Error middleware
app.use(errorMiddleware);

const server = http.createServer(app);


server.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${process.env.PORT}`);
});
