const express = require("express");
const users = require("./routes/users");
const tasks = require("./routes/tasks");

// connect to database
require("./db/mongoose");

const app = express();

// under maintenance middleware
// app.use((req, res) => {
//   res.status(503).send("Site under maintenance");
// });

// middleware
app.use(express.json());
app.use(express.urlencoded());

// routes
app.use("/users", users);
app.use("/tasks", tasks);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server running on port ${port}...`));
