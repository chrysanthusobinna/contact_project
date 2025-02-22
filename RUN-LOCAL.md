> [!NOTE]  
> Return back to the [README.md](README.md) file.

# Running the Contact Project Locally

This guide explains how to clone and run both the **backend (Django API)** and **frontend (HTML & jQuery)** locally on your computer.

---

## Prerequisites

- Python 3.x installed ([Download Python](https://www.python.org/downloads/))
- Git installed ([Download Git](https://git-scm.com/downloads))

---

## Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/chrysanthusobinna/contact_project.git
```

Navigate into the project folder:

```bash
cd contact_project
```

---

## Step 2: Set Up Backend (Django API)

### 2.1: Create a Virtual Environment

Run:

```bash
python3 -m venv venv
```

### 2.2: Activate the Virtual Environment

- **On macOS/Linux:**

  ```bash
  source venv/bin/activate
  ```

- **On Windows:**

  ```bash
  venv\Scripts\activate
  ```

### 2.3: Install Backend Dependencies

Run:

```bash
pip install -r contacts_api/requirements.txt
```

### 2.4: Run Migrations

Navigate to the API directory:

```bash
cd contacts_api
```

Then, run migrations:

```bash
python manage.py migrate
```

### 2.5: Start the Django Server

Run:

```bash
python manage.py runserver
```

Your API will run at: `http://127.0.0.1:8000/api`

---

## Step 3: Set Up Frontend

### 3.1: Configure API URL

- Open `frontend/assets/js/config.js`.
- Ensure the API URL is set to:

  ```javascript
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  ```

### 3.2: Run the Frontend

Since this frontend is static HTML/JS, you can open it directly in your browser:

- Navigate to `contact_project/frontend`.
- Double-click on `index.html`, or open it using your browser.

 