import { subscribeToken, unsubscribeToken } from "../services/fireBaseFcmTokenService.js"
import { findMember } from "../services/memberService.js"

export async function subscribeTokenController(req,res){
    try{
        const { memberId } = req.params
const member = await findMember(memberId)
if(!member) return res.status(404).json({message:"member not found"})
const memberFcmToken = await subscribeToken(memberId,req.body.fcmToken)
return res.status(200).json({message:"token subscribed successfully",memberFcmToken})
    }catch(err){
        console.error(err)
       return res.status(500).json({message:"something went wrong"+err.message})
    }
}

export async function unsubscribeTokenController(req,res){
    try{
        const fcmToken =await findMemberFcmToken(req.body.fcmToken)
        if(!fcmToken) return res.status(404).json({message:"token is not subscribe or is wrong"})
        const deletedToken = await unsubscribeToken(req.body.token)
    if(deletedToken) return res.status(200).json({message:"token unsubscribed successfully"})
    }catch(err){
        console.error(err)
       return res.status(500).json({message:"something went wrong"+err.message})
    }
}