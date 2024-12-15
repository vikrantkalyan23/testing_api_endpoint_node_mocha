const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/crudAPI", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define Schema and Model
const dataSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
});

const Data = mongoose.model("Data", dataSchema);

// CRUD Endpoints
// Create
app.post("/api/data", async (req, res) => {
    try {
        const newData = new Data(req.body);
        await newData.save();
        res.status(200).json(newData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read All
app.get("/api/data", async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read by ID
app.get("/api/data/:id", async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
app.put("/api/data/:id", async (req, res) => {
    try {
        const data = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete
app.delete("/api/data/:id", async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        if (data) {
            res.status(200).json({ message: "Data deleted" });
        } else {
            res.status(404).json({ error: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
