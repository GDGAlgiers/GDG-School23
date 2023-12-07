
import {
  Create,
  GetAll,
  Get,
  Update,
  Delete,
  checkMember,
} from "../services/memberfeedbackService.js";


export async function getAllFeedbackMembers(_req, res) {
  try {
    const memberfeedbacks = await GetAll();
    return res.status(200).json({ status: 200, data: memberfeedbacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while trying to get all member feedbacks",
    });
  }
}

export async function getFeedbackMember(req, res) {
  try {
    const { feedbackMemberId } = req.params;

    const memberfeedback = await Get(feedbackMemberId);
    if (!memberfeedback) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No member feedback found with that ID",
        });

    }
    return res.status(200).json({ status: 200, data: memberfeedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while trying to get member feedback",
    });
  }
}

export async function createFeedbackMember(req, res) {
  try {
    const memberfeedbackBody = req.body;
    const member = await checkMember(memberfeedbackBody.memberId);

    if (!member) {
      return res.status(404).json({ status: 404, message: "not exist member" });
    }

    const coManager = await checkMember(memberfeedbackBody.comanagerId);

    if (!coManager) {
      return res
        .status(400)
        .json({ status: 400, message: "not exist Co Manager" });
    }

    if (coManager.role === "member") {
      return res
        .status(400)
        .json({ status: 400, message: "only coManager can give feedback" });
    }

    const memberfeedback = await Create(memberfeedbackBody);

    return res.status(201).json({ status: 201, data: memberfeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to create a new member feedback",
    });
  }
}

export async function updateFeedbackMember(req, res) {
  try {
    const { feedbackMemberId } = req.params;
    const memberfeedback = req.body;
    const member = await checkMember(memberfeedback.memberId);

    if(memberfeedback.memberId){

      if (!member) {
        return res.status(404).json({ status: 404, message: "not exist member" });
      }
    }

    if(memberfeedback.comanagerId){
      const coManager = await checkMember(memberfeedback.comanagerId);

      if (!coManager) {
        return res.status(404).json({ status: 400, message: "not exist Co Manager" });
      }
  
      if (coManager.role === "member") {
        return res.status(400).json({ status: 400, message: "only coManager can give feedback" });
      }
    }

    const updatedMemberFeedback = await Update(
      feedbackMemberId,
      memberfeedback
    );
    if (!updatedMemberFeedback) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No member feedback found with that ID",
        });
    }
    return res.status(200).json({ status: 200, data: updatedMemberFeedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to update the member feedback",
    });
  }
}

export async function deleteFeedbackMember(req, res) {
  try {
    const { feedbackMemberId } = req.params;
    const deletedMemberFeedback = await Delete(feedbackMemberId);
    if (!deletedMemberFeedback) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No member feedback found with that ID",
        });

    }
    return res.status(204).json({ status: 204, data: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message:
        "Something went wrong while trying to delete the member feedback",
    });
  }
}

