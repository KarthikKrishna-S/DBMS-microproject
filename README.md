# Recipe Book Web Application

A simple, full-stack web application for creating, managing, and searching your personal collection of recipes. This project uses a vanilla HTML and JavaScript frontend, a Node.js/Express backend, and a MySQL database managed with the Prisma ORM.

## Features

* **User Authentication:** Secure sign-up and login system for personal accounts.
* **Recipe Management:** Create, view, and store recipes with details like name, instructions, and preparation time.
* **Ingredient Management:** Create and manage a personal list of ingredients.
* **Dynamic Recipe Filtering:**
    * Search for recipes by name.
    * Sort recipes alphabetically or by preparation time.
    * Filter recipes to show only those containing one or more selected ingredients.
* **Single-Page Interface:** A smooth, responsive user experience without page reloads.

## Tech Stack

* **Frontend:** HTML, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **ORM:** Prisma

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following software installed:

* [Node.js](https://nodejs.org/) (v18 or newer recommended)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Installation & Setup

**Step 1: Get the Code**

Download or clone the project files into a local directory.

**Step 2: Navigate to Project Directory**

Open your terminal or command prompt and navigate into the project folder:

    cd path/to/your/project

**Step 3: Install Dependencies**

Run the following command to install all the necessary backend packages listed in `package.json`:

    npm install

**Step 4: Set Up the Database**

1.  Open MySQL Workbench or your preferred MySQL client.
2.  Create a new database for the project (e.g., `recipe_app`).
3.  In the project's root directory, create a new file named `.env`.
4.  Copy the following line into your `.env` file and replace the placeholders with your actual MySQL credentials.

        DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/YOUR_DATABASE_NAME"

    *Example:*
    `DATABASE_URL="mysql://root:MyPassword123@localhost:3306/recipe_app"`

**Step 5: Run the Database Migration**

This command will read your `prisma/schema.prisma` file and automatically create all the necessary tables in your database.

    npx prisma migrate dev

You can give the migration a name when prompted (e.g., "init").

---

## Running the Application

1.  **Start the Backend Server**

    With all the dependencies installed and the database set up, run the following command to start the Node.js server:

        node server.js

    You should see a confirmation message in your terminal:
    `Server is running and listening on http://localhost:3000`

2.  **Open the Application in Your Browser**

    Open your favorite web browser and navigate to the following address:

    `http://localhost:3000`

You should now see the login page. You can create an account and start using your recipe book!
