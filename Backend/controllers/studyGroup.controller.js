import mongoose from "mongoose";
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

        if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
        const userId = req.user._id;

        // Create new study group
        const newGroup = await StudyGroup.create({
            groupName,
            subject: groupSubject,
            description: groupDescription,
            meetingTime,
            creator: userId,
            members: [userId]
        });

        const createdGroup = await StudyGroup.findById(newGroup._id)
            .populate("creator", "fullname email")
            .populate("members", "fullname email");

        if (!createdGroup) throw new ApiError(500, "Failed to create study group");

        return res
            .status(201)
            .json(new ApiResponse(201, createdGroup, "Study group created successfully"));
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
        if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
        const userId = req.user._id;

        const group = await StudyGroup.findById(groupId);
        if (!group) throw new ApiError(404, "Study group not found");

        // Initialize members array if it doesn't exist
        if (!group.members) {
            group.members = [];
        }

        // Check if user is already a member (convert to string for comparison)
        const isMember = group.members.some(memberId => 
            memberId.toString() === userId.toString()
        );
        
        if (isMember) {
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

export const deleteGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const group = await StudyGroup.findById(groupId);
        if (!group) throw new ApiError(404, "Study group not found");

        // Delete the group
        await StudyGroup.findByIdAndDelete(groupId);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Study group deleted successfully"));
    } catch (error) {
        next(error);
    }
};

export const leaveGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
        const userId = req.user._id;

        const group = await StudyGroup.findById(groupId);
        if (!group) throw new ApiError(404, "Study group not found");

        // Initialize members array if it doesn't exist
        if (!group.members) {
            group.members = [];
        }

        // Check if user is a member
        const isMember = group.members.some(memberId => 
            memberId.toString() === userId.toString()
        );
        
        if (!isMember) {
            throw new ApiError(400, "You are not a member of this group");
        }

        // Remove user from members array
        group.members = group.members.filter(memberId => 
            memberId.toString() !== userId.toString()
        );
        await group.save();

        const updatedGroup = await StudyGroup.findById(groupId)
            .populate("creator", "fullname email")
            .populate("members", "fullname email");

        return res
            .status(200)
            .json(new ApiResponse(200, updatedGroup, "Successfully left the study group"));
    } catch (error) {
        next(error);
    }
};
