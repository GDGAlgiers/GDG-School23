import { findMember } from '../services/memberService.js';
import {GetAll,Get,Delete,Update,Create} from '../services/problemReport.service.js';
import { notifyComanagersAfterReport } from '../utils/notifyTriggers.js';

export async function getAllProblemReportsController(req, res) {
    try {
        const problemReports = await GetAll();
        return res.status(200).json({ status: 200, data: problemReports});
    } catch (error) {
        return res.status(500).json({status:500,message:"something went wrong"});
    }
}

export async function getProblemReportByIdController(req, res) {
    try {
        const id = req.params.id;
        const problemReport = await Get(id);
        if(!problemReport) return res.status(404).send({message:"problem report not found",status:404});
        return res.status(200).json({ status: 200, data: problemReport});
    } catch (error) {
        return res.status(500).json({status:500,message:"something went wrong"});
    }
}

export async function createProblemReportController(req, res) {
    try {
        const problemReport = req.body;
        const member =await findMember(problemReport.memberId);
        if (!member) return res.status(404).json({status:404,message:"no member was found with that id"});
        const newProblemReport = await Create(problemReport);
        notifyComanagersAfterReport(problemReport)
        return res.status(201).json({ status: 201, data: newProblemReport});
    } catch (error) {
        return res.status(500).json({status:500,message:"something went wrong"});
    }
  
}

export async function updateProblemReportController(req, res) {
    try {
        const id = req.params.id;
        const updatedProblemReport = req.body;
        if(updatedProblemReport.memberId){
        const member = await findMember(updatedProblemReport.memberId);
        if (!member) return res.status(404).json({status:404,message:"no member was found with that id"});
        }
        const result = await Update(id, updatedProblemReport);
        if(!result) return res.status(404).json({status:404,message:"problem report not found"});
        return res.status(200).json({ status: 200, data: result});
    } catch (error) {
        return res.status(500).json({status:500,message:"something went wrong"});
    }
}

export async function deleteProblemReportController(req, res) {
    try {
        const id = req.params.id;
        const deleted = await Delete(id);
        if(!deleted) return res.status(404).json({status:404,message:"problem report not found"});
        return res.status(204).json({status:204,message:"problem report deleted"});
    } catch (error) {
        return res.status(500).json({status:500,message:"something went wrong"});
    }
}
