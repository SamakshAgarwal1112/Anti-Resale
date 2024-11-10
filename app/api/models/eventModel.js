import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):?([0-5]\d)$/,
    },
    venue: {
        type: String,
        required: function() { return this.mode === 'offline'; },
        trim: true,
    },
    description: {
        type: String,
        default: 'To be updated soon!',
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    photos: [{
        type: String
    }],
    mode: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    ticketsAvailable: {
        type: Number,
        required: true,
        min: 0
    },
    ticketsBooked: {
        type: Number,
        default: 0,
        min: 0
    },
    bookingStatus: {
        type: String,
        enum: ['open','closed'],
        default: 'open',
        required: false,
    },
    ticketPrice: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

eventSchema.methods.isTicketAvailable = function() {
    return this.ticketsAvailable - this.ticketsBooked > 0;
};

export default mongoose.models.Event || mongoose.model("Event", eventSchema);