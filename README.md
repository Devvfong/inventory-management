# Inventory Management System

## Description
The Inventory Management System is a software application designed to help businesses manage their inventory effectively. It allows users to track stock levels, orders, sales, and deliveries.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: JWT for authentication, Docker for containerization

## Features
- User authentication and authorization
- Add, update, and delete inventory items
- View current stock levels and history
- Generate reports on inventory usage
- Search and filter inventory items

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Devvfong/inventory-management.git
   ```
2. Navigate to the project directory:
   ```bash
   cd inventory-management
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd client
   npm install
   ```
4. Create a `.env` file in the root directory and set the necessary environment variables.

5. Run the application:
   - Start the backend server:
     ```bash
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd client
     npm start
     ```

## Deployment Guide
To deploy the Inventory Management System, follow these steps:

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the backend using a service like Heroku, AWS, or DigitalOcean.
3. Ensure that the backend API endpoint is correctly set in the frontend's `.env` file.
