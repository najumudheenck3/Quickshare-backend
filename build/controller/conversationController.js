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
exports.getConversation = exports.postNewConversation = void 0;
const conversationModel_1 = __importDefault(require("../model/conversationModel"));
//new conversation
const postNewConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'kkkkkkkkk');
    const newConversation = new conversationModel_1.default({
        members: [req.body.senderId, req.body.recieverId]
    });
    try {
        const savedConversation = yield newConversation.save();
        res.json({ savedConversation, message: "new conversation", success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postNewConversation = postNewConversation;
//get conversation of a user
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield conversationModel_1.default.find({
            members: { $in: [req.params.userId] }
        });
        res.json({ conversation, message: "new conversation", success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getConversation = getConversation;
