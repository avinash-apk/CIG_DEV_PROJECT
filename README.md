# Event and Media Management Platform

A sophisticated media management system designed for event organizers and attendees, featuring AI-powered photo discovery and secure content delivery.

## Technical Architecture

### Frontend
- **React (Vite, TypeScript)**: Provides a performant and type-safe foundation for the user interface.
- **Tailwind CSS**: Utilized for utility-first responsive styling and consistent design patterns.
- **Lucide Icons**: Implements a clean, vector-based iconography system.
- **Axios**: Manages HTTP requests to the backend API and direct PUT requests to AWS S3.
- **Socket.io-client**: Enables real-time event listening for user notifications.

### Backend
- **Node.js and Express**: Powers the RESTful API and handles core business logic.
- **Drizzle ORM**: Facilitates type-safe database queries and schema management.
- **PostgreSQL**: Serves as the primary relational database for persistent data storage.
- **TypeScript**: Ensures structural integrity and reduces runtime errors across the server.
- **Socket.io**: Manages bi-directional, real-time communication between the server and connected clients.
- **Sharp**: Handles high-performance image processing, specifically for dynamic watermarking on download.

### Cloud and AI Services (AWS)
- **AWS S3**: Provides scalable object storage for event media and user reference selfies.
- **AWS Rekognition**:
    - **Facial Recognition**: Indexes faces from event media and compares them against user selfies for automated identification.
    - **Object Detection**: Automatically analyzes images to generate descriptive labels and tags.

## System Functionality

### 1. Personalized Photo Discovery
Users register a reference selfie which is indexed by AWS Rekognition. The system cross-references this index against all media uploaded to the platform, allowing users to instantly view every photo they appear in without manual searching.

### 2. Hierarchical Media Management
The platform supports a structured hierarchy of Events and Albums. When media is uploaded to an album, the backend triggers asynchronous tasks for AI tagging and facial indexing, making the content searchable and interactive immediately.

### 3. Secure Content Workflow
Content security is maintained through AWS Pre-signed URLs, ensuring that media is never publicly exposed. For high-resolution asset protection, the system employs dynamic watermarking during the download process.

### 4. Real-time Social Features
Interactive elements such as Likes, Comments, and Favorites are integrated with a WebSocket layer. This ensures that users receive instant notifications when others engage with their uploaded content.

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- AWS IAM credentials with S3 and Rekognition access

### Configuration
1. **Repository Setup**: Clone the repository to your local environment.
2. **Backend Setup**:
    - Navigate to the `/backend` directory.
    - Create a `.env` file with the required DATABASE_URL, AWS_REGION, and API keys.
    - Execute `npm install` to load dependencies.
    - Execute `npm run push` to synchronize the Drizzle schema with your database.
3. **Frontend Setup**:
    - Navigate to the `/frontend` directory.
    - Execute `npm install` to load dependencies.
4. **Execution**:
    - Start the backend server using `npm run dev` (Default: Port 5000).
    - Start the frontend development server using `npm run dev` (Default: Port 5173).
