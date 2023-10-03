const { chats } = require('../dummyData/chats');
const { roomModal, chatModal } = require('../models');
const { login, getAllUser } = require('./user');
const mongoose = require('mongoose');
const { jwtVerifyForAdminSocket } = require('../middleware/index');

exports.getChats = async (req) => {
    try {
        const { id } = req.params;
        if (id) {
            return {
                success: true,
                message: 'chats fetched successfully.',
                data: chats.filter(ele => ele._id === id)
            }
        } else {
            return {
                success: true,
                message: 'chats fetched successfully.',
                data: chats
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.addOrGetRoomWithChats = async (user, userId) => {
    try {
        const arr = [mongoose.Types.ObjectId(user._id), mongoose.Types.ObjectId(userId)];
        const findExistingRoom = await roomModal.findOne({ users: { $all: arr } });
        console.log('?????????????????????????????????????/', findExistingRoom);
        if (!findExistingRoom) {
            const createRoom = await roomModal.create({
                name: `${user._id}-${userId}`,
                users: arr,
                type: 'single'
            });
            console.log('>>>>>>>>>>>createRoom>>>>>>>>>>>>>>>>', createRoom);
            return { roomid: createRoom._id.toString(), messages: [] };
        } else {
            const abc = await chatModal.findOne({ roomId: mongoose.Types.ObjectId(findExistingRoom._id) }).select({ message: 1 });
            // console.log('>>>>>>>>>>>abc>>>>>>>>>>>>>>>>', JSON.stringify(abc));
            return { roomid: findExistingRoom._id.toString(), messages: abc?.message.reverse() || [] };
        }
    } catch (error) {
        throw error;
    }
}

exports.addChat = async (roomId, userId, message) => {
    try {
        const findChatBox = await chatModal.findOne({ roomId: mongoose.Types.ObjectId(roomId) });
        if (!findChatBox) {
            const createChatBox = await chatModal.create({
                roomId: mongoose.Types.ObjectId(roomId),
                message: [{
                    sender: mongoose.Types.ObjectId(userId),
                    message
                }],
                totalMessages: 1
            });
            console.log('>>>>>>>>>>>createChatBox>>>>>>>>>>>>>>>>', createChatBox);
            return true;
        } else {
            const updateChatBox = await chatModal.updateOne(
                { roomId: mongoose.Types.ObjectId(roomId) },
                {
                    $inc: { totalMessages: 1 },
                    $push: {
                        message:
                        {
                            sender: mongoose.Types.ObjectId(userId),
                            message,
                            timestamp: new Date()
                        }
                    }
                }, { new: true });

            // await chatModal.updateOne({ roomId: mongoose.Types.ObjectId(roomId) }, { $inc: { totalMessages: 1 } });
            console.log('>>>>>>>>>>>updateChatBox>>>>>>>>>>>>>>>>', updateChatBox);
            console.log('>>>>>>>>>>>findChatBox>>>>>>>>>>>>>>>>', findChatBox);
            return true;
        }
    } catch (error) {
        throw error;
    }
}
exports.SocketProcess = (io) => {
    io.on('connection', (socket) => {
        console.log(`user connected to => ${socket.id}`);

        socket.on('authenticate', async (userDetails) => {
            const userLogin = await login(userDetails);
            if (userLogin.success) {
                socket.emit('successLogin', userLogin);
                const userList = await getAllUser({ admin: { _id: userLogin.data.userInfo._id } });
                socket.broadcast.emit('userLogin', userList.data);
            }
        });
        socket.on('joinRoom', async ({ token, userId }) => {
            const user = {};
            jwtVerifyForAdminSocket(token, user);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>', user);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>', userId);
            const userRoomId = await this.addOrGetRoomWithChats(user, userId);
            console.log('>>>>>>>>>>userRoomId>>>>>>>>>>>>>>>>>', userRoomId);
            socket.join(userRoomId.roomid);
            socket.emit('roomidCreated', { roomId: userRoomId.roomid, prevChats: userRoomId.messages });
            // console.log(`Socket room connected on room id :- ${roomId}`);
        });
        socket.on('sendMessage', async (data) => {
            console.log(data, '-------------', data.roomId);
            const user = {};
            jwtVerifyForAdminSocket(data.token, user);
            await this.addChat(data.roomId, user._id, data.message);
            socket.broadcast.emit('reciviedMessage', { message: data.message || '' });
            // socket.to(data.roomId).emit('reciviedMessage', { message: data.message || '' });
        });
    });
}