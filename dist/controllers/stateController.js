var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import connectDB from '../config/db.js';
const getCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield connectDB();
    return db.collection('state_management');
});
/**
 * @swagger
 * /api/states:
 *   post:
 *     summary: Create a new state
 *     tags: [States]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: State created successfully
 *       500:
 *         description: Internal server error
 */
export const createState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, status, createdBy } = req.body;
    try {
        const collection = yield getCollection();
        const newState = { name, description, status, createdAt: new Date(), updatedAt: new Date(), createdBy };
        const result = yield collection.insertOne(newState);
        res.status(201).json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /api/states:
 *   get:
 *     summary: Get all states
 *     tags: [States]
 *     responses:
 *       200:
 *         description: A list of states
 *       500:
 *         description: Internal server error
 */
export const getStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield getCollection();
        const states = yield collection.find().toArray();
        res.status(200).json(states);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /api/states/{id}:
 *   get:
 *     summary: Get a single state by ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The state ID
 *     responses:
 *       200:
 *         description: A single state
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */
export const getStateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield getCollection();
        const state = yield collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        res.status(200).json(state);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /api/states/{id}:
 *   put:
 *     summary: Update a state
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The state ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               createdBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: State updated successfully
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */
export const updateState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, status, createdBy } = req.body;
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'State not found' });
    }
    try {
        const collection = yield getCollection();
        const result = yield collection.updateOne({ _id: new ObjectId(id) }, { $set: { name, description, status, updatedAt: new Date(), createdBy } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'State not found' });
        }
        const updatedState = yield collection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(updatedState);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /api/states/{id}:
 *   delete:
 *     summary: Delete a state
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The state ID
 *     responses:
 *       200:
 *         description: State deleted successfully
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 */
export const deleteState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield getCollection();
        const result = yield collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'State not found' });
        }
        res.status(200).json({ message: 'State removed' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message, success: false });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred", success: false });
        }
    }
});
/**
 * @swagger
 * /api/states/aggregate/output:
 *   get:
 *     summary: Aggregate states
 *     tags: [States]
 *     responses:
 *       200:
 *         description: Aggregated states
 *       500:
 *         description: Internal server error
 */
export const aggregateStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield getCollection();
        const results = yield collection.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        hour: { $hour: "$createdAt" },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 }
            }
        ]).toArray();
        res.status(200).json(results);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
