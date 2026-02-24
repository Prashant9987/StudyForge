import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "Group name is required"],
        trim: true
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        enum: ["Computer Science", "Information Technology", "Artificial Intelligence", 
               "Web Development", "Information Security", "Data Science"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    meetingTime: {
        type: Date,
        required: [true, "Meeting time is required"]
    },
    // members: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    // creator: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // },
    status: {
        type: String,
        enum: ["active", "scheduled", "completed"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model("StudyGroup", studyGroupSchema);