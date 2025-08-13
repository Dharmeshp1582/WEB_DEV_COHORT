import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// create a new user
const registerUser = async (req, res) => {
  // get data from request
  const { name, email, password } = req.body;

  // validate
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log(verificationToken);

    // create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    console.log("Created User:", user);
    console.log("Email field in user:", user.email);

    // send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Please click on the following link to verify your email:\n${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      success: false,
    });
  }
};

// Verify
const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "shhhhh",
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export { registerUser, verifyUser, login };
