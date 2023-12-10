import { GetMembersActivity, memberOfTheMonth } from "../services/membersActivityService.js"

export async function getMembersActvityController(req, res) {
    try {
        const membersActivity = await GetMembersActivity()
        return res.status(200).json(membersActivity)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetshing the members activity.' });
    }
    
}

export async function getMemberOfTheMonth(req,res){
    try {
        const membersActivity = await memberOfTheMonth()
        return res.status(200).json(membersActivity)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetshing the members activity.' });
    }
}