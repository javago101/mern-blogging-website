#!/bin/bash

# MERN Blogging Website - Start Script
# This script starts both frontend and backend servers

echo "🚀 Starting MERN Blogging Website..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node --version)
echo "📦 Using Node.js $NODE_VERSION"
echo ""

# Function to check if port is in use
check_port() {
    lsof -i :$1 &> /dev/null
    return $?
}

# Kill existing processes on ports 3000 and 5173
if check_port 3000; then
    echo "⚠️  Port 3000 is in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
fi

if check_port 5173; then
    echo "⚠️  Port 5173 is in use. Killing existing process..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
fi

echo ""
echo "🔧 Starting Backend Server (http://localhost:3000)..."

# Start backend in background
cd "$(dirname "$0")/server" && node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend running (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start. Check /tmp/backend.log"
    exit 1
fi

echo ""
echo "🎨 Starting Frontend Server (http://localhost:5173)..."

# Start frontend in background
cd "$(dirname "$0")/blogging website - frontend" && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend running (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend failed to start. Check /tmp/frontend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 MERN Blogging Website is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend:  http://localhost:5173"
echo "🔧 Backend:   http://localhost:3000"
echo ""
echo "📋 Process IDs:"
echo "   Backend:   $BACKEND_PID"
echo "   Frontend:  $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:   tail -f /tmp/backend.log"
echo "   Frontend:  tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop all servers, run: ./stop.sh"
echo "   Or press Ctrl+C and run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Save PIDs to file for stop script
echo "$BACKEND_PID" > /tmp/mern-blog-backend.pid
echo "$FRONTEND_PID" > /tmp/mern-blog-frontend.pid

# Keep script running and show logs
echo "📊 Showing live logs (Ctrl+C to exit, servers will keep running):"
echo ""
tail -f /tmp/backend.log /tmp/frontend.log
