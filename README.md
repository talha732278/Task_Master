# 📋 Task Mater – Personal Task Manager App

A simple, elegant personal task management Android application built with clean architecture principles. “My Tasks” allows users to efficiently manage daily activities with features like task creation, editing, status marking, and local persistence using Room Database.

---

## 🚀 Features

- ✅ **Add New Task**
  - Title, Description, Due Date, and Priority
- 📋 **View Tasks**
  - Tasks displayed using RecyclerView or LazyColumn (Compose)
- ✏️ **Edit & Update Tasks**
  - Modify existing task information
- ❌ **Delete Task**
  - Remove tasks with confirmation
- 📌 **Task Status**
  - Mark tasks as **Completed** or **Incomplete**

---

## 💡 Optional Enhancements (Implemented / Easy to Add)

- 🏷️ Add **Category/Tag** (e.g., Work, Study, Personal)
- 🔔 Reminder/Notification support for due tasks
- 🧠 ViewModel for logic separation (MVVM architecture)
- 🎨 Splash Screen and Custom App Icon
- 🎯 Task priority indicators (icons/colors)

---

## 🧱 Architecture

The app follows **MVVM (Model-View-ViewModel)** architecture.

- **Model**: Room Database, Entities, and DAO
- **ViewModel**: Business logic, LiveData/State handling
- **View**: Jetpack Compose UI or XML with RecyclerView

---

## 🛠️ Tech Stack

- **Language**: Kotlin
- **UI**: Jetpack Compose or XML
- **Database**: Room Persistence Library
- **Architecture**: MVVM
- **State Management**: LiveData or Compose `State`
- **Navigation**: Navigation Component or Compose Navigation

---

## 📱 Screens

2. **Task List Screen**
   - View all tasks
   - Quick access to edit/delete
3. **Add/Edit Task Screen**
   - Input form for task details
4. **Task Details** (Optional for expansion)
   - Full details, category, and due date reminder




