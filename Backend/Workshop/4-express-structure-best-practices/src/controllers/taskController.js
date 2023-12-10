import { body } from 'express-validator';
import { GetFullTask,GetAllT, GetT, CreateT, UpdateT, DeleteT } from '../services/taskService.js'

import { getCheckpointById } from "../services/checkpointService.js";

import { projectMembershipVerification } from "../utils/projectMembershipVerification.js"
import { findMember } from '../services/memberService.js';


export async function GetAllTasks(req,res) {
    try
    {
        const { memberId } = req.query;
        if(memberId){
            const member = await findMember(memberId)
            if(!member) return res.status(404).json({message:"there is no member with that id"})
        }
        const tasks = await GetAllT(memberId);
        return res.status(200).json({status:200 , data:tasks})
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: "An error occured during the tasks fetching" })
    }

}

export async function GetTask(req, res) {
    try {
        const task = await GetT(req.params.taskId)
        if (!task) {
            return res.status(404).json({ status: 404, message: "no sprint was found with that id" })
        }
        return res.status(200).json({
            status: 200,
            data: task
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 500,
            message: "An error occured while fetching the task",
            error: err
        })
    }

}

export async function CreateTask(req, res) {
    try {
        const sprint = await getCheckpointById(req.body.sprintId)
        if (!sprint) return res.status(404).json({ message: "no sprint was found with that id" })
        const member = await findMember(req.body.memberId)
        if (!member) return res.status(404).json({ message: "no member was found with that id" })
        const project = sprint.projectId
        const membership = await projectMembershipVerification(req.body.memberId, project)
        if (!membership) return res.status(400).json({
            message: "member not found in the project"
        })
        const task = await CreateT(req.body)
        return res.status(201).json({
            status: 201,
            data: task
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 500,
            message: "An error occured during the task Creation"
        })
    }
}

export async function UpdateTask(req, res) {
    try {
        const {request}=req.params
        const targettask=await GetFullTask(request)
        if (!targettask) {
            return res.status(404).json({ status: 404, message: "No task was found with that id" })
        }
        if (req.body.sprintId) {
            const sprint = await getCheckpointById(req.body.sprintId)
            if (!sprint) return res.status(404).json({ message: "no sprint was found with that id" })
            const project =sprint.projectId
            const membership = projectMembershipVerification(targettask.memberId, project)
            if (!membership) return res.status(400).json({
                message: "member not found in the project"
            })
        }
        else{
            if (req.body.memberId) {
                const member = await findMember(req.body.memberId)
                if (!member) return res.status(404).json({ message: "no member was found with that id" })
                const project = targettask.sprint.project.projectId
                const membership = projectMembershipVerification(req.body.memberId, project)
                if (!membership) return res.status(400).json({
                    message: "member not found in the project"
                })
            }
        }
        
        const task = await UpdateT(req.params.taskId, req.body)
       
        return res.status(200).json({
            status: 200,
            message: "The task has been successfuly updateded",
            data: task
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: "An error occured while updating the task",
            error: err
        })
    }
}

export async function DeleteTask(req, res) {
    try {
        const task = await DeleteT(req.params.taskId)

        if (!task) {
            return res.status(404).json({ status: 404, message: "No task was found with that id" })
        }
        console.log(task)
        return res.status(204).json({ status: 204, messsage: "The task is deleted successfuly" })


    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 500,
            message: "An error occured while deleting the task",
            error: err
        })
    }
}

