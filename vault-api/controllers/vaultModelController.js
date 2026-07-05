const VaultModel = require('../models/VaultModel');

const addModel = async (req, res) => {
    try {
        const {title, description, fileUrl} = req.body;
        if (!title || !fileUrl) {
            return res.status(400).json({error: 'Title and Url of a model are required!'});
        }
        const userId = req.user.userId;

        const newModel = new VaultModel({
            title,
            description,
            fileUrl,
            userId,
            status: 'pending'
        });
        await newModel.save()
        return res.status(201).json({message: 'Model created succeessfully'});
    } catch (error) {
        console.error('Creation error:', error)
        return res.status(500).json({error: 'Server error during creating model'});
    }
};
const viewModels = async (req, res) => {
    try {
        const {title} = req.query;
        let queryFilter = {};
        if (title) {
            queryFilter.title = {$regex: title, $options: 'i'};
        }
        const modelsToShow = await VaultModel.find(queryFilter).populate('userId', 'email');
        return res.status(200).json(modelsToShow);
    } catch (error) {
        console.error('View error: ', error);
        return res.status(500).json({error: 'Server error while fetching models'});
    }
}
module.exports = {addModel, viewModels};