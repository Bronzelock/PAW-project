const VaultModel = require('../models/VaultModel');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

const addModel = async (req, res) => {
    try {
        const {title, description} = req.body;
        if (!title) {
            return res.status(400).json({error: 'Title of a model is required'});
        }
        if (!req.file) {
            return res.status(400).json({error: 'No 3D file uploaded'});
        }
        const loggedUserId = req.user.userId;

        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        const fileUrl = cloudinaryResult.secure_url;

        let finalStatus = 'pending';
        let volume = 0;
        let dimensions = '';

        try {
            const goResponse = await fetch('http://localhost:8080/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileUrl: fileUrl })
            });

            if (goResponse.ok) {
                const goData = await goResponse.json();
                volume = goData.volume;
                dimensions = goData.dimensions;
                finalStatus = 'analyzed';
            } else {
                console.warn('Go server encountered an error, status set to pending');
            }
        } catch (goError) {
            console.error('Connection error with go server:', goError.message);
        }

        const newModel = new VaultModel({
            title,
            description,
            fileUrl: cloudinaryResult.secure_url,
            cloudinaryId: cloudinaryResult.public_id,
            userId: loggedUserId,
            status: finalStatus,
            volume,
            dimensions
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
        if (modelToDelete.fileUrl) {
            await deleteFromCloudinary(modelToDelete.cloudinaryId);
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