# 🎓 Smart Student Productivity & Time Management System

> A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** to help students and undergraduates organize their academic goals, manage tasks, and track study sessions - all in one structured backend system.

## 📌 Problem Description

Students and undergraduates frequently struggle with managing their time and academic workload effectively. Common challenges include:

- No structured system to organize personal and academic goals
- Difficulty prioritizing multiple tasks across different modules
- Inability to track how much time is actually spent studying
- Lack of productivity visibility, leading to burnout or missed deadlines

Without a proper system, students often feel overwhelmed, lose focus, and fail to monitor their own progress toward academic success.


## 💡 Proposed Solution

The **Smart Student Productivity & Time Management System** offers a complete backend REST API that empowers students to:

- **Set and manage Goals** — categorized as exam prep, projects, habits, or daily/weekly/monthly targets
- **Break goals into actionable Tasks** — with deadlines, priority levels, and module assignments
- **Log Study/Work Sessions** — tracking duration, mood, and personal notes
- **Monitor their progress** — by filtering tasks and sessions per goal, marking tasks as complete, and reviewing timestamps

This API can power any frontend dashboard or mobile application to give students a unified productivity experience.


## ✨ Features

| Feature | Description |
|---|---|
| Goal Management | Create, read, update, and delete academic goals |
| Task Management | Create and manage tasks linked to specific goals |
| Task Filtering | Retrieve all tasks for a specific goal |
| Task Completion | Mark tasks as complete with auto-recorded timestamp |
| Session Logging | Log study/work sessions with start/end times and mood |
| Session Filtering | Retrieve all sessions for a specific goal |
| Duplicate Check | Prevent duplicate goals (same title + deadline) |
| Input Validation | Enum validation on type, status, priority, and mood fields |
| Error Handling | Consistent error responses for all routes |


## 🛠️ Technologies Used

| Category | Technology |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js (v5) |
| **Database** | MongoDB (via Mongoose ODM v9) |
| **Module System** | ES Modules (`"type": "module"`) |
| **Environment Config** | dotenv |
| **Dev Server** | Nodemon |
| **API Testing** | Postman |
| **Version Control** | Git & GitHub |


## 📁 Project Structure


Student_Productivity_API/
│
├── controllers/
│   ├── goalController.js        # CRUD logic for Goals
│   ├── taskController.js        # CRUD + complete logic for Tasks
│   └── sessionController.js     # CRUD logic for Sessions
│
├── models/
│   ├── goal.js                  # Mongoose schema for Goal
│   ├── task.js                  # Mongoose schema for Task
│   └── session.js               # Mongoose schema for Session
│
├── routes/
│   ├── goalRoutes.js            # Express routes for /api/goals
│   ├── taskRoutes.js            # Express routes for /api/tasks
│   └── sessionRoutes.js         # Express routes for /api/sessions
│
├── .env                         # Environment variables (not committed)
├── .gitignore
├── index.js                     # App entry point
├── package.json
└── README.md
```


## 🔌 API Endpoints

> **Base URL:** `http://localhost:5000`


### 🎯 Goals — `/api/goals`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/goals` | Create a new goal |
| `GET` | `/api/goals` | Retrieve all goals |
| `GET` | `/api/goals/:id` | Retrieve a single goal by ID |
| `PUT` | `/api/goals/:id` | Update a goal by ID |
| `DELETE` | `/api/goals/:id` | Delete a goal by ID |


#### ➕ POST `/api/goals` — Create a Goal

**Request Body:**
```json
{
  "title": "Final Exam Preparation",
  "type": "exam",
  "description": "Prepare for all Semester 4 final exams",
  "deadline": "2026-06-30",
  "priority": "high"
}
```

**Field Rules:**
- `title` — *String, required*
- `type` — *String, required* — must be one of: `exam`, `project`, `habit`, `daily`, `weekly`, `monthly`
- `deadline` — *Date, required*
- `status` — *String, default: `active`* — one of: `active`, `completed`, `paused`
- `priority` — *String, default: `medium`* — one of: `low`, `medium`, `high`

**Success Response (`200`):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "title": "Final Exam Preparation",
  "type": "exam",
  "description": "Prepare for all Semester 4 final exams",
  "deadline": "2026-06-30T00:00:00.000Z",
  "status": "active",
  "priority": "high",
  "createdAt": "2026-05-16T08:00:00.000Z"
}
```

**Duplicate Error Response (`400`):**
```json
{ "message": "Goal already exists." }
```


### ✅ Tasks — `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | Retrieve all tasks |
| `GET` | `/api/tasks/goal/:goalId` | Retrieve all tasks for a specific goal |
| `PUT` | `/api/tasks/:id` | Update a task by ID |
| `PATCH` | `/api/tasks/:id/complete` | Mark a task as complete |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |

