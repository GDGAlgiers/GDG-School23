import { createCheckpoint,getChecpoints, deleteCheckPoint, getCheckpointById, getCheckpointByTitleAndProjectId, updateCheckpoint } from "../services/checkpointService.js";
import { Get as getProjectById } from "../services/projectService.js";


// get checkpoints
export async function getCheckpointsController (req, res) {
    try{
        const checkpoints = await getChecpoints();
        return res.status(201).json(checkpoints);
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetshing the sprints.' });
    }
}

// post checkpoint
export async function postCheckpointController (req, res) {
    const checkpointData = req.body
    const checkpointTitle = checkpointData.sprintTitle
    const checkpointProjectId = checkpointData.projectId

    try {
        const checkpointProject = await getProjectById(checkpointProjectId)
        if (!checkpointProject) {
            return res.status(404).json({message: `project with id=${checkpointProjectId} does not exist` });
        }
    
        const oldCheckpoint = await getCheckpointByTitleAndProjectId(checkpointTitle, checkpointProjectId);
        if (oldCheckpoint) {
            return res.status(400).json({message: `Sprint with title ${checkpointTitle} already exists for this project`});
        }
        
        const newCheckpoint = await createCheckpoint(checkpointData)
        return res.status(201).json(newCheckpoint)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while creating the sprint.' });
    }

}

// get checkpoint by id
export async function getCheckpointController (req, res) {
    const checkpointId = req.params.id
    try{
        const checkpoint = await getCheckpointById(checkpointId)
        if (!checkpoint) {
            return res.status(404).json({message: `no sprint with id=${checkpointId}`})
        }
        return res.status(201).json(checkpoint);
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetshing the sprint.' });
    }
}

// update checkpoint by id
export async function putCheckpointController (req, res) {
    const checkpointId = req.params.id
    const data = req.body 
    const checkpointProjectId = data.projectId
    try{
        if(checkpointProjectId) {
            const checkpointProject = await getProjectById(checkpointProjectId)
            if(!checkpointProject) {
                return res.status(404).json({message: `project with id=${checkpointProjectId} does not exist` });
            } 
        }

        const checkpoint = await getCheckpointById(checkpointId)
        if (!checkpoint) {
            return res.status(404).json({message: `no sprint with id=${checkpointId}`})
        }
        const updatedSprint = await updateCheckpoint(checkpointId, data)

        return res.status(200).json(updatedSprint)
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while updating the sprint.' });
    }
}

// delete checkpoint by id
export async function deleteCheckpointController (req, res) {
    const checkpointId = req.params.id
    try{
        const checkpoint = await getCheckpointById(checkpointId)
        if (!checkpoint) {
            return res.status(404).json({message: `no sprint with id=${checkpointId}`})
        }
        await deleteCheckPoint(checkpointId)

        return res.status(204).send({messsage:"checkpoint is deleted successfuly"});
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the sprint.' });
    }
}



