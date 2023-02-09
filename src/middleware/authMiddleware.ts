const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

module.exports = async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const authHeader = req.headers.authorization; 
    
    interface ITokenPayload {
      iat: number;
      exp: number;
      id: string;
    }
    if (!authHeader) {
      return res.status(401).send({
        message: "auth failaed",
        success: false,
      });
    }
    const [, token] = authHeader.split(" ");
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: object | null, decoded: object | undefined) => {
        if (err) {
          console.log(err);
          
          return res.status(401).send({
            message: "auth faiaed",
            success: false,
          });
        } else {
          const { id } = decoded as ITokenPayload;
          req.body.userIdd = id
          console.log(req.body.userIdd, "kkkk");
          next();
        }
      }
    );
  } catch (error) {
    return res.status(401).send({
      message: "auth faileed",
      success: false,
    });
  }
};
