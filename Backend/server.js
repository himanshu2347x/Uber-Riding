const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/db");
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require("./routes/ride.routes");
const { initializeSocket } = require("./socket");
const http = require('http');
const path = require('path')


const app = express();

const PORT = process.env.PORT || 4000; 




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://ridenow-od3s.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
connectDB();


const server = http.createServer(app);
initializeSocket(server);

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);

app.use(express.static(path.join(__dirname, "../Frontend", "dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend", "dist", "index.html"));
});



server.listen(PORT, () => {
  console.log(`server connected`);
});
