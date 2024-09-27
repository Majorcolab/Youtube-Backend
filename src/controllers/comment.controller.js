import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new ApiError(401, "Please provide a valid comment");
    }
    const { resourceId } = req.params;
    const { type } = req.query;

    if (!resourceId || !type) {
        throw new ApiError(400, "Please provide a valid resource id and type");
    }

    const ownerId = req.user?._id;
    if (type === "video") {
        const video = await Video.findOne({ _id: reourceId });
        if (!video) {
            throw new ApiError(400, "Please provide a valid video id");
        }
        const commentOnVideo = await Comment.create({
            content,
            video: resoureId,
            owner: ownerId,
        });
        if (!commentOnVideo) {
            throw new ApiError(
                500,
                "Something went wrong while adding comment on the video",
            );
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Comment added successfully",
                    commentOnVideo,
                ),
            );
    } else if (type === "tweet") {
        const tweet = await Tweet.findOne({ _id: reourceId });
        if (!tweet) {
            throw new ApiError(400, "Please provide a valid tweet id");
        }
        const commentOnTweet = await Comment.create({
            content,
            tweet: resoureId,
            owner: ownerId,
        });
        if (!commentOnTweet) {
            throw new ApiError(
                500,
                "Something went wrong while adding comment on the tweet",
            );
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Comment on the tweet added successfully",
                        commentOnTweet,
                    ),
                );
        }
    } else {
        throw new ApiError(400, "Invalid Request");
    }
});

const getAllComments = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;
    const { page = 1, limit = 10, type } = req.query;
    if (!resourceId || !type) {
        throw new ApiError(400, "Please provide a valid resource id and type");
    }

    if (type === "video") {
        const commentsOnVideo = await Comment.find({ video: resourceId });
        if (!commentsOnVideo) {
            throw new ApiError(404, "There are no comments on the video");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Comments on the video", commentsOnVideo),
            );
    } else if (type === "tweet") {
        const commentsOnTweet = await Comment.find({ tweet: resourceId });
        if (!commentsOnTweet) {
            throw new ApiError(404, "There are no comments on the tweet");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Comments on the tweet", commentsOnTweet),
            );
    } else {
        throw new ApiError(400, "Invalid Request");
    }
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new ApiError(401, "Please provide a valid comment");
    }
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Please provide a valid comment id");
    }
    const comment = await Comment.findOneAndUpdate(
        { _id: commentId },
        { content: content },
    );
    if (!comment) {
        throw new ApiError(
            500,
            "Something went wrong while updating the comment",
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(201, "Comment Id is required");
    }
    const commentToDelete = await Comment.findByIdAndDelete({ _id: commentId });
    if (!commentToDelete) {
        throw new ApiError(
            500,
            "Something went wrong while deleting the comment",
        );
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                commentToDelete,
                "Comment deleted successfuly",
            ),
        );
});

export { addComment, getAllComments, updateComment, deleteComment };
