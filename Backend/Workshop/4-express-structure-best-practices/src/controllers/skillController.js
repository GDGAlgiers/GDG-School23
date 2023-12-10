import { findMember } from "../services/memberService.js";
import { Get, GetAll ,Delete,create,Update } from "../services/skillService.js";
import {doesSkillExistForMember} from '../utils/doesSkillExistForMember.js'

export async function getAllSkills(req,res){
  try {
    const skills = await GetAll();
    return res.status(200).json({status:200 , data:skills});
  }catch (err) {
    console.error(err)
    return res
    .status(500).json({status:500,message:"something went wrong while trying to get all the skills"});
  }
}


export async function getSkill (req,res) {
  try{
    const{skillId} = req.params
    const skill = await Get(skillId);
    if(!skill) {
      return res.status(404).json({status:404,message:"no skill found with that id"})
    }
    return res.status(200).json({status:200,data:skill});
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({status:500,message:"something went wrong while trying to get skill"});
  }
}

export async function deleteSkill (req,res) {
  try{
    const {skillId} = req.params
    const oldSkill = await Get(skillId)
    if(!oldSkill) return res.status(404).json({message:"no skill found with that id"})
    const deletedSkill = await Delete(skillId);
    return res.status(204).json({data:null,message:"skill deleted successfully"});
  }
  catch(err){
    console.error(err)
    return res.status(500).json({status:500,message:"something went wrong while trying to delete the skill"});
  }
}


export async function createSkill(req,res){
  try{
    const skill = req.body
    const member = await findMember(skill.memberId)
    if(!member) return res.status(404).json({message:"no member was found with that id"})
    const checkSkill = await doesSkillExistForMember(skill.memberId,skill.name)
    if (checkSkill) return res.status(400).json({status:400,message:"Skill with that name exist before"})
    const newSkill = await create(skill);
    return res.status(201).json({ status: 201, data: newSkill });
  }
  catch(err){
    console.error(err)
    return res.status(500).json({status:500,message:"something went wrong while trying to create a new skill"});
  }
}


export async function updateSkill(req,res){
  try {
    const skill = req.body
    const {skillId} = req.params
    const oldSkill = await Get(skillId)
    if(!oldSkill) return res.status(404).json({status:404,message:"no skill found with that id"})
    if(skill.memberId){
      const member = await findMember(skill.memberId)
    if(!member) return res.status(404).json({message:"no member was found with that id"})
    if(skill.name){
      const checkSkill = await doesSkillExistForMember(skill.memberId,skill.name)
      if(checkSkill) return res.status(400).json({status:400,message:"skill with that name exist"})
    }else{
      const checkSkill = await doesSkillExistForMember(skill.memberId,oldSkill.name)
      if(checkSkill) return res.status(400).json({status:400,message:"skill with that name exist"})
    }
   
    }else if(skill.name){
      const checkSkill = await doesSkillExistForMember(oldSkill.memberId,skill.name)
      if (checkSkill) return res.status(400).json({status:400,message:"skill with that name exist"})
    }
      
    const updatedSkill = await Update(skillId,skill);
    
    return res.status(200).json({ status: 200, data: updatedSkill  });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to update the Skill",
      });
  }
}
