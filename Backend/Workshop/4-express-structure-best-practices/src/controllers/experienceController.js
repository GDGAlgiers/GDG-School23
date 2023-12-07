import {
  GetAll,Get,Create,checkMember,Update,Delete
} from '../services/experienceService.js'

export async function getAllExperience(_req,res){
  try {
    const experiences = await GetAll();
    return res.status(200).json({ status: 200, data: experiences });;
  } catch (err) {
    res.status(500).json({ status: 500, message: "Something went wrong while trying to get all experience"})
  }
}

export async function getExperience(req, res) {
  try {
    const { experienceId } = req.params;
    const experience = await Get(experienceId);
    if (!experience) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No experience found with that ID",
        });
    }
    return res.status(200).json({ status: 200, data: experience });;
  } catch (err) {
    res.status(500).json({ status: 500, message: "Something went wrong while trying to get Experience"})
  }
}

export async function createExperience(req,res){
   try {
    const experienceBody = req.body;
    const member = await checkMember(experienceBody.memberId);
    if(!member){
      return res.status(404).json({ status: 404, message:"member not found"});
    }
    const experience  = await Create(experienceBody);
    //
    return res.status(201).json({status:201,data:experience});

   } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to create a new experience",
    });
   }
}

export async function updateExperience(req,res){
  try {
    const {experienceId} = req.params;
    const experience = req.body;
    if(experience.memberId){
    const member = await checkMember(experience.memberId);

    if (!member) {
      return res.status(404).json({ status: 404, message: "not exist member" });
    }}
    const updatedExperience = await Update(
      experienceId,
      experience
    );
    return res.status(200).json({ status: 200, data: updatedExperience});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to update the experience",
    });
  }
}

export async function deleteExperience(req,res){
try {
  const {experienceId} = req.params;
  const deletedExperience = await Delete(experienceId);
  if(!deletedExperience){return res.status(404).json({status: 404, message:"experience not found to delete"});}
  return res.status(201).json({status: 201, data:null});
} catch (err) {
  console.error(err);
    return res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to delete the experience",
    });
}
}