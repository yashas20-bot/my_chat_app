# 💬 Stream AI Chat — Real-Time Chat with Gemini AI & Voice Input

An intelligent, real-time chat application built with **React**, **Stream Chat SDK**, **Node.js (Express)**, and **Google Gemini AI**. Features instant messaging, speech-to-text voice input, live AI bot participation, and a vibrant glassmorphic UI.

---

## ✨ Features

- **⚡ Real-Time Messaging**: Built on GetStream Chat infrastructure for low-latency messaging, channels, and member management.
- **🤖 Built-in AI Assistant (`ai-bot`)**: Seamlessly summon or remove an AI bot directly in the channel powered by **Google Gemini (`gemini-3.6-flash`)**.
- **🎙️ Speech-to-Text Voice Input**: Integrated Web Speech API allows users to dictate messages hands-free with dynamic pulsing mic animations.
- **✨ Real-Time Status Indicators**: Live custom channel events notify users when the AI assistant is `"thinking"` or `"responding"`.
- **🎨 Vibrant Glassmorphic UI**: Ambient gradient backgrounds, glowing message bubbles, modern typography (*Plus Jakarta Sans*), and responsive layouts.
- **🏗️ Clean Modular Architecture**: Express backend organized into MVC layers (**Controllers**, **Routes**, and **Config**).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Chat UI**: [Stream Chat React](https://getstream.io/chat/docs/sdk/react/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS with custom design tokens and glassmorphism

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Chat Server SDK**: [Stream Chat Node SDK](https://getstream.io/chat/docs/node/)
- **AI / LLM**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`gemini-3.6-flash`)

---

## 📁 Project Structure

```
my_chat_app/
├── backend/                    # Node.js Express Server
│   ├── src/
│   │   ├── config/             # Stream & Gemini SDK initializations
│   │   │   ├── gemini.js
│   │   │   └── stream.js
│   │   ├── controllers/        # Business logic
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   └── healthController.js
│   │   └── routes/             # API endpoint definitions
│   │       ├── aiRoutes.js
│   │       ├── authRoutes.js
│   │       ├── healthRoutes.js
│   │       └── index.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entrypoint
│
├── frontend/                   # React + Vite Client
│   ├── src/
│   │   ├── components/         # Custom Channel Header & AI Indicator
│   │   │   ├── AIStateIndicator.tsx
│   │   │   └── CustomChannelHeader.tsx
│   │   ├── hooks/              # Stream Chat Client Connection Hook
│   │   │   └── useCreateChatClient.ts
│   │   ├── App.css             # Vibrant bubble & chat overrides
│   │   ├── App.tsx             # Main chat application layout
│   │   ├── CustomMessageInput.tsx # Message textarea + Voice Input mic
│   │   └── index.css           # Global typography & layout reset
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm
- [Stream Chat Account](https://getstream.io/) (Free tier)
- [Google AI Studio Account](https://aistudio.google.com/) for Gemini API Key

---

### 1. Clone the Repository
```bash
git clone https://github.com/yashas20-bot/my_chat_app.git
cd my_chat_app
```

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` and add your API credentials:
   ```env
   PORT=5000
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Server will run at `http://localhost:5000`.*

---

### 3. Frontend Setup
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. (Optional) If running against a custom backend port/URL, create `frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser!

---

## 🌐 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Diagnostics & service connectivity status |
| `GET` | `/token?user_id=...` | Generates a signed Stream user token |
| `POST` | `/start-ai-agent` | Adds the `ai-bot` member to the channel |
| `POST` | `/stop-ai-agent` | Removes the `ai-bot` member from the channel |
| `POST` | `/ai-reply` | Emits `ai_status` event, calls Gemini API, and posts AI reply |

---

## 🚢 Deployment

### Backend (Render / Railway)
1. Link your GitHub repository to [Render.com](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
4. Add environment variables: `STREAM_API_KEY`, `STREAM_API_SECRET`, and `GEMINI_API_KEY`.

### Frontend (Vercel / Netlify)
1. Link your GitHub repository to [Vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set environment variable: `VITE_BACKEND_URL` pointing to your deployed backend URL.

---

## 📄 License
MIT License
