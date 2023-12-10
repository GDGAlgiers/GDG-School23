import { Delete, GetAll, Get, Update, Create } from "../services/TaskSubmissionService.js"
import { memberExists } from "../utils/memberExists.js"
import { notifyTlAfterTaskSubmission } from "../utils/notifyTriggers.js"
import { taskExists } from "../utils/taskExists.js"
import { GetT } from "../services/taskService.js"

export async function getAllTaskSubmissions(req, res) {

    try {

        const taskSubmissions = await GetAll()
        return res
            .status(200)
            .json({ data: taskSubmissions })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({
                status: 500,
                message: "Server error, unable to get all the taskSubmissions",
            });


    }


}
export async function getTaskSubmission(req, res) {
    try {
        const { taskSubmissionId } = req.params
        const single = await Get(taskSubmissionId)
        console.log(single)
        if (single) return res.status(200).json({
            status: 200,
            data: single
        })
        else return res.status(404).json({
            status: 404,
            message: "no task submission found with the provided ID"
        })


    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({
                status: 500,
                message: "Server error, unable to get the taskSubmission",
            });


    }


}
export async function createTaskSubmission(req, res) {


    try {
        const newTS = req.body;
        const task = await taskExists(newTS.taskId)
        if (!task) return res.status(404).json({
            message: "Provided taskId does not exist"
        })
       

        const member = await memberExists(newTS.memberId)
        if (!member) return res.status(404).json({
            message: "Provided memberId does not exist"
        })
        const Task = await GetT(newTS.taskId)
        if (newTS.memberId != Task.memberId) //verifies if the member is responsible of the task
            return res.status(400).json({
                message: "Member is not responsible of the Task"
            })


        const creation = await Create(newTS);
        notifyTlAfterTaskSubmission(creation.taskId)
       return res.status(200).json({ data: creation });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error, unable to create the taskSubmission" });
    }


}
export async function updateTaskSubmission(req, res, next) {
    try {
        const { taskSubmissionId } = req.params
        const body = req.body

        if (body.taskId) {
            const Task = await GetT(body.taskId)
            if (!Task) return res.status(404).json({
                message: "Provided taskId does not exist"
            })
            if (body.memberId) {
                const member = await memberExists(body.memberId)
                if (!member) return res.status(404).json({
                    message: "Provided memberId does not exist"
                })
                if (body.memberId != Task.memberId) // verifies if the member is responsible of the task
                    return res.status(400).json({
                        message: "Member is not responsible of the Task"
                    })
            }
        }
        else {
            if (body.memberId) {
                const member = await memberExists(body.memberId)
                if (!member) return res.status(404).json({
                    message: "Provided memberId does not exist"
                })
                const current = await Get(taskSubmissionId)
                if (current.memberId != body.memberId) // verifies if the member is responsible of the task
                    return res.status(400).json({
                        message: "Member is not responsible of the Task"
                    })
            }

        }



        const update = await Update(taskSubmissionId, body)
        if (update){
            res.status(200).json({ data: update })
            req.taskId = update.taskId
            next();}
        else return res.status(404).json({ message: "No task submission found with the provided ID" })

    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({
                status: 500,
                message: "Server error, unable to update the taskSubmission",
            });

    }
}
export async function deleteTaskSubmission(req, res) {

    try {
        const { taskSubmissionId } = req.params

        const Deleted = await Delete(taskSubmissionId)

        if (Deleted) return res.status(204).json(
            {
                message: "Deletion Success"
            })
        else return res.status(404).json({
            message: "No task submission found with the provided ID"
        })


    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({
                status: 500,
                message: "Server error, unable to delete the taskSubmission",
            });


    }

}