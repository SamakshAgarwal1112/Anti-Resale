import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event" 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    isIssued: {
        type: Boolean,
        default: false,
    },
    issuedAt: { 
        type: Date,
        required: false,
    },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
