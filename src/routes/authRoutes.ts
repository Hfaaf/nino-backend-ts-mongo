import { Router } from "express";
import authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/auth";
import { allowRoles } from "../middlewares/role";

const router = Router();

router.get("/admin-only", authMiddleware, allowRoles("admin"), (req, res) => {
  res.json({ message: "Acesso autorizado: admin" });
});

router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

export default router;
