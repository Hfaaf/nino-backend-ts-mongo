import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos

function generateToken(user: any) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );
}

export default {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (user.isLocked()) {
      const remaining = (user.lockUntil! - Date.now()) / 1000;
      return res.status(403).json({ message: `Usuário bloqueado. Tente novamente em ${remaining.toFixed(0)}s` });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(403).json({ message: "Usuário bloqueado por tentativas excessivas" });
      }

      await user.save();
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    // reset de logar
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);

    return res.json({
      message: "Login bem-sucedido",
      token,
      role: user.role
    });
  },

  async logout(req: Request, res: Response) {
    return res.json({ message: "Logout efetuado" });
  }
};