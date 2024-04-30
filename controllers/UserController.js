import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(pass, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      password: encryptedPass,
      avatarURL: req.body.avatarURL,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не зарегистрирован",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );
    if (!isValidPass) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if(user) {
      res.json({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatarURL,
      });
    } else {
      res.json({
        message: 'Пользователь не найден'
      })
    }

    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
}