#### ➕ POST `/api/tasks` — Create a Task

**Request Body:**
```json
{
  "goalId": "664f1a2b3c4d5e6f7a8b9c0d",
  "title": "Study Chapter 1 - Data Structures",
  "module": "DSA",
  "estimatedMinutes": 90,
  "dueDate": "2026-06-01",
  "priority": "high"
}
```

**Field Rules:**
- `goalId` — *ObjectId (ref: Goal), required*
- `title` — *String, required*
- `module` — *String, optional*
- `estimatedMinutes` — *Number, optional*
- `actualMinutes` — *Number, default: 0*
- `dueDate` — *Date, optional*
- `priority` — *String, default: `medium`* — one of: `low`, `medium`, `high`
- `completed` — *Boolean, default: false*

#### ✔️ PATCH `/api/tasks/:id/complete` — Mark as Complete

No request body needed. Automatically sets `completed: true` and records `completedAt` timestamp.

**Success Response (`200`):**
```json
{
  "message": "Task marked as complete.",
  "task": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "title": "Study Chapter 1 - Data Structures",
    "completed": true,
    "completedAt": "2026-05-16T09:00:00.000Z"
  }
}
```


### ⏱️ Sessions — `/api/sessions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions` | Log a new study/work session |
| `GET` | `/api/sessions` | Retrieve all sessions |
| `GET` | `/api/sessions/goal/:goalId` | Retrieve all sessions for a specific goal |
| `PUT` | `/api/sessions/:id` | Update a session by ID |
| `DELETE` | `/api/sessions/:id` | Delete a session by ID |

#### ➕ POST `/api/sessions` — Log a Session

**Request Body:**
```json
{
  "goalId": "664f1a2b3c4d5e6f7a8b9c0d",
  "taskId": "664f1a2b3c4d5e6f7a8b9c0e",
  "startTime": "2026-05-16T08:00:00",
  "endTime": "2026-05-16T09:30:00",
  "durationMinutes": 90,
  "notes": "Covered arrays and linked lists in depth",
  "mood": "focused"
}
```

**Field Rules:**
- `goalId` — *ObjectId (ref: Goal), required*
- `taskId` — *ObjectId (ref: Task), required*
- `startTime` — *Date, required*
- `endTime` — *Date, optional*
- `durationMinutes` — *Number, optional*
- `notes` — *String, optional*
- `mood` — *String, optional* — one of: `focused`, `distracted`, `tired`, `energized`

---

### ⚠️ Common Error Responses

| Status Code | Meaning |
|-------------|---------|
| `200` | Success |
| `400` | Bad Request (e.g., duplicate entry) |
| `404` | Not Found (resource does not exist) |
| `500` | Internal Server Error |

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port `27017`)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) *(optional, for API testing)*

---

### 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/Nikeshala19/Student_Productivity_API.git
cd Student_Productivity_API
```

---

### 📦 Step 2 — Install Dependencies

```bash
npm install
```

This installs all required packages:
- `express` — Web framework
- `mongoose` — MongoDB ODM
- `body-parser` — JSON request body parsing
- `dotenv` — Environment variable management
- `nodemon` *(devDependency)* — Auto-restart on file changes

---

### 🔐 Step 3 — Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/studentproductivity
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.



## ▶️ How to Run the Project

### 🚀 Development Mode (with auto-restart)

```bash
npm run dev
```

This starts the server using **Nodemon**, which automatically restarts the server on any file change.

---

### 🏁 Production Mode

```bash
npm start
```

This runs the server using **Node.js** directly.

---

### ✅ Verify the Server is Running

Once started, you should see the following in your terminal:

```
Database connected successfully.
Server is running on port: 5000
```

You can now access the API at:

```
http://localhost:5000
```

---

### 🧪 Testing the API

All endpoints can be tested using **Postman**. A pre-built Postman collection is included in the repository:

```
Student Productivity API.postman_collection.json
```

Import this file into Postman to get all endpoints pre-configured and ready to test.

---

## 👤 Author

**Nikeshala Ranathunga**
Module: Web Services and Server Technology — **IT 2234(P)**
