const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    category: {
        type: String,
        required: true,
        trim: true,
        default: 'Personal',
    },
}, {
    timestamps: true,
});

// Create indexes
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;