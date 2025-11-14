#!/bin/bash

# MERN Blogging Website - Stop Script
# This script stops both frontend and backend servers

echo "🛑 Stopping MERN Blogging Website..."
echo ""

# Read PIDs from file
if [ -f /tmp/mern-blog-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/mern-blog-backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend not running"
    fi
    rm /tmp/mern-blog-backend.pid
else
    echo "⚠️  Backend PID file not found"
fi

if [ -f /tmp/mern-blog-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/mern-blog-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend not running"
    fi
    rm /tmp/mern-blog-frontend.pid
else
    echo "⚠️  Frontend PID file not found"
fi

# Also kill any remaining processes on these ports
echo ""
echo "🧹 Cleaning up ports..."

if lsof -i :3000 &> /dev/null; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo "✅ Port 3000 cleared"
fi

if lsof -i :5173 &> /dev/null; then
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    echo "✅ Port 5173 cleared"
fi

# Clean up log files
rm -f /tmp/backend.log /tmp/frontend.log

echo ""
echo "✅ All servers stopped!"
