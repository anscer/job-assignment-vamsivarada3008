
# NOTES

## Project Architecture

This project is a robot state management system built with Node.js, Express.js, MongoDB, and TypeScript. It includes user authentication, CRUD operations for managing robot states, and API documentation with Swagger.

### Directory Structure

```
project-root/
├── dist/
├── node_modules/
├── public/
│   ├── login.html
│   └── register.html
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
├── .env
├── .gitignore
├── ASSIGNMENT.md
├── NOTES.MD
├── package-lock.json
├── package.json
└── tsconfig.json
```

## How to Run the Project

### Step 1: Clone the Project
Open your terminal and run:
```bash
git clone https://github.com/anscer/job-assignment-vamsivarada3008.git
```

### Step 2: Install Dependencies
Navigate to the project directory and run:
```bash
npm install
```

### Step 3: Add Environment Variables
Create a `.env` file in the root directory and define the following variables:
```
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-address>/anscer_db"
JWT_SECRET="your_jwt_secret"
```

### Step 4: Start the Server
Run the following command to start the server:
```bash
npm start
```
The server will be up and running on port 5000.

## API Endpoints

### Authentication
- **POST /register**: Register a new user.
  - Request Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "string", "redirectTo": "/api/states" }`

- **POST /login**: Log in a user.
  - Request Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "string", "redirectTo": "/api/states" }`

- **POST /logout**: Log out the current user.
  - Clears the authentication token.

### State Management
- **POST /api/states**: Create a new state.
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ "name": "string", "description": "string", "status": "string", "createdBy": "string" }`
  - Response: `{ "result": "object" }`

- **GET /api/states**: Retrieve all states.
  - Headers: `Authorization: Bearer <token>`
  - Response: `[ "state1", "state2", ... ]`

- **GET /api/states/:id**: Retrieve a state by ID.
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "state": "object" }`

- **PUT /api/states/:id**: Update a state.
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ "name": "string", "description": "string", "status": "string", "createdBy": "string" }`
  - Response: `{ "updatedState": "object" }`

- **DELETE /api/states/:id**: Delete a state.
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "message": "State removed" }`

- **GET /api/states/aggregate/output**: Aggregate state data.
  - Headers: `Authorization: Bearer <token>`
  - Response: `[ "aggregationResults" ]`

## API Documentation
API documentation can be found at: `http://localhost:5000/api-docs`

## How to Test Each API Call

### Authentication and State Management

1. **Register**: 
   - Go to `/register` endpoint and register yourself.
   - Successful registration returns a JSON response:
     ```json
     {
       "message": "Registration successful",
       "success": true
     }
     ```

2. **Login**:
   - Go to `/login` endpoint and provide your credentials.
   - Successful login returns a JSON response with a token:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "redirectTo": "/api/states"
     }
     ```
   - After successful login, you will be redirected to `GET /api/states`.

3. **Explore GET Endpoints**:
   - Use a browser to explore all the `GET` endpoints.

4. **POST and PUT Endpoints**:
   - Use Postman to test `POST` and `PUT` endpoints.
   - First, perform a `POST` request to `/login` with the following body:
     ```json
     {
       "username": "<username>",
       "password": "<password>"
     }
     ```
   - Use the token from the response for subsequent requests.
   - Add a header to your requests:
     - Key: `Authorization`
     - Value: `Bearer <token>`
   - Example `POST` request to create a new state:
     ```json
     {
       "name": "dispatch",
       "description": "container dispatch from a to b location",
       "status": "completed",
       "createdBy": "sai vamsi varada"
     }
     ```

5. **PUT Endpoint**:
   - Similar to the `POST` endpoint, but used to update existing states.

## Improving the Experience around Robot State Management

1. **Real-Time Monitoring and Control**:
    - Implement a real-time dashboard for monitoring the robot's state.
    - Provide live updates of the robot's status, location, and health metrics.

2. **User-Friendly Interface**:
    - Develop an intuitive interface for users to interact with the state management system.
    - Include visual aids like graphs and charts to represent the robot's state transitions and performance.

3. **Predictive Maintenance**:
    - Use machine learning algorithms to predict potential issues before they occur.
    - Schedule maintenance based on usage patterns and performance data.

## Streaming Data/Logs from Robot to Application

1. **WebSockets**:
    - Use WebSockets to establish a persistent connection between the robot and the application.
    - Stream real-time data and logs to the application for immediate analysis and action.

2. **Message Queues**:
    - Implement message queues (e.g., RabbitMQ, Kafka) to handle high-throughput data streams.
    - Ensure reliable and ordered delivery of messages.

3. **Data Storage**:
    - Store logs in a scalable database (e.g., MongoDB, Elasticsearch) for historical analysis.
    - Enable querying and visualization of historical data.

## Communicating Errors and Problems

1. **Alerting System**:
    - Implement an alerting system to notify users of critical issues.
    - Send alerts via multiple channels (e.g., email, SMS, push notifications).

2. **Error Handling**:
    - Standardize error codes and messages for easy troubleshooting.
    - Provide detailed logs and stack traces for debugging.

3. **Retry Mechanism**:
    - Implement automatic retries for transient errors.
    - Log and alert on persistent issues for manual intervention.

## Properties to Add to State Models

1. **Timestamps**:
    - Include timestamps for state creation, updates, and transitions.
    - Track the duration of each state.

2. **User Actions**:
    - Log user actions that trigger state changes.
    - Include user IDs and action descriptions.

3. **Metadata**:
    - Add metadata fields to capture additional context (e.g., location, environment conditions).
    - Use metadata for more informed decision-making.

## Additional Comments and Thoughts

1. **Security**:
    - Ensure secure communication between the robot and the application.
    - Use encryption and authentication to protect data integrity and privacy.

2. **Scalability**:
    - Design the system to handle multiple robots and high data volumes.
    - Use cloud-native technologies for scalability and resilience.

3. **API Documentation**:
    - Provide comprehensive API documentation for developers.
    - Include examples and use cases for all endpoints.

---

This `NOTES.md` reflects my approach to improving robot state management at ANSCER Robotics, focusing on user experience, real-time data handling, error communication, and additional state model properties. These ideas aim to create a robust and user-friendly system for managing and monitoring robot states effectively.
