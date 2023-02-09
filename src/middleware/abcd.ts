
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import userModel from "../model/userModel";

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
      async (err: object | null, decoded: object | undefined) => {
        if (err) {
          console.log(err);

          return res.status(401).send({
            message: "auth faiaed",
            success: false,
          });
        } else {
          const { id } = decoded as ITokenPayload;
          req.body.userIdd = id;
          let user = await userModel.findById(id);
          console.log(req.body.userIdd, user, "kkkk");
          if (!user?.isActive) {
            return res.json({
              message: "admin blocked you",
              sucess: false,
            });
          }
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
