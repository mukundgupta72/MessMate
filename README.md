# MessMate 🍽️

A modern web application for managing college mess/mess hall operations, built with React, Vite, and Firebase.

## Features

- **Student Dashboard**: View daily menu, select meals, submit feedback
- **Admin Dashboard**: Update daily menu items in real-time
- **Authentication**: Secure login with Firebase Auth
- **Real-time Updates**: Menu changes reflect instantly across all users
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router DOM
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   cd mess-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env`
   - Fill in your Firebase configuration credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
mess-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/      # Layout components (DashboardLayout)
│   │   └── ui/          # UI components (buttons, cards, etc.)
│   ├── config/          # Configuration files (Firebase)
│   ├── context/         # React Context providers (AuthContext)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── auth/        # Authentication pages
│   │   └── student/     # Student dashboard pages
│   ├── services/        # API/service layer (Firebase operations)
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles (Tailwind)
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Create a collection named `mess` with a document `daily_menu`
5. Copy your Firebase config to `.env` file

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Make sure to set these in your `.env` file:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## License

MIT
