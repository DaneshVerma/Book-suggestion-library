import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port = 3000;

// connecting to local database 
// const db = new pg.Client({
//   host: "localhost",
//   user: "postgres",
//   password: "demopass",
//   database: process.env.database,
//   port: "5432",
// });

// connecting to the remote database
const db = new pg.Client({connectionString: process.env.dbConString})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// function to retrive all books in a formatted manner
async function getAllBooks() {
  const result = await db.query("SELECT * FROM booklogs ORDER BY title ASC;");
  var formattedBooks = result.rows.map((element) => {
    let formattedDate = new Date(element.date_added).toLocaleDateString(
      "en-US",
      { weekday: "short", year: "numeric", month: "short", day: "numeric" }
    );
    return { ...element, date_added: formattedDate };
  });
  return formattedBooks;
}

// home route landing page 
app.get("/", async (req, res) => {
  let data = await getAllBooks();
  res.render("index.ejs", { books: data });
});

// route for showing only a specific book data
app.post("/view/:title", async (req, res) => {
  let id = req.body.bookid;
  let data = await db.query("SELECT * FROM booklogs WHERE id = $1", [id]);
  res.render("view.ejs", { book: data.rows[0] });
});

// route for rendering book adding page
app.get("/addbook", (req, res) => {
  res.render("addBook.ejs");
});

// this route handles the add request which comes from /add route
app.post("/add", async (req, res) => {
  const title = req.body.title + " " + "by" + " " + req.body.auther;
  const date = req.body.dateread;
  const note = req.body.description;
  const isbn = req.body.isbn;
  const password = req.body.password;
  console.log(process.env.password)
  if (password == process.env.password){  // only if password is correct then any data will be added to database
  try {
    await db.query(
      "INSERT INTO booklogs (title, date_added, isbn, note) VALUES ($1, $2, $3, $4)",
      [title, date, isbn, note]
    );
  } catch (err) {
    console.log("cant be aded");
  }
}
  res.redirect("/");
});

// route for rendering book edit page
app.get('/edit/:title', async(req, res)=>{
  let title = req.params.title
  let data = await db.query("SELECT * FROM booklogs WHERE title = $1", [title]);
  res.render("edit.ejs", { book: data.rows[0] });
})

// this route handles the edit request which comes from /edit route
app.post("/edit", async (req, res) => {
  const note = req.body.description;
  const id = req.body.bookid;
  const password = req.body.password;
  if (password == process.env.password){  // until password doesn't match no changes will happen to the database
  try {
    await db.query(
      "UPDATE booklogs SET note = $1 WHERE id = $2",
      [note, id]
    );
  } catch (err) {
    console.log("cant be Edited");
  }
} 
  let data = await db.query("SELECT * FROM booklogs WHERE id = $1", [id]);
  res.render("view.ejs", { book: data.rows[0]});
});

// route for rendering book edit page
app.get('/delete/:title', async(req, res)=>{
  let title = req.params.title
  let data = await db.query("SELECT * FROM booklogs WHERE title = $1", [title]);
  res.render("remove.ejs", { book: data.rows[0] });
})

// this route handles the delete  request which comes from /edit route
app.post("/delete", async (req, res) => {
  const id = req.body.bookid;
  const password = req.body.password;
  if (password == process.env.password){  // until unless password is unmatched nothing will be deleted
  try {
    await db.query(
      "DELETE FROM booklogs WHERE id = $1",
      [id]
    );
  } catch (err) {
    console.log("cant be Deleted");
  }
}
res.redirect('/')
});


//  this route renders the about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log("Server listing on : http://localhost:3000");
});
