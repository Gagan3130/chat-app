export const AppConfig = {
    // baseUrl: 'http://localhost:5050',
    baseUrl: 'https://chat-app-api-d48e.onrender.com',
    cloudBaseUrl:"https://api.cloudinary.com",
    endpoints: {
     user: '/api/user',
     login: '/api/user/login',
     uploadImage: '/v1_1/dprc0e2sm/image/upload',
     profile: '/api/user/profile',
     chats: '/api/chat',
     groupChats: {
       create: '/api/chat/group-chat',
       remove: '/api/chat/remove-group' 
     },
     message: '/api/message'
    }
}