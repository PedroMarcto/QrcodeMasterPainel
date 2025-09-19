# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a QR Code Treasure Hunt Game built with React and Firebase for a school fair event.

## Key Features
- **Player Interface**: Registration, team selection, QR code scanning, live scoring
- **Admin Panel**: Game control, timer management, live leaderboard
- **Team System**: Two teams (Blue and Red), max 5 players each
- **Scoring System**: Green QR = 1 point, Orange QR = 3 points, Red QR = 5 points
- **Time Limit**: 10-minute games

## Technology Stack
- **Frontend**: React with Vite
- **Backend**: Firebase (Firestore for real-time data)
- **QR Scanner**: qr-scanner library
- **Routing**: react-router-dom
- **Icons**: lucide-react
- **Deployment**: GitHub Pages

## Code Guidelines
- Use functional components with React hooks
- Implement real-time updates with Firebase listeners
- Ensure mobile-responsive design for player interface
- Use proper error handling for QR code scanning
- Implement proper state management for game flow
