import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400, "Please provide a valid user id")
    }
    const allVideos = await Video.find({userId: userId});

    const [totalLikes, totalSubscribers, totalSubscribedTo] = await Promise.all([
        Like.countDocuments({likedBy: userId}),
        Subscription.countDocuments({channel: userId}),
        Subscription.countDocuments({subscriber: userId})
    ])

    const totalViews = allVideos.reduce((total, video) => total + video.views, 0);

    return res.status(200).json(
        new ApiResponse(200,{
            totalLikes,
            totalViews,
            totalSubscribers,
            totalSubscribedTo,
            allVideos
        })
        )
                        
})


export {
    getChannelStats,
    }