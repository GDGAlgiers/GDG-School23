import { GetAllProjectMemberships,validateMemberExists, GetProjectMembership, CreateProjectMembership, UpdateProjectMembership, DeleteProjectMembership, teamLeadExistsInProject } from '../services/projectMembershipService.js';
import { Get } from '../services/projectService.js';
import { notifyMemberOnAcceptance } from '../utils/notifyTriggers.js';

export async function getAllProjectMemberships(req, res) {
  try {
    const projectMemberships = await GetAllProjectMemberships();
    return res.status(200).json({ status: 200, data: projectMemberships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

export async function getProjectMembership(req, res) {
  try {
    const { projectMembershipId } = req.params;
    const projectMembership = await GetProjectMembership(projectMembershipId);

    if (!projectMembership) {
      return res.status(404).json({ status: 404, message: 'Project membership not found' });
    }

    return res.status(200).json({ status: 200, data: projectMembership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

export async function createProjectMembership(req, res) {
  try {

    const projectMembership = req.body;
    const member = await validateMemberExists(projectMembership.memberId);
    if(!member) return res.status(404).json({message:"no member was found with that id"})
    const project = await Get(projectMembership.projectId);
    if(!project) return res.status(404).json({message:"no project was found with that id"})
    if(project.isGlobal === false){
    const checkDep = member.departments.find(dep=>dep.depName === project.depName)? true : false
    if(!checkDep) return res.status(400).json({message:"member must be in the same department as project ",status:400})
  }
    if(projectMembership.role === "lead"){
      const checkTl =await teamLeadExistsInProject(projectMembership.projectId)
      if(checkTl) return res.status(400).json({message:"a project can have only one team leader",status:400})
    }
  
    const newProjectMembership = await CreateProjectMembership(projectMembership);
    notifyMemberOnAcceptance(newProjectMembership)
    return res.status(201).json({ status: 201, data: newProjectMembership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

export async function updateProjectMembership(req, res) {
  try {
    const projectMembership = req.body;
    const { projectMembershipId } = req.params;
    if(projectMembership.memberId){
      const isMemberValid = await validateMemberExists(projectMembership.memberId);
      if(!isMemberValid) return res.status(404).json({message:"no member was found with that id"})
      }
    if(projectMembership.projectId){
    const isProjectValid = await Get(projectMembership.projectId);
    if(!isProjectValid) return res.status(404).json({message:"no project was found with that id"})
  }

  if(projectMembership.role === "lead"){
    const checkTl =await teamLeadExistsInProject(projectMembership.projectId)
    if(checkTl) return res.status(400).json({message:"a project can have only one team leader",status:400})
  }
    const updatedProjectMembership = await UpdateProjectMembership(projectMembershipId, projectMembership);

    if (!updatedProjectMembership) {
      return res.status(404).json({ status: 404, message: 'Project membership not found' });
    }
    notifyMemberOnAcceptance(updatedProjectMembership)
    return res.status(200).json({ status: 200, data: updatedProjectMembership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

export async function deleteProjectMembership(req, res) {
  try {
    const { projectMembershipId } = req.params;
    const deletedProjectMembership = await DeleteProjectMembership(projectMembershipId);

    if (!deletedProjectMembership) {
      return res.status(404).json({ status: 404, message: 'Project membership not found' });
    }

    return res.status(204).json({ status: 204, data: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}
