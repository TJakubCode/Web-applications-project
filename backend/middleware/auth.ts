import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  username: string;
  role: string;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expect header: "Bearer TOKEN"

  try {
    (req as any).user = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
