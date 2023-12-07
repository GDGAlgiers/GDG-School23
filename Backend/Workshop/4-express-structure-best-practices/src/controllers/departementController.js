import { Create, GetAll,Get,Update,Delete, memberCountEachDep } from "../services/departementService.js";

export async function getAllDepartements(_req, res) {
  try {
    const departments = await GetAll();
    return res.status(200).json({ status: 200, data: departments });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to get all the departements",
      });
  }
}

export async function getDepartement(req,res){
  try {
    const {depName} = req.params

    const departement = await Get(depName);
    if(!departement){
      return res.status(404).json({status:404,message:"no departement found with that name"})
    }
    return res.status(200).json({ status: 200, data: departement });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to get departement",
      });
  }
}

export async function createDepartement(req,res){
  try {
    const deparatementBody= req.body
    const departement = await Create(deparatementBody);
    if(!departement) return res.status(400).json({status:400,message:"this name is already in use"})
    return res.status(201).json({ status: 201, data: departement });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to create a new departement",
      });
  }
}

export async function updateDepartement(req,res){
  try {
    const {depName} = req.params
    const deparatement= req.body 
    const checkDep = await Get(deparatement.depName)
    if(checkDep) return res.status(400).json({status:400,message:"this name is already in use"})
    const Departement = await Update(depName,deparatement);
    if(!Departement) return res.status(404).json({status:404,message:"no departement found with that name"})
    return res.status(200).json({ status: 200, data: Departement  });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to update the departement",
      });
  }
}

export async function deleteDepartement(req,res){
  try {
    const {depName} = req.params
    const deletedDepartement = await Delete(depName);
    if(!deletedDepartement) return res.status(404).json({status:404,message:"no departement found with that name"})
    return res.status(204).json({ status: 204, data: null });
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({
        status: 500,
        message: "something went wrong while trying to delete the departement",
      });
  }
}

export async function getDepartementsWithMembersCount(req,res){
  try{
const departements = await memberCountEachDep()
return res.status(200).json({data:departements})
  }catch(err){
    console.error(err);
    return res.status(500).json({message:"something went wrong"})
  }
}