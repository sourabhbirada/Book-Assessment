# Bookstore API

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (version 12.x or higher)
* You have a MongoDB database (local or cloud-based)

## Installing Bookstore API

To install the Bookstore API, follow these steps:

1. Clone the repository:
   
   git clone https://github.com/sourabhbirada/Book-Assessment.git

   cd bookstore

2. Install the dependencies:
   
```
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGO_URL=your_mongodb_connection_string_here
```

## Running Bookstore API

To run the Bookstore API, follow these steps:

1. Start the server:
```
npm start
```
The server will start on port 3000 (or the port specified in your environment variables).

2. You should see the following messages in your console:
```
Server started at 3000
DB Connected
```
## Running Tests

To run tests, use the following command:

```
npm test
```

## API Endpoints

The following API endpoints are available:

* `GET /api/books`: Get all books with pagination
* `POST /api/books`: Create a new book
* `GET /api/books/:id`: Get a specific book
* `PUT /api/books/:id`: Update a specific book
* `DELETE /api/books/:id`: Delete a specific book
* `GET /api/books/search`: Search books by title and/or author

## Dependencies

This project uses the following dependencies:

* express: Web application framework
* mongoose: MongoDB object modeling tool
* dotenv: Loads environment variables from .env file
* body-parser: Parse incoming request bodies
* nodemon: Automatically restart the server during development

Dev dependencies:

* jest: JavaScript testing framework
* supertest: HTTP assertions library for testing
