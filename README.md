# Animation Drawing Web App Backend

This is the backend service for a simple animation drawing web application. It uses Express.js, Firebase, and MongoDB to provide a robust backend infrastructure.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (local or Atlas)
- Firebase account and project setup

## Installation

1. Clone the repository:
```bash
git clone https://github.com/stmighty/cloud_final_project.git
cd cloud_final_project_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.env` file in the `/config` directory with the following variables:
```env
PORT=5050
NODE_ENV=development
HOST=http://localhost

MONGO_URI=mongodb+srv://your_mongodb_connection_string
SECRET_TOKEN=your_secret_token

FIREBASE_ADMIN_CREDENTIALS='{
  "type": "service_account",
  "project_id": "your_project_id",
  "private_key_id": "your_private_key_id",
  "private_key": "your_private_key",
  "client_email": "your_client_email",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your_client_x509_cert_url",
  "universe_domain": "googleapis.com"
}'

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic reloading during development.

### Production Mode
```bash
npm start
```

## API Documentation

The backend provides the following main endpoints:

- `/api/auth` - Authentication endpoints
- `/api/animations` - Animation management endpoints
- `/api/users` - User management endpoints

## Environment Variables

- `PORT`: The port number the server will run on (default: 5050)
- `NODE_ENV`: Environment mode (development/production)
- `HOST`: Server host URL
- `MONGO_URI`: MongoDB connection string
- `SECRET_TOKEN`: Secret token for authentication
- `FIREBASE_ADMIN_CREDENTIALS`: Firebase admin credentials in JSON format
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket URL

## Security Features

The backend includes several security measures:
- Rate limiting
- CORS protection
- XSS protection
- MongoDB sanitization
- Helmet for HTTP headers
- HPP (HTTP Parameter Pollution) protection

## Dependencies

Key dependencies include:
- Express.js for the web server
- Firebase Admin SDK for Firebase integration
- Mongoose for MongoDB interaction
- JWT for authentication
- Various security middleware packages

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License.
