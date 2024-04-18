export type User = {
    id: string;
    name: string;
    email: string;
    pic: string;
}

export type Chat = {
    isGroupChat: boolean;
    chatName: string;
    id: string;
    users: User[];
    latestMessage: Message;
    groupAdmin: User;
    unreadCount: number
}

export type Message = {
    sender: User;
    content: string;
    chat: Chat;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    readBy: User[]
}