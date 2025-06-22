# Chat 122333

A simple, anonymous web chat application built with Firebase Realtime Database and vanilla JavaScript.

## Features

- Anonymous username generation
- Real-time messaging using Firebase
- Online user count display
- Responsive and modern UI
- System messages for user join/leave events

## Project Structure

```
src/
  index.html        # Main chat UI
  404.html          # Custom 404 page
  styles.css        # App styles
  script.js         # Chat logic (Firebase, UI, etc.)
firebase.json       # Firebase hosting and database config
database.rules.json # Firebase Realtime Database security rules
.firebaserc         # Firebase project alias
.github/
  workflows/        # GitHub Actions for CI/CD
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for Firebase CLI)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/chat-122333.git
   cd chat-122333
   ```

2. **Install Firebase CLI (if not already):**
   ```sh
   npm install -g firebase-tools
   ```

3. **Login to Firebase:**
   ```sh
   firebase login
   ```

4. **Serve locally:**
   ```sh
   firebase serve
   ```
   or
   ```sh
   firebase emulators:start
   ```

5. **Open [http://localhost:5000](http://localhost:5000) in your browser.**

### Deploy

To deploy to Firebase Hosting:

```sh
firebase deploy
```

## Customization

- Edit `src/styles.css` to change the look and feel.
- Update `src/script.js` for chat logic or username generation.
- Modify `database.rules.json` to adjust database security.

## Security

- The current database rules allow read/write until 2100. For production, update `database.rules.json` for stricter access control.

## License

MIT

---

Made with ❤️ using [Firebase](https://firebase.google.com/)
