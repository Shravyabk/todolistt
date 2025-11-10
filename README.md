# TODOLIST
# To-Do List API Backend

This is a minimal backend API for a To-Do List application built with Node.js, Express, and MongoDB. It supports user authentication and full task management.

---

## Technologies Used

* **Node.js**
* **Express**
* **MongoDB**
* **jsonwebtoken (JWT)**: For user authentication.
* **bcryptjs**: For password hashing.
* **dotenv**: For managing environment variables.
* **cors**: For cross-origin resource sharing.

---

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Shravyabk/todolistt.git](https://github.com/Shravyabk/todolistt.git)
    cd todolistt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add your variables:
    ```env
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_secret_key_for_jwt
    ```

4.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will run on `http://localhost:5000`.

---

## API Endpoints

A Postman collection (`ToDo-API.postman_collection.json`) is included to test all endpoints.

### Authentication (`/api/auth`)

* `POST /register`: Register a new user.
* `POST /login`: Log in a user and get a JWT token.

### Tasks (`/api/tasks`)

*(All these routes are protected and require a JWT Bearer Token)*

* `POST /`: Create a new task.
* `GET /`: Get all tasks for the logged-in user.
    * *Supports filtering by query params: `?status=pending`, `?category=Work`*
* `GET /:taskId`: Get a single task by its ID.
* `PUT /:taskId`: Update a task.
* `DELETE /:taskId`: Delete a task.
* `POST /:taskId/markCompleted`: Mark a task as completed.
* `POST /:taskId/markPending`: Mark a task as pending.
* `GET /category/:category`: Get all tasks by a specific category.
* `GET /search`: Search tasks by title or description.
    