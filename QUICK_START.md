# 🚀 Quick Start Guide

## Permanent Fix Applied ✅

Your Node.js environment is now configured to use v24.11.0 by default in all new terminals!

---

## 📋 Super Simple Commands (Recommended!) ⭐

### **From Anywhere (Global Aliases):**

```bash
# Start the app
blog-start

# Stop the app
blog-stop

# Go to project directory
blog
```

### **From Project Directory (npm):**

```bash
# Start the app
npm start

# Stop the app
npm stop
```

---

## 📋 Other Ways to Start

### **Option 1: Shell Script**

```bash
./start.sh   # Start
./stop.sh    # Stop
```

---

### **Option 2: Manual Start** (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd server
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd "blogging website - frontend"
npm run dev
```

**To stop:** Press `Ctrl+C` in each terminal

---

## 🎯 Examples

### Starting Your App:

```bash
# Method 1 (Easiest - from anywhere!)
blog-start

# Method 2 (In project folder)
npm start

# Method 3 (Classic)
./start.sh
```

### Stopping Your App:

```bash
# Method 1 (Easiest - from anywhere!)
blog-stop

# Method 2 (In project folder)
npm stop

# Method 3 (Classic)
./stop.sh
```

---

## 🔧 What Was Fixed

### 1. **Set Node 24 as Default**
```bash
nvm alias default 24
```

### 2. **Auto-load in New Terminals**
Added to `~/.zshrc`:
```bash
nvm use default --silent
```

### 3. **Created Helper Scripts**
- `start.sh` - Start both servers
- `stop.sh` - Stop both servers

### 4. **Added npm Scripts**
- `npm start` - Quick start
- `npm stop` - Quick stop

### 5. **Added Shell Aliases**
- `blog-start` - Start from anywhere
- `blog-stop` - Stop from anywhere
- `blog` - Jump to project directory

---

## 🆘 Troubleshooting

### Issue: "Bad CPU type in executable"

**Solution:**
```bash
nvm use 24
```

Then try starting again.

---

### Issue: Port already in use

**Solution:**
```bash
blog-stop    # or npm stop
blog-start   # or npm start
```

Or manually:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

### Issue: Node version wrong in new terminal

**Solution:**
```bash
source ~/.zshrc
node --version  # Should show v24.11.0
```

---

## 📊 Check Status

**View logs:**
```bash
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

**Check what's running:**
```bash
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
```

**Check Node version:**
```bash
node --version  # Should be v24.11.0
```

---

## 🎯 Next Steps

Your app is now ready! You can:

1. ✅ Start app with `blog-start`
2. ✅ Open http://localhost:5173
3. ✅ Start building features!

No more "Bad CPU type" errors! 🎉
