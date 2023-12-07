import { Get, GetAll, Delete, Create, Update } from "../services/projectReportService.js"
import { memberExists } from "../utils/memberExists.js"
import { notifyComanagersAfterProjectReport } from "../utils/notifyTriggers.js"
import { projectExists } from "../utils/projectExists.js"

import { projectMembershipVerification} from "../utils/projectMembershipVerification.js"

export async function getAllProjectReports(req, res) {
    try {
        const projectsReports = await GetAll()
        return res.status(200).json({data:projectsReports})

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }


}

export async function getProjectReport(req, res) {

    try {
        const { projectReportId } = req.params
        console.log(projectReportId)
        const single = await Get(projectReportId)
        console.log(single)

        if (single) return res.status(200).json({data:single})
        else return res.status(404).json({
            message: "no Project Report found with the provided ID"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export async function createProjectReport(req, res) {

    try {

        const newObject = req.body
        const member = await memberExists(newObject.memberId)
        if (!member) return res.status(404).json({
            message: "Provided memberId does not exist"
        })
   
   
        const project = await projectExists(newObject.projectId)
        if (!project) return res.status(404).json({
            message: "Provided projectId does not exist"
        })
    
    const membership = await projectMembershipVerification(newObject.memberId,newObject.projectId)
    if (!membership) return res.status(400).json({
        message: "Member is not in the Project"
    })


        const creation = await Create(newObject)

        notifyComanagersAfterProjectReport(creation )
        if (creation) return res.status(201).json({data:creation})



    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export async function deleteProjectReport(req, res) {

    try {
        const { projectReportId } = req.params
        const deletion = await Delete(projectReportId);
        if (deletion) return res.status(204).json({message:"deleted succefuly"})
        else return res.status(404).json({message:"no Project Report found with the provided ID"})

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export async function updateProjectReport(req, res) {

    try {
        const { projectReportId } = req.params
        const newObject = req.body
        const update = await Update(projectReportId, newObject)

        if (update) return res.status(200).json({data:update})
        else return res.status(404).json({
            message: "no Project Report found with the provided ID"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}