const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the directory for views
app.set("views", path.join(__dirname, "views"));

// Set the directory for static files
app.use(express.static(path.join(__dirname, "public")));

// Map to store active rooms
const rooms = new Map();

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  // Handle messages from clients
  ws.on("message", (data) => {
    const message = Buffer.isBuffer(data) ? data.toString("utf-8") : data;

    console.log("Received message:", message);

    try {
      const parsedMessage = JSON.parse(message);
      const { action, roomId, clientId, content } = parsedMessage;

      switch (action) {
        case "join":
          // Add the client to the specified room
          joinRoom(ws, roomId, clientId);
          break;
        case "message":
          // Broadcast message to clients in the same room
          broadcastMessage(ws, roomId, clientId, content);
          break;
        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
});

function joinRoom(ws, roomId, clientId) {
  // Create the room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  // Add the client to the room
  rooms.get(roomId).add(ws);

  // Notify all clients in the room about the new client
  const roomClients = rooms.get(roomId);
  roomClients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ systemMessage: `${clientId} joined the room` }));
    }
  });

  console.log(`Client ${clientId} joined room ${roomId}`);
}

function broadcastMessage(ws, roomId, clientId, content) {
  if (rooms.has(roomId)) {
    const roomClients = rooms.get(roomId);
    roomClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ roomId, clientId, content }));
      }
    });
  }
}

// Define a route to serve your HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});





















































































































// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Set EJS as the view engine
// app.set("view engine", "ejs");
// // Set the directory for views
// app.set("views", path.join(__dirname, "views"));

// // Set the directory for static files
// app.use(express.static(path.join(__dirname, "public")));

// // Map to store active rooms
// const rooms = new Map();

// // WebSocket connection handling
// wss.on("connection", (ws) => {
//   console.log("WebSocket connected");

//   // Handle messages from clients
//   ws.on("message", (data) => {
//     const message = Buffer.isBuffer(data) ? data.toString("utf-8") : data;

//     console.log("Received message:", message);

//     try {
//       const parsedMessage = JSON.parse(message);
//       const { action, roomId, clientId, content } = parsedMessage;

//       switch (action) {
//         case "join":
//           // Add the client to the specified room
//           joinRoom(ws, roomId, clientId);
//           break;
//         case "message":
//           // Broadcast message to clients in the same room
//           broadcastMessage(ws, roomId, clientId, content);
//           break;
//         default:
//           console.log("Unknown action:", action);
//       }
//     } catch (error) {
//       console.error("Error parsing message:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("WebSocket disconnected");
//   });
// });

// function joinRoom(ws, roomId, clientId) {
//   // Create the room if it doesn't exist
//   if (!rooms.has(roomId)) {
//     rooms.set(roomId, new Set());
//   }

//   // Add the client to the room
//   rooms.get(roomId).add(ws);

//   console.log(`Client ${clientId} joined room ${roomId}`);
// }

// function broadcastMessage(ws, roomId, clientId, content) {
//   if (rooms.has(roomId)) {
//     const roomClients = rooms.get(roomId);
//     roomClients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ clientId, content }));
//         console.log(`${clientId}: ${content}`); // Log the message sent
//       }
//     });
//   }
// }

// // Define a route to serve your HTML file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
