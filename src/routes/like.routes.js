import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/video-likes/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/comment-likes/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/tweet-likes/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/liked-videos/:userId").get(verifyJWT, getLikedVideos);


export default router