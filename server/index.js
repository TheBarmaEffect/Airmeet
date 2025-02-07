import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowEIO3: true,
  maxHttpBufferSize: 1e8,
  path: '/socket.io/'
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const rooms = new Map();
const activeConnections = new Map();
const connectionAttempts = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Clear previous connection attempts
  connectionAttempts.delete(socket.id);

  // Send immediate acknowledgment
  socket.emit('connected', { id: socket.id });

  socket.on('join-room', ({ roomId, participantId }) => {
    console.log(`User ${participantId} joining room ${roomId}`);
    
    // Leave previous room if any
    const previousRoom = [...socket.rooms].find(room => room !== socket.id);
    if (previousRoom) {
      socket.leave(previousRoom);
      const prevRoom = rooms.get(previousRoom);
      if (prevRoom) {
        prevRoom.delete(participantId);
        if (prevRoom.size === 0) {
          rooms.delete(previousRoom);
        }
      }
    }
    
    socket.join(roomId);
    activeConnections.set(socket.id, { roomId, participantId });
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    room.add(participantId);

    // Notify others in the room
    socket.to(roomId).emit('participant-joined', {
      participantId,
      participants: Array.from(room)
    });

    // Send existing participants to the new user
    socket.emit('room-participants', {
      participants: Array.from(room)
    });

    // Acknowledge join
    socket.emit('joined-room', {
      roomId,
      participantId,
      success: true
    });
  });

  socket.on('signal', ({ to, from, signal }) => {
    console.log(`Signaling from ${from} to ${to}`);
    if (signal && to) {
      io.to(to).emit('signal', { from, signal });
    }
  });

  socket.on('media-state-change', ({ roomId, participantId, type, enabled }) => {
    if (roomId && participantId) {
      socket.to(roomId).emit('media-state-updated', {
        participantId,
        type,
        enabled
      });
    }
  });

  // Handle reconnection attempts with exponential backoff
  socket.on('reconnect_attempt', (attemptNumber) => {
    const attempts = connectionAttempts.get(socket.id) || 0;
    connectionAttempts.set(socket.id, attempts + 1);
    
    const backoffDelay = Math.min(1000 * Math.pow(2, attempts), 10000);
    
    if (attempts < 5) {
      const connection = activeConnections.get(socket.id);
      if (connection) {
        setTimeout(() => {
          socket.emit('reconnect_data', connection);
        }, backoffDelay);
      }
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
    
    const connection = activeConnections.get(socket.id);
    if (connection) {
      const { roomId, participantId } = connection;
      const room = rooms.get(roomId);
      if (room) {
        room.delete(participantId);
        if (room.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('participant-left', {
            participantId,
            reason
          });
        }
      }
      activeConnections.delete(socket.id);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('server_error', {
      message: 'An error occurred',
      code: error.code
    });
  });
});

// Cleanup inactive rooms periodically
setInterval(() => {
  rooms.forEach((participants, roomId) => {
    if (participants.size === 0) {
      rooms.delete(roomId);
    }
  });
}, 300000); // Every 5 minutes

// Error handling for the server
httpServer.on('error', (error) => {
  console.error('Server error:', error);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Signaling server running on port ${PORT}`);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  httpServer.close(() => {
    console.log('Server terminated gracefully');
    process.exit(0);
  });
});