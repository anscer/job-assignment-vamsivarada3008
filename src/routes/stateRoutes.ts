import express from 'express';
import {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
  aggregateStates,
} from '../controllers/stateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id')
  .get(protect,getStateById)
  .put(protect,updateState)
  .delete(protect,deleteState);

router.route('/')
  .post(protect,createState)
  .get(protect,getStates);

router.get('/aggregate/output', aggregateStates);

export default router;
