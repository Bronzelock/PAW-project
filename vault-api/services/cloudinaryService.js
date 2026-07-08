const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'raw',
            public_id: `models/${originalName}`
        },
        (error, result) => {
            if (error) {
                console.error('Cloudinary upload stream error:', error);
                return reject(error);
            }
            resolve(result);
        });
        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (cloudinaryId) => {
    try {
        if (!cloudinaryId) return null;

        console.log(`Attempt to delete file with public_id: ${cloudinaryId}`);

        const result = await cloudinary.uploader.destroy(cloudinaryId, { resource_type: 'raw' });
        return result;

    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};
module.exports = {uploadToCloudinary, deleteFromCloudinary};