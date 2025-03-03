const express = require("express");
const router = express.Router();
const taskController = require("../Controllers/taskcontroller");
const authenticateUser = require("../Middleware/auth");

router.post("/createTask", authenticateUser, taskController.createTask);
router.get("/", authenticateUser, taskController.getAllTasks);
router.put("/:taskId/assignByEmail", authenticateUser, taskController.assignTaskToUserByEmail);
router.patch("/:taskId/collaborators", authenticateUser, taskController.assignTaskCollaborators);
router.put("/:taskId", authenticateUser, taskController.updateTask);

module.exports = router;