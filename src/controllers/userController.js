import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import passport from "../config/passport.js";

const userController = express.Router();

userController.post("/users", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      const error = new Error("email, name, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.createUser({ email, name, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/session-login",
  auth.validateEmailAndPassword,
  passport.authenticate("local"),
  (req, res) => {
    res.json(req.user);
  },
);

userController.post(
  "/token/refresh",
  passport.authenticate("refresh-token", { session: false }),
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { id } = req.user;

      const { newAccessToken, newRefreshToken } =
        await userService.refreshToken(id, refreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return next(error);
    }
  },
);

userController.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res, next) => {
    const accessToken = userService.createToken(req.user);
    const refreshToken = userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  },
);

userController.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// TODO: GET /auth/kakao/callback 엔드포인트 추가.

// TODO: GET /auth/kakao 엔드포인트 추가.
export default userController;
