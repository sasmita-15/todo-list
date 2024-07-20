import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { List } from "../models/list.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user._id);
    const accessToken = await user.generateAccessToken();
    // console.log(accessToken);
    const refreshToken = await user.generateRefreshToken();
    // console.log(accessToken + " " + refreshToken)

    user.refershToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "some thing went wrong while generating at or rt");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are requied");
  }

  const existedUser = await User.findOne({ username });

  if (existedUser) {
    throw new ApiError(409, "username is present");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "error while registering");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registeres successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { password, username } = req.body;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const user = await User.findOne({ username });
  // console.log(user)

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // console.log(accessToken + " " + refreshToken)
  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refershToken: null,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const addTodo = asyncHandler(async (req, res) => {
  const { todo, description, status, date } = req.body;
  const userId = req.user._id;

  const workImage = req.files?.workImage[0]?.path;
  // console.log(workImage)
  const list = await List.create({
    todo,
    userId,
    description,
    status,
    workImage,
    date,
  });

  if (!list) {
    return new ApiError(500, "error while creating todo");
  }

  const user = await User.findById(userId);

  if (!user) {
    return ApiError(401, "its like you have not logged in");
  }

  user.todo.push(list._id);
  user.save({ validateBeforeSave: false });
  console.log("added successfully")

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "todo created successfully"));
});

const todos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  // console.log(user);
  const todos = user.todo;
  // console.log(todos);

  try {
    const works = await List.find({ _id: { $in: todos } });
    //  console.log(products)
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          works,
        },
        "cart shown successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

const updateTodo = asyncHandler(async (req, res) => {
  const { id, todo, description, status, date } = req.body;

  const updatedTodo = await List.findByIdAndUpdate(
    id,
    { todo, description, status, date },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
});

const removeTodo = asyncHandler(async (req, res) => {
  const id = req.body._id;
  const deletedTodo = await List.findByIdAndDelete(id);

  if (!deletedTodo) {
    throw new ApiError(404, "Todo not found");
  }

  const user = await User.findById(req.user._id);
  user.todo.pull(deletedTodo._id);
  await user.save();
  console.log("deleted successfully")
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo removed successfully"));
});

export { registerUser, loginUser, logoutUser, addTodo, todos, updateTodo, removeTodo };