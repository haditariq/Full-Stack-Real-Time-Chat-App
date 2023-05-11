import { config } from 'dotenv';
config(); // env initialize

// imports
import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import connectToDatabase from './utils/databaseConntection';
import Models from './models';
import cors from 'cors';

// connect database
connectToDatabase();

// models
const { UserModel, MessageModel, ChatModel } = Models;

// express
const app = express();
const port = process.env.PORT;


// server http & socket
const server = http.createServer(app);
const io = new Server(server);

// enable cors
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors allowed
app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// fetch / upsert user
app.post("/user", async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    if (!username?.length) return res.status(400).json({ message: 'Username missing.' });
    const userExists = await UserModel.findOne({ username });

    if (!userExists) {
      let newUser = new UserModel({
        username
      });
      newUser = await newUser.save();
      await ChatModel.findOneAndUpdate({}, { $addToSet: { users: newUser._id } });
      res.send({ data: newUser });
    } else {
      res.send({ data: userExists });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get all existing chat
app.get("/chat/:id", async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find({}).sort({ createdAt: 1 }).populate("sentBy");
    res.send({ data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// socket connection
io.on('connection', (socket: Socket) => {

  // listening send_message
  socket.on('send_message', async (message: string) => {
    let messageDoc = new MessageModel(message);
    messageDoc = await messageDoc.save();
    if (messageDoc) {
      const messagePopulated = await MessageModel.findById(messageDoc._id).populate("sentBy");
      io.emit('send_message', messagePopulated); // emit to all self too
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => { });
});

// server listening to port
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
