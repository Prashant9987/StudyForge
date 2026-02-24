import { Router } from "express";
import { createGroup, getAllGroups, joinGroup, getGroupDetails } from "../controllers/studyGroup.controller.js";

const router = Router();

router.route("/create").post(createGroup);
router.route("/all").get(getAllGroups);
router.route("/join/:groupId").post(joinGroup);
router.route("/:groupId").get(getGroupDetails);

export default router;
