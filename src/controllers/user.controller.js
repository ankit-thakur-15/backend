import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler( async (req , res) =>{
//     res.status(200).json({
//         message: "ok"
//     })
// })

const registerUser = asyncHandler(async (req, res) => {
  // 1. get users details from frontend
  // 2. validation - not empty
  // 3. check if user already exist: username , email
  // 4. check for images , check for avatar
  // 5. upload them to cloudinary , avatar
  // 6. create user object - create entry in db
  // 7. remove password and refresh token field from response
  // 8. check for user creation
  // 9. return response

  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  const { fullName, email, userName, password } = req.body || {}; // 1.
  console.log("email:", email);

  // if (fullName === ""){                                     // 2.
  //     throw new ApiError(400, "full name is required")
  // }
  // if (email === ""){
  //     throw new ApiError(400, "email is required")
  // }
  // if (userName === ""){
  //     throw new ApiError(400, "user name is required")
  // }
  // if (password === ""){
  //     throw new ApiError(400, "password is required")
  // }

  if (
    [fullName, email, userName, password].some((field) =>!field || field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUSer = await User.findOne({         // 3.we import User here because this will directly contanct with database . how it will contact - because it is made with the help of mongoose
    $or: [{ userName }, { email }],
  });
  if (existedUSer) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; // 4.
  // const coverImageLocalPath = req.files?.coverImage[0]?.path ;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); // 5.
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar files is required");
  }

  const user = await User.create({         // 6.
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(   // 7.
    "-password -refreshToken"
  );

  if (!createdUser) {
    // 8.
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res.status(201).json(
    // 9.
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

export { registerUser };
