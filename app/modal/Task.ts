// backend/models/Task.js
import mongoose from "mongoose";

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Reference to tasks
}, { timestamps: true });

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user
}, { timestamps: true });

// Export models
module.exports = {
  User: mongoose.model('User', UserSchema),
  Task: mongoose.model('Task', TaskSchema)
};
