import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import stateRoutes from './routes/stateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'State Management API',
      version: '1.0.0',
      description: 'API for managing states',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve static files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/states', stateRoutes);
app.use('/', authRoutes);

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html'); // Serve HTML directly
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
