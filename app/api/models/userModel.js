import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    aadharNumber: {
        type: String,
        unique: true,
        required: true,
        length: 12,
        match: /^[0-9]{12}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: { 
        type: String, 
        required: true
    },
    aadharSoftCopy: { 
        type: String, 
        required: true
    },
    isOrganization: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
