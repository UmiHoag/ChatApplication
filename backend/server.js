const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path');

dotenv.config();
connectDB();
const app = express();

const User = require("../backend/models/userModel");
app.use(express.json()); 

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.post("/api/updatePic", (req,res) => {
  const {pic,user} = req.body
  console.log(pic,user.email)
  const update = async() => {
    const result = await User.updateOne(
            {
                email:user.email,
            },
            {
                $set: {
                    pic:pic,
                }
            }
        )
        console.log(result)
        res.status(200).send("updated Image")
  }
  update()

})

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "set") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("/", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://instant-message-application.onrender.com/chats",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room._id);
    console.log("User Joined Room: " + room._id);
  });
  socket.on("typing", (room) => socket.in(room._id).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room._id).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
