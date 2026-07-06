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
            public_id: `models/${Date.now()}_${originalName}`
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

module.exports = {uploadToCloudinary};