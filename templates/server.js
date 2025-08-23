// const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Insert user into 'users' table
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password }]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ message: "User registered successfully", user: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single(); // get only one row

    if (error || !data) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful", user: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
