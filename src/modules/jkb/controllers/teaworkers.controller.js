const dailyHazService = require("../services/teaworkers.service");

const getDailyHazSummary = async (req, res) => {
    try {
        const data = await dailyHazService.getDailyHazSummary();

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch DAILYHAZ summary",
            error: error.message
        });
    }
};

module.exports = {
    getDailyHazSummary
};