const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data", "notes.json");

// Read notes from JSON file
function readNotes() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save notes to JSON file
function saveNotes(notes) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(notes, null, 2)
    );
}

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Note Taking API is running"
    });
});

// GET all notes
app.get("/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// POST create note
app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const notes = readNotes();

    const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes(notes);

    res.status(201).json(newNote);
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
    const notes = readNotes();

    const noteExists = notes.some(
        note => note.id === req.params.id
    );

    if (!noteExists) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const updatedNotes = notes.filter(
        note => note.id !== req.params.id
    );

    saveNotes(updatedNotes);

    res.json({
        message: "Note deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});