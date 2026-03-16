//  goal of this file is : file mere pass aayengi file system ke through, yaani ki server pe already upload hogyi hai.
//      but ye koi bhi service use karega toh mujhe local file ka path dega.
//     local file se mera mtlv hai jo bhi file mere server pe jaa chuki hai

//     server se aap mujhe localpath doge ->or me us file ko cloudinary pe daal dunga

import { v2 as cloudinary } from "cloudinary";
import { fs } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        // file has been uploaded successfully then
        console.log("file is uploaded on cloudinary",response.url);
        return response ;
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}
