import mongoose, { Schema } from 'mongoose';
// Define the state schema
const StateSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
});
const State = mongoose.model('State', StateSchema);
export default State;
