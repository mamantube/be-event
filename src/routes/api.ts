import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/auth/register",
    /**
         #swagger.requestBody = {
           required: true,
           schema: {$ref: "#/components/schemas/RegisterRequest"}
          }
     */
         authController.register);
router.post("/auth/login",
    /**
         #swagger.requestBody = {
           required: true,
           schema: {$ref: "#/components/schemas/LoginRequest"}
          }
     */
         authController.login);
router.get("/auth/me", authMiddleware, authController.me);

export default router;