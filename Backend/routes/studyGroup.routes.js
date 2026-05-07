import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createGroup, getAllGroups, joinGroup, getGroupDetails, deleteGroup, leaveGroup } from "../controllers/studyGroup.controller.js";

const router = Router();

router.use(authMiddleware);

router.route("/create").post(createGroup);
router.route("/all").get(getAllGroups);
router.route("/:groupId/join").post(joinGroup);
router.route("/:groupId/leave").post(leaveGroup);
router.route("/:groupId/delete").post(deleteGroup);
router.route("/:groupId").get(getGroupDetails);

export default router;
