# Student_Productivity_API
 Smart Student Productivity &amp; Time Management System: Students(Undergraduates) struggle with time management and productivity. This system helps them to organize tasks, set goals, prioritize work, and track progress.


# 🎓 Smart Student Productivity & Time Management System

A RESTful API backend built with Node.js, Express.js, and MongoDB that helps students manage their goals, tasks, and productivity sessions effectively.

---

## 📌 Problem Description

Students and undergraduates struggle with time management and productivity. Whether preparing for final exams, completing projects, or maintaining daily habits — they often lack a structured system to organize their work, prioritize tasks, and track their progress over time.

---

## 💡 Proposed Solution

This system provides a complete backend API that allows students to:
- Create and manage **Goals** (exam prep, projects, habits)
- Break goals into **Tasks** with deadlines and priorities
- Log **Study/Work Sessions** to track productivity
- Mark tasks as complete and monitor progress

---

## ✨ Features

- Create, read, update, and delete Goals
- Create, read, update, and delete Tasks
- Assign tasks to specific goals
- Mark tasks as completed with timestamp
- Log study/work sessions with mood tracking
- Filter tasks and sessions by goal
- Input validation and error handling

---

## 🛠️ Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Environment Variables:** dotenv
- **API Testing:** Postman
- **Version Control:** GitHub

---

## 📁 Project Structure

student-productivity-api/
├── controllers/
│   ├── goalController.js
│   ├── taskController.js
│   └── sessionController.js
├── models/
│   ├── goal.js
│   ├── task.js
│   └── session.js
├── routes/
│   ├── goalRoutes.js
│   ├── taskRoutes.js
│   └── sessionRoutes.js
├── .env
├── .gitignore
├── index.js
└── package.json

---

## 🔌 API Endpoints

### Goals `/api/goals`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/goals` | Create a new goal |
| GET | `/api/goals` | Get all goals |
| GET | `/api/goals/:id` | Get a single goal |
| PUT | `/api/goals/:id` | Update a goal |
| DELETE | `/api/goals/:id` | Delete a goal |

**Example POST body:**
```json
{
  "title": "Final Exam Preparation",
  "type": "exam",
  "description": "Prepare for all semester 4 final exams",
  "deadline": "2026-06-30",
  "priority": "high"
}
```

---

### Tasks `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/goal/:goalId` | Get tasks by goal |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/complete` | Mark task as complete |
| DELETE | `/api/tasks/:id` | Delete a task |

**Example POST body:**
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

---

### Sessions `/api/sessions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Log a new session |
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/sessions/goal/:goalId` | Get sessions by goal |
| PUT | `/api/sessions/:id` | Update a session |
| DELETE | `/api/sessions/:id` | Delete a session |

**Example POST body:**
```json
{
  "goalId": "664f1a2b3c4d5e6f7a8b9c0d",
  "taskId": "664f1a2b3c4d5e6f7a8b9c0e",
  "startTime": "2026-05-09T08:00:00",
  "endTime": "2026-05-09T09:30:00",
  "durationMinutes": 90,
  "notes": "Covered arrays and linked lists",
  "mood": "focused"
}
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally
- Postman (for API testing)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Nikeshala19/Student_Productivity_API.git
cd Student_Productivity_API
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** in the root folder

PORT=5000
MONGO_URL=mongodb://localhost:27017/studentproductivity

4. **Run the server**
```bash
npm run dev
```

5. **Server runs at**
http://localhost:5000

---

## 🧪 API Testing

All endpoints have been tested using Postman. The exported collection is included in the repository as:
Student_Productivity_API.postman_collection.json

---

## 👤 Author

**Nikeshala Ranathunga**  
2nd Year IT Undergraduate  
Module: Web Services and Technology (IT2234)

