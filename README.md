# 📸 TimeLens

**TimeLens** is a dynamic photo-sharing web application that allows users to upload photos, create albums, and interact with shared content through likes, comments, and real-time updates. Built with the MERN stack, the platform is designed for seamless user experience and efficient state management.

## 🚀 Live Demo
[👉 View Live Project](https://timelens-webapp.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Redux Toolkit, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** Google Authentication (OAuth)
- **Tools:** Postman, Vercel, Git, GitHub

---

## ✨ Features

**User Authentication
Secure login with Google OAuth.

**Photo Upload & Albums
Upload single or multiple photos and organize them into albums.

**Album Sharing
Users can share their albums with other users for easy collaboration or viewing.

**Social Interactions
Like and comment on photos; interact with other users' albums.

**Search & Discovery
Search functionality to explore photos and albums by keywords.

**Real-time Feedback
Likes and comments update instantly using Redux Toolkit.

**Responsive UI
Mobile-friendly design using Bootstrap for seamless cross-device experience.

---

## 📷 Screenshots

![Screenshot 2025-04-20 142316](https://github.com/user-attachments/assets/f7e15472-0be8-4d97-b0fa-da2e32fc2622)
![Screenshot 2025-04-20 142333](https://github.com/user-attachments/assets/c504624b-a6f6-4bd1-9816-8959e25e9282)
![Screenshot 2025-04-20 142411](https://github.com/user-attachments/assets/17e0e7a9-cb1d-421e-bc28-2ffe6ea336cd)

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohammad-Irshad/TimeLens.git
cd TimeLens

# Install dependencies for frontend and backend
cd client
npm install
cd ../server
npm install
```
Environment Variables

MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_TOKEN_KEY=your_jwt_secret_key
FRONTEND_URL=your_frontendurl
PORT=4000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=cloudinary_api
CLOUDINARY_API_SECRET=cloudinary_api_secret

Running the App

# Run backend (from server/)
node index.js

# Run frontend (from client/)
npm run dev
