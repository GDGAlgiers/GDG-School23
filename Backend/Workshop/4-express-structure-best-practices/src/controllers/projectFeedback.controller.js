import { findMember } from "../services/memberService.js";
import {
    createProjectFeedback,
    deleteProjectFeedback,
    getProjectFeedback, getProjectFeedbackById,
    updateProjectFeedback
} from "../services/projectFeedback.service.js";
import { Get } from "../services/projectService.js";
import { projectMembershipVerification } from "../utils/projectMembershipVerification.js";


export async function getProjectFeedbackController(req, res) {
    try {
        const projectFeedbacks = await getProjectFeedback()
        return res.status(200).json({ status: 200, data: projectFeedbacks })
    } catch (err) {
        return res.status(500).json({ status: 500, message: "something went wrong", data: [] })
    }
}
export async function getProjectFeedbackByIdController(req, res) {
    const id = req.params.id;
    try {
        const projectFeedback = await getProjectFeedbackById(id)
        if (!projectFeedback) return res.status(404).json({ status: 404, message: "project feedback does not exist" });
        return res.status(200).json(projectFeedback)
    } catch (err) {
        return res.status(500).json({ status: 500, message: "something went wrong" })
    }
}

export async function postProjectFeedbackController(req, res) {
    try {
        const projectFeedback = req.body;
        const project = await Get(projectFeedback.projectId)
        if (!project) return res.status(404).json({ message: "no project was found with that id" })
        const member = await findMember(projectFeedback.memberId)
        if (!member) return res.status(404).json({ message: "no member was found with that id" })
       
        const membership = await projectMembershipVerification(projectFeedback.memberId, projectFeedback.projectId)
        if (!membership) return res.status(400).json({
            message: "Member is not in the Project"
        })
        const createdProjectFeedback = await createProjectFeedback(projectFeedback);
        return res.status(201).json({ message: "project feedback created successfully", data: createdProjectFeedback });
    } catch (e) {
        return res.status(500).json({ message: "something went wrong" });
    }
}

export async function putProjectFeedbackController(req, res) {
    try {
        const projectFeedback = req.body;
        const { id } = req.params;
        const isExist = await getProjectFeedbackById(id);
        if (!isExist) return res.status(404).json({ status: 404, message: "project feedback does not exist" });
        const updatedProjectFeedback = await updateProjectFeedback(id, projectFeedback);
        return res.status(200).json({ message: "project feedback updated successfully", data: updatedProjectFeedback });
    } catch (e) {
        return res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteProjectFeedbackController(req, res) {
    const { id } = req.params;
    console.log(id)
    try {
        const isExist = await getProjectFeedbackById(id);
        if (!isExist) return res.status(404).json({ status: 404, message: "project feedback does not exist" });

        const deletedProjectFeedback = await deleteProjectFeedback(id)
        return res.status(204).json({ message: "project feedback deleted successfully", data: null })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, message: "something went wrong" })
    }
}