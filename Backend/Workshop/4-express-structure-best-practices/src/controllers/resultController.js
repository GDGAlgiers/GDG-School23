import {Update,GetAll,Get,Delete,Create} from "../services/resultService"

export async function getAllResults(req,res){

    try{
        const response= await GetAll();
        res.status(200).send(response)


    }catch(err){

        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
export async function getResult(req,res){

    try{
        const {request}=req.params
        const response =  await Get(request)
        if(!response){
            return res.status(404).json({

                message:"Error, Result with the provided ID is not found"
            })
        }
        res.status(200).send(response)

    }catch(err){

        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
export async function updateResult(req,res){

    try{
    



    }catch(err){

        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
export async function createResult(req,res){

    try{

//should send 201
    }catch(err){

        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
export async function deleteResult(req,res){

    try{
        const {target}=req.params
        const deletion=await Delete(target)   
        if(deletion) return res.status(204).send("success")
        else return res.status(404).json({
    message:"No result found with the provided ID"
        })
    }catch(err){

        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}