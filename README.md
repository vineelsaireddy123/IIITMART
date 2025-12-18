# Project Setup

This project consists of a **frontend** and a **backend**. Follow the steps below to set up and run both simultaneously.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [npm](https://www.npmjs.com/)

## Setup and Installation

### 1. Download the Zip and extract it 



### 2. Install `concurrently`

```bash
npm install concurrently --save-dev
```

### 3. Install dependencies for both frontend and backend

```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 4. Add the `dev` script in the root `package.json`

Open `package.json` in the root directory and add the following inside the `"scripts"` section:

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\""
}
```

### 5. Start the Project

Run the following command from the root directory to start both frontend and backend simultaneously:

```bash
npm run dev
```

---

## Troubleshooting

- Ensure you are in the correct directory before running commands.
- If `npm run dev` fails, verify that both `frontend` and `backend` have valid `package.json` files.
- If dependencies are missing, run `npm install` inside both `frontend` and `backend` directories.

---