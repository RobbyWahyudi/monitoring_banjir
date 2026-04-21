const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

global.io = null;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  global.io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  global.io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
