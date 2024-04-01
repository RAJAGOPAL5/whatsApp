// Declare socket variable at the beginning
let socket;

// Function to initialize WebSocket connection
function initWebSocket() {
  // Initialize WebSocket connection
  socket = new WebSocket("wss://5571-103-8-116-202.ngrok-free.app");

  // Handle WebSocket connection open
  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  // Handle incoming messages from server
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Display message in chatMessages div
    displayMessage(message);
  };

  // Handle WebSocket connection close
  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
}

// Call the function to initialize WebSocket connection
initWebSocket();

// Function to join a room
function joinRoom() {
  const roomName = document.getElementById("roomInput").value;
  const username = document.getElementById("usernameInput").value;
  // Send join room message to server
  const message = { action: "join", roomId: roomName, clientId: username };
  socket.send(JSON.stringify(message));
}

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageContent = messageInput.value.trim(); // Trim whitespace from the message

  if (!messageContent) {
    // If the message content is empty after trimming, do nothing
    return;
  }

  const username = document.getElementById("usernameInput").value;
  const roomName = document.getElementById("roomInput").value;
  // Send message to server
  const message = {
    action: "message",
    roomId: roomName,
    clientId: username,
    content: messageContent,
  };
  socket.send(JSON.stringify(message));

  // Clear the message input field after sending the message
  messageInput.value = "";
}

// Function to display messages in chatMessages div
function displayMessage(message) {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("div");

  // Check if the message sender is the current user
  const currentUser = document.getElementById("usernameInput").value;

  // Assign different light colors based on the client's username
  const colors = ["#6ab04c", "#4889f0", "#e74c3c", "#f39c12", "#9b59b6"];
  let colorIndex = 0;

  if (message.clientId === currentUser) {
    messageElement.classList.add("senderMessage");
  } else {
    messageElement.classList.add("receiverMessage");
    // Get the color based on the client's username
    colorIndex = Math.abs(message.clientId.hashCode()) % colors.length;
  }

  // Apply the selected color to the message text
  messageElement.style.color = colors[colorIndex];
  messageElement.textContent = `${message.clientId}: ${message.content}`;
  chatMessages.appendChild(messageElement);
}

// Add event listeners to buttons after the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("joinBtn").addEventListener("click", joinRoom);
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
});

// Add hashCode method to the String prototype to generate color indexes
String.prototype.hashCode = function () {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32-bit integer
  }
  return hash;
};
