import { findAllMembers,findMember,updateMemberService,deleteMemberService } from "../services/memberService.js";
import { checkDepsExistance } from "../utils/checkDepsExistance.js";
import { compare } from "bcrypt";
import { hash } from "bcrypt";
import { sendMail } from "../utils/sendMail.js";
import {getMemberByEmail} from '../utils/getMemberByEmail.js'
import { generatePassword } from "../utils/randomPasswordGenerator.js";
export async function getAllMembers(req,res){
    try{
        const { page = 1, pageSize = 10,role,isVerified,depName } = req.query;
        const members = await findAllMembers(page,pageSize,role,isVerified,depName);
        return res.status(200).json({data:members})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong when getting all members"})
    }
}

export async function getMember(req,res){
    try{
        const {memberId} = req.params
        const member = await findMember(memberId)
        if(!member) return res.status(404).json({message:"member not found"})
        return res.status(200).json({data:member})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong when getting member"})
    }
}

export async function updateMember(req,res){
    try{
        const {memberId} = req.params
        const updatedMember = req.body
        
        updatedMember.password = undefined
        const member = await findMember(memberId)
        if(!member) return res.status(404).json({message:"member not found"})
        
        // const isMatched = await compare(updatedMember.password, member.password);
        // if(!isMatched) return res.status(400).json({message:"incorrect password"})
        if(updatedMember.departmentNames){
            const checkDeps = await checkDepsExistance(updatedMember.departmentNames);
            if (!checkDeps.status) {
              return res.status(404).json({ status: 404, message: checkDeps.message });
            }
        }
        const updatMember = await updateMemberService(memberId,updatedMember)
        return res.status(200).json({data:updatMember})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong when updating member"})
    }
}

export async function deleteMember(req,res){
    try{
        const {memberId} = req.params
        const member = await findMember(memberId)
        if(!member) return res.status(404).json({message:"member not found"})
        const deletedMember = await deleteMemberService(memberId)
        return res.status(204).json({message:"member deleted successfully"}) 
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong when deleting member"})
    }
}

export async function updatePassword(req,res){
    try{
        const {memberId} = req.params
        const {password,newPassword} = req.body
        const member = await findMember(memberId)
        if(!member) return res.status(404).json({message:"member not found"})
        
        const isMatched = await compare(password, member.password);
        if(!isMatched) return res.status(400).json({message:"incorrect password"})
 
        const cryptedPassword = await hash(newPassword, 12);
        member.password = cryptedPassword;
        const updatMember = await updateMemberService(memberId,member)
        return res.status(200).json({message:"password updated successfully"})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong when updating password"})
    }
}

export async function forgetPassword(req,res){
    try{
        const {email} = req.body
        const member = await getMemberByEmail(email)
        if(!member) return res.status(404).json({message:"member not found"})
        const newPassword = generatePassword(8)
        const cryptedPassword = await hash(newPassword, 12);
 
        member.password = cryptedPassword;
        await sendMail(email,"new password",`here is your new password : ${newPassword}`)
        const updatMember = await updateMemberService(member.memberId,member)
        return res.status(200).json({message:"new password sent successfully to the member email"})
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"something went wrong"})
    }
}