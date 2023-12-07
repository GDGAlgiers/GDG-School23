import { body } from 'express-validator';
import {GetAllTR , GetTR , CreateTR , UpdateTR , DeleteTR} from '../services/templateResponseService.js'
import {Get} from '../services/projectService.js'
import { notifyComanagersAfterProjectApplication } from '../utils/notifyTriggers.js';
import { findMember } from '../services/memberService.js';



export async function GetAllTemplateResponse(req,res) {
    try
    {
        const templates = await GetAllTR();
        return res.status(200).json({status:200 , data:templates})
    }
    catch(err)
    {
        return res.status(500).json({message:"An error occured during the templates fetching" , error: err})
    }
}


export async function GetTemplateResponse(req,res) {
    try 
    {
        const template = await GetTR(req.params.templateId)
        if(!template) {
            return res.status(404).json({status:404,message:"No template was found with those specifications"})
        }
        return res.status(200).json({
            status: 200,
            data:template
        })

    }
    catch(err) 
    {
        console.log(err)
        return res.status(500).json({
            status:500,
            message: "An error occured while fetching the template",
            error : err
        })
    }

}

export async function CreateTemplateResponse(req,res) {
    try 
    {
        const project = await Get(req.body.projectId)
        if(!project) return res.status(404).json({message:"no project was found with that id"})
        const member = await findMember(req.body.memberId)
        if(!member)  return res.status(404).json({message:"no member was found with that id"})
        
        const template = await CreateTR(req.body)
        notifyComanagersAfterProjectApplication(template)
        return res.status(201).json({
            status : 'Creation succedded',
            data : template
        })
    }   
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            status:500,
            message:"An error occured during the template Creation"
        })
    }
}


export async function UpdateTemplateResponse(req,res) {
    try 
    {

        if(req.body.projectId){
        const project = await Get(req.body.projectId)
        if(!project) return res.status(404).json({message:"no project was found with that id"})
        }
        if(req.body.memberId){
        const member = await findMember(req.body.memberId)
        if(!member)  return res.status(404).json({message:"no member was found with that id"})
        }


        const template = await UpdateTR(req.params.templateId,req.body)
        if (!template) {
            return res.status(404).json({status:404,message:"No template was found with those specifications"})
        }
        return res.status(200).json({
            status:200,
            message: "The template has been successfuly updateded",
            data: template
        })
    }
    catch(err) 
    {
        console.log(err)
        res.status(500).json({
            status:500,
            message:"An error occured while updating the template",
            error:err
        })
    }
}

export async function DeleteTemplateResponse(req,res) {
    try
    {
        const template = await DeleteTR(req.params.templateId)
        
        if(!template) {
            return res.status(404).json({status:404,message:"No template was found with those specifications"})
        }
        console.log(template)
        return res.status(204).json({status:204,messsage:"The template is deleted successfuly"})


    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            status:500, 
            message: "An error occured while deleting the template",
            error: err
        })
    }
}


