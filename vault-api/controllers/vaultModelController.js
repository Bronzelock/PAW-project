const VaultModel = require('../models/VaultModel');

const addModel = async (req, res) => {
    try {
        const {title, description, fileUrl} = req.body;
        if (!title || !fileUrl) {
            return res.status(400).json({error: 'Title and Url of a model are required!'});
        }
        const loggedUserId = req.user.userId;

        const newModel = new VaultModel({
            title,
            description,
            fileUrl,
            userId: loggedUserId,
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
};

const deleteModel = async (req, res) => {
    try {
        const modelId = req.params.id;
        const loggedUserId = req.user.userId;
        const modelToDelete = await VaultModel.findById(modelId);
        if (!modelToDelete) {
            return res.status(404).json({error: 'Model not found'});
        }
        if (!modelToDelete.userId.equals(loggedUserId)) {
            return res.status(403).json({error: 'Unathorized access for this action'});
        }
        await VaultModel.findByIdAndDelete(modelId);
        return res.status(200).json({message: 'Model successfully removed'});

    } catch (error) {
        console.error('Delete error: ', error);
        return res.status(500).json({error: 'Server error while deleting a model'});
    }
};

const viewModelById = async (req, res) => {
    try {
        const modelId = req.params.id;

        const modelToShow = await VaultModel.findById(modelId).populate('userId', 'email');

        if (!modelToShow) {
            return res.status(404).json({ error: 'Model not found' });
        }

        return res.status(200).json(modelToShow);
    } catch (error) {
        console.error('View single model error:', error);
        return res.status(500).json({ error: 'Server error while fetching the model' });
    }
};
module.exports = {addModel, viewModels, deleteModel, viewModelById};