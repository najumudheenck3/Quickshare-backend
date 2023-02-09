"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const userModel_1 = __importDefault(require("../model/userModel"));
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({
                message: "auth failaed",
                success: false,
            });
        }
        const [, token] = authHeader.split(" ");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    message: "auth faiaed",
                    success: false,
                });
            }
            else {
                const { id } = decoded;
                req.body.userIdd = id;
                let user = yield userModel_1.default.findById(id);
                console.log(req.body.userIdd, user, "kkkk");
                if (!(user === null || user === void 0 ? void 0 : user.isActive)) {
                    return res.json({
                        message: "admin blocked you",
                        sucess: false,
                    });
                }
                next();
            }
        }));
    }
    catch (error) {
        return res.status(401).send({
            message: "auth faileed",
            success: false,
        });
    }
});
