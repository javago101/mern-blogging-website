# 🚀 Quick Start Guide

## Permanent Fix Applied ✅

Your Node.js environment is now configured to use v24.11.0 by default in all new terminals!

---

## 📋 Three Ways to Start Your App

### **Option 1: One-Command Start** (Easiest) ⭐

```bash
./start.sh
```

This automatically:
- ✅ Checks Node version
- ✅ Kills any existing processes
- ✅ Starts backend on http://localhost:3000
- ✅ Starts frontend on http://localhost:5173
- ✅ Shows live logs

**To stop:**
```bash
./stop.sh
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

### **Option 3: npm Scripts**

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd "blogging website - frontend"
npm run dev
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
./stop.sh
./start.sh
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

1. ✅ Start app with `./start.sh`
2. ✅ Open http://localhost:5173
3. ✅ Start building features!

No more "Bad CPU type" errors! 🎉
