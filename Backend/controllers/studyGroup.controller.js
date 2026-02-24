import StudyGroup from "../models/studyGroup.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";

export const createGroup = async (req, res, next) => {
    try {
        const { groupName, groupSubject, groupDescription, meetingTime } = req.body;
        console.log("incoming data:", req.body);
        // Validate required fields
        if (!groupName) throw new ApiError(400, "Group name is required");
        if (!groupSubject) throw new ApiError(400, "Subject is required");
        if (!groupDescription) throw new ApiError(400, "Description is required");
        if (!meetingTime) throw new ApiError(400, "Meeting time is required");

        // Create new study group
        const newGroup = await StudyGroup.create({
            groupName,
            subject: groupSubject,
            description: groupDescription,
            meetingTime,
            // creator: req.user._id // Assuming you have user info in request from auth middleware
            // members: [req.user._id] // Creator is automatically a member
        });

        // const createdGroup = await StudyGroup.findById(newGroup._id)
        //     .populate("creator", "fullname email")
        //     .populate("members", "fullname email");

       // if (!createdGroup) throw new ApiError(500, "Failed to create study group");

        return res
            .status(201)
            .json(new ApiResponse(201, newGroup, "Study group created successfully"));
    } catch (error) {
        next(error);
    }
};

export const getAllGroups = async (req, res, next) => {
    try {
        const groups = await StudyGroup.find()
            .populate("creator", "fullname email")
            .populate("members", "fullname email")
            .sort("-createdAt");

        return res
            .status(200)
            .json(new ApiResponse(200, groups, "Study groups fetched successfully"));
    } catch (error) {
        next(error);
    }
};

export const joinGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id; // Assuming you have user info in request from auth middleware

        const group = await StudyGroup.findById(groupId);
        if (!group) throw new ApiError(404, "Study group not found");

        // Check if user is already a member
        if (group.members.includes(userId)) {
            throw new ApiError(400, "You are already a member of this group");
        }

        // Add user to members array
        group.members.push(userId);
        await group.save();

        const updatedGroup = await StudyGroup.findById(groupId)
            .populate("creator", "fullname email")
            .populate("members", "fullname email");

        return res
            .status(200)
            .json(new ApiResponse(200, updatedGroup, "Successfully joined the study group"));
    } catch (error) {
        next(error);
    }
};

export const getGroupDetails = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const group = await StudyGroup.findById(groupId)
            .populate("creator", "fullname email")
            .populate("members", "fullname email");

        if (!group) throw new ApiError(404, "Study group not found");

        return res
            .status(200)
            .json(new ApiResponse(200, group, "Study group details fetched successfully"));
    } catch (error) {
        next(error);
    }
};
