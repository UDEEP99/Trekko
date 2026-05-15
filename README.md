# Trekko

Trekko is a modern, AI-powered travel application designed to provide users with curated, personalized trip itineraries. The application features a decoupled architecture with a Next.js frontend and an Express.js backend, utilizing advanced AI integrations for trip planning and a highly responsive, animated user interface.

## 🚀 Features

- **AI-Powered Trip Planning**: Leverages Groq and OpenAI SDKs to generate curated, personalized activity data and itineraries.
- **Modern User Interface**: Features a polished aesthetic with dark mode support, glassmorphism effects, smooth motion-based animations (Framer Motion & GSAP), and professional iconography (Lucide React).
- **Decoupled Architecture**: Clean separation of concerns with a Next.js client frontend and a Node.js/Express backend API.
- **Robust Authentication**: Secure user authentication and session management (NextAuth / Firebase Auth) with per-user data isolation.
- **Persistent Data Storage**: Uses IBM Cloudant (NoSQL) as the cloud database backend for cross-device storage of user profiles and saved itineraries, with `localStorage` serving as an offline fallback.

## 🛠️ Technology Stack

### Frontend (Root Directory)
- **Framework**: Next.js (v14), React (v18)
- **Styling**: TailwindCSS, PostCSS
- **Animations**: Framer Motion, GSAP
- **State/Auth**: NextAuth, next-themes
- **Database ORM**: Prisma
- **AI Integrations**: AI SDK, Groq SDK, OpenAI
- **Icons**: Lucide React

### Backend (`/backend` Directory)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: IBM Cloudant
- **AI Integration**: Groq SDK
- **Utilities**: CORS, Dotenv

## 📂 Project Structure

```
Trekko/
├── backend/                # Node.js/Express API server
│   ├── server.js           # Main Express server entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
├── src/                    # Next.js frontend source code
├── package.json            # Frontend dependencies
├── tailwind.config.ts      # Tailwind styling configuration
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── .env.local              # Frontend environment variables
```

## ⚙️ Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your system. You will also need active credentials for IBM Cloudant, Firebase/NextAuth, and API keys for Groq/OpenAI.

### 1. Backend Setup

Navigate to the backend directory, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```

*Note: Ensure you have configured the `.env` file in the `backend/` directory with your IBM Cloudant credentials and Groq API keys.*

### 2. Frontend Setup

In a new terminal window, navigate to the project root, install dependencies, and start the Next.js development server:

```bash
npm install
npm run dev
```

*Note: Ensure you have configured the `.env.local` file in the root directory with your NextAuth, database, and AI SDK credentials.*

The frontend will be available at `http://localhost:3000` and it will communicate with the local Express backend.

## 📝 License

This project is private and proprietary.
