const firebaseConfig = {
    apiKey: "AIzaSyBhvgoyT--EWDRpU6QtOeNPOZcCruvYzPs",
    authDomain: "chat-122333.firebaseapp.com",
    databaseURL: "https://chat-122333-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-122333",
    storageBucket: "chat-122333.firebaseapp.com",
    messagingSenderId: "610197425935",
    appId: "1:610197425935:web:8848ea9e5378ed0bd2f87a",
    measurementId: "G-RX5Z97DYP8"
};

let users = new Set();
let database = null;
let userRef = null;
let messagesRef = null;
let usersRef = null;
let onlineCountDisplay = null;
let messagesContainer = null;
let userId = null;
let username = null;
const usernameKey = 'username';

document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('username');
    onlineCountDisplay = document.getElementById('onlineCount');
    messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    userId = 'user_' + Math.random().toString(36).substring(2, 11);
    const storedUsername = localStorage.getItem(usernameKey);

    if (storedUsername) {
        username = storedUsername;
    } else {
        username = generateUsername();
        localStorage.setItem(usernameKey, username);
    }

    usernameDisplay.textContent = username;

    initializeFirebaseChat();

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (userRef) {
            userRef.remove();
        } else {
            addSystemMessage(`${username} left the chat`);
        }
    });
});

function generateUsername() {
    const adjectives = ['Swift', 'Bright', 'Cool', 'Smart', 'Quick', 'Bold', 'Wise', 'Kind', 'Epic', 'Star'];
    const nouns = ['Tiger', 'Eagle', 'Wolf', 'Fox', 'Bear', 'Lion', 'Owl', 'Hawk', 'Shark', 'Dragon'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}

function initializeFirebaseChat() {
    try {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase initialized successfully');

        messagesRef = database.ref('messages');
        usersRef = database.ref('users');
        userRef = usersRef.child(userId);

        userRef.set({
            username: username,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log('User registered successfully');
        }).catch((error) => {
            console.error('Error registering user:', error);
        });

        // Remove user when they leave
        userRef.onDisconnect().remove();

        // Listen for online users
        usersRef.on('value', (snapshot) => {
            const firebaseUsers = snapshot.val();
            const count = firebaseUsers ? Object.keys(firebaseUsers).length : 0;
            onlineCountDisplay.textContent = count > 0 ? ` • ${count} user(s) online` : '';
        });

        // Listen for messages
        messagesRef.on('value', (snapshot) => {
            const firebaseMessages = snapshot.val();
            messagesContainer.innerHTML = '';

            if (firebaseMessages) {
                const messagesList = Object.entries(firebaseMessages)
                    .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

                messagesList.forEach(([, message]) => {
                    message.isOwn = message.userId === userId;
                    addMessageToUI(message);
                });
            }

            scrollToBottom();
        });

        // Enable input
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();

    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addMessageToUI(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.isOwn ? 'own' : 'other'}`;

    const msgDate = new Date(message.timestamp);
    const now = new Date();

    const isToday =
        msgDate.getDate() === now.getDate() &&
        msgDate.getMonth() === now.getMonth() &&
        msgDate.getFullYear() === now.getFullYear();

    let timeString;
    if (isToday) {
        timeString = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        const dateString = msgDate.toLocaleDateString();
        const timePart = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeString = `${dateString} ${timePart}`;
    }

    messageDiv.innerHTML = `
        ${!message.isOwn ? `<div class="message-sender">${escapeHtml(message.username)}</div>` : ''}
        <div class="message-text">${escapeHtml(message.text)}</div>
        <div class="message-time">${timeString}</div>
    `;

    messagesContainer.appendChild(messageDiv);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;

    if (messagesRef) {
        messagesRef.push({
            text: text,
            username: username,
            userId: userId,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log('Message sent successfully');
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }

    messageInput.value = '';
    messageInput.focus();
}