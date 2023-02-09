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
exports.fetDashboardDetails = exports.getAllNotification = exports.changeUserStatus = exports.getAllUsers = exports.loginAdmin = void 0;
const adminModel_1 = __importDefault(require("../model/adminModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const admin = yield adminModel_1.default.findOne({ email: email });
        console.log(admin, "admindetailssss");
        if (!admin) {
            return res
                .status(400)
                .json({ message: "Invalid Credddentials", success: false });
        }
        const isMatch = yield bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid Credttenggftials", success: false });
        }
        //generate token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            //expire the token within
            expiresIn: "1d",
        });
        res
            .status(200)
            .json({
            message: "SignIn Successfully",
            success: true,
            data: token,
            admin: admin.name,
        });
    }
    catch (error) { }
});
exports.loginAdmin = loginAdmin;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("adminlogindata");
        const allUsers = yield userModel_1.default.find({});
        res.status(200).send({
            message: "Users fetched successfully",
            success: true,
            data: allUsers,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in fetching users",
            success: false,
            error,
        });
    }
});
exports.getAllUsers = getAllUsers;
const changeUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "blocking iddd");
        const userId = req.body.userId;
        console.log(userId);
        const user = yield userModel_1.default.findById({ _id: userId });
        console.log(user, "blockign user");
        if (user) {
            if (user.isActive) {
                console.log(user, "blocki1111gn user");
                user.isActive = false;
            }
            else {
                console.log(user, "blocki2222gn user");
                user.isActive = true;
            }
            yield user.save();
        }
        const users = yield userModel_1.default.find({});
        res.status(200).send({
            message: "Users-status change successfully",
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in fetching users",
            success: false,
            error,
        });
    }
});
exports.changeUserStatus = changeUserStatus;
const getAllNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const admin = yield adminModel_1.default.find({ username: "admin" }).populate('notification.userId', { firstName: 1, lastName: 1, _id: 1, profileImage: 1 });
        if (admin) {
            console.log((_a = admin[0]) === null || _a === void 0 ? void 0 : _a.notification, 'notifications');
            res.status(200).send({ success: true, data: (_b = admin[0]) === null || _b === void 0 ? void 0 : _b.notification });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllNotification = getAllNotification;
const fetDashboardDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield userModel_1.default.find({}).count();
        const activeCount = yield userModel_1.default.find({ isActive: true }).count();
        console.log(activeCount, 'userCountuserCount');
        res.status(200).send({
            message: "all datas fetched successfully",
            success: true,
            userCount: userCount,
            activeCount: activeCount,
        });
    }
    catch (error) {
    }
});
exports.fetDashboardDetails = fetDashboardDetails;
