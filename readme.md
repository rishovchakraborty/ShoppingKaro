# Shared Wishlist App

A collaborative platform where multiple users can create, manage, and interact with wishlists in real-time—perfect for group shopping sprees, event planning, or shared gift lists.

---

## Tech Stack Used
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB (via MongoDB Atlas)
- **Authentication:** JWT (simple/dummy auth)
- **Deployment:** Vercel/Netlify (frontend), Render/Railway (backend), MongoDB Atlas (database)

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd shoppingkaro
```

### 2. Setup the Backend
```bash
cd backend
cp .env.example .env # Create your .env file
npm install
```

#### Example `.env` for Backend
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wishlist-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

#### Run the Backend
```bash
npm start
# or
node server.js
```

### 3. Setup the Frontend
```bash
cd ../frontend
cp .env.example .env # (if needed)
npm install
```

#### Example `.env` for Frontend (if using Vite proxy, usually not needed)
```
VITE_API_URL=http://localhost:5000/api
```

#### Run the Frontend
```bash
npm run dev
```

### 4. Open the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Assumptions or Limitations
- **Authentication is simple/dummy:** No email verification or password reset. JWT is used for session management.
- **Invite feature is mocked:** Inviting users to a wishlist only updates the UI and does not send real invitations.
- **No real-time sync:** Changes are not instantly reflected for all users unless the page is refreshed. (No WebSocket/Firebase integration yet.)
- **No file/image uploads:** Product images are referenced by URL only.
- **No payment or checkout:** The app is for wishlist management, not actual purchases.
- **Mobile responsiveness:** The UI is responsive, but some advanced mobile features (like PWA/offline) are not implemented.
- **Deployment:** Example deployment instructions are provided, but you must set up your own hosting and environment variables.

---

## Features
- User authentication (register/login)
- Create, update, delete wishlists
- Add, edit, delete products in wishlists
- Invite users to wishlists (mocked)
- See who added/edited each product
- Comments and emoji reactions on products
- Responsive design for mobile and desktop

## License
MIT

---
Feel free to contribute or open issues for improvements! 