import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getRecommendedUsers,
    getMyFriends, sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests,
    declineFriendRequest,
    updateProfile,
    searchUsers
} from "../controllers/user.controller.js";
const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/decline", declineFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);
router.put("/me", protectRoute, updateProfile);

router.get("/search", searchUsers);

export default router;