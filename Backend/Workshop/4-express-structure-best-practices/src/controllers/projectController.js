import { Create, GetAll,Get,Update,Delete, projectsCount } from "../services/projectService.js";
import { checkDepsExistance } from "../utils/checkDepsExistance.js";
import { notifyMembersAfterProjectCreation } from "../utils/notifyTriggers.js";

export async function getAllProjects(req, res) {
  const { page = 1, pageSize = 10, status, depName, isFinished, isGlobal } = req.query  

  try {
    const projects = await GetAll(page, pageSize, status, depName, isFinished, isGlobal);
    return res.status(200).json({ status: 200, data: projects });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to get all the projects",
      });
  }
}
export async function projectsCountController(req, res) {
  try{
    const count= await projectsCount()
    return res.status(200).json({data:{count}})
  }catch(err){
    console.log(err)
    return res.status(500).json({message: "something went wrong while trying to get projects count"})
  }
}

export async function getProject(req,res){
  try {
    const {projectId} = req.params

    const project = await Get(projectId);
    if(!project){
      return res.status(404).json({status:404,message:"no project found with that id"})
    }
    return res.status(200).json({ status: 200, data: project });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to get project",
      });
  }
}


export async function createProject(req,res){
  try {
    const project= req.body
    const checkDeps = await checkDepsExistance([project.depName])
    if(!checkDeps.status) return res.status(404).json({status:404,message:checkDeps.message})
    const newProject = await Create(project);
    notifyMembersAfterProjectCreation(newProject)
    return res.status(201).json({ status: 201, data: newProject });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to create a new project",
      });
  }
}

export async function updateProject(req,res){
  try {
    const project = req.body
    const {projectId} = req.params
    if(project.depName){
    const checkDeps = await checkDepsExistance([project.depName])
    if(!checkDeps.status) return res.status(404).json({status:404,message:checkDeps.message})
    }
    const updatedProject = await Update(projectId,project);
    if(!updatedProject) return res.status(404).json({status:404,message:"no project found with that id"})
    return res.status(200).json({ status: 200, data: updatedProject  });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to update the project",
      });
  }
}

export async function deleteProject(req,res){
  try {
    const {projectId} = req.params
    const deletedProject = await Delete(projectId);
    if(!deletedProject) return res.status(404).json({status:404,message:"no project found with that id"})
    return res.status(204).json({ status: 204, data: null });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to delete the project",
      });
  }
}