import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import User from "../models/user-model"

interface JwtPayload {
  _id: string;
}

// Extend the Request interface to include a user property
export interface AuthRequest extends Request {
  user: string;
}

// Auth middleware function
export const authenticationMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
  try {
      const { authorization } = request.headers; // Extract authorization header

      if (!authorization) {
          return response.status(401).json({ error: "Auth Is Required" }); // If no token, return 401
      }

      const token = authorization; // Extract token from authorization header
      const tokenPayload = jwt.verify(token, "express") as JwtPayload; // Verify token and assert its type

      // Check if _id exists on the payload
      if (tokenPayload && tokenPayload._id) {
          const existingUser = await User.findOne({ _id: tokenPayload._id }); // Find user by _id from payload

          if (existingUser) {
              request.user = existingUser.id; // Set user ID on request object
              next(); // Proceed to the next middleware
          } else {
              return response.status(404).json({ error: "User not found" }); // If user not found, return 404
          }
      } else {
          return response.status(400).json({ error: "Invalid token payload" }); // If payload is invalid, return 400
      }

  } catch (error) {
      console.log("Error In Auth Middleware", error); // Log the error for debugging
      return response.status(500).send("Internal Server Error"); // Return 500 for server errors
  }
};
