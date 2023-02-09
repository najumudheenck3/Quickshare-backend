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
exports.getMessage = exports.addMessage = void 0;
const messageModel_1 = __importDefault(require("../model/messageModel"));
//add
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new messageModel_1.default(req.body);
    try {
        const saveMessage = yield newMessage.save();
        res.json({ saveMessage, message: "new message saved successfully", success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.addMessage = addMessage;
//get
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMessages = yield messageModel_1.default.find({
            coversationId: req.params.conversationId
        });
        res.json({ allMessages, message: "all messages fetched successfully", success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMessage = getMessage;
