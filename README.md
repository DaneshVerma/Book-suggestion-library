# BookLogs
A web book library app suggesting you some good readable books

## Features

- Fetch book covers using the Open Library Covers API.
- Create, read, update, and delete book entries in a PostgreSQL database.
- Sort books by title (backend functionality implemented).
- Password verification for added security.
- Use of dotenv to secure sensitive information.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/DaneshwarVerma/Book-suggestion-library.git
    cd booklogs
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your PostgreSQL database and update the database connection settings in `config.js`.

4. Create a `.env` file in the root directory and add your environment variables:
    ```env
    databse: your-database-name
    dbConString=your-database-url
    password=your-secret-key
    ```

5. Start the server:
    ```bash
    nodemon index.js
    ```

### Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the web interface to add, update, view, and delete book entries but you need password to do so.


## Contributing

Feel free to fork this repository and submit pull requests. Contributions are welcome!

