import { GetAll } from '../services/taskReportService.js'

export async function getTasksReport(req, res) {
    try {
        const tasksReport = await GetAll()
        return res.status(200).json({data:tasksReport})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetshing Tasks Report.' });
    }
}


