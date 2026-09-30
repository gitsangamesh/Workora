const API_URL = "http://localhost:5000/notes";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const addNoteButton = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");

// Load notes
async function loadNotes() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load notes");
        }

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {

        notesContainer.innerHTML =
            `<p class="empty">Unable to load notes.</p>`;

        console.error(error);
    }
}

// Display notes
function displayNotes(notes) {

    notesContainer.innerHTML = "";

    if (notes.length === 0) {

        notesContainer.innerHTML =
            `<p class="empty">No notes available.</p>`;

        return;
    }

    notes.forEach(note => {

        const noteElement = document.createElement("div");

        noteElement.className = "note";

        const date = new Date(
            note.createdAt
        ).toLocaleString();

        noteElement.innerHTML = `
            <h3>${escapeHTML(note.title)}</h3>

            <p>${escapeHTML(note.content)}</p>

            <small>
                Created: ${date}
            </small>

            <button
                class="delete-btn"
                onclick="deleteNote('${note.id}')"
            >
                Delete
            </button>
        `;

        notesContainer.appendChild(noteElement);
    });
}

// Add new note
addNoteButton.addEventListener("click", async () => {

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {

        alert("Please enter both title and content.");

        return;
    }

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                content
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        titleInput.value = "";
        contentInput.value = "";

        loadNotes();

    } catch (error) {

        alert(error.message);
        console.error(error);
    }
});

// Delete note
async function deleteNote(id) {

    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        loadNotes();

    } catch (error) {

        alert(error.message);
        console.error(error);
    }
}

// Prevent HTML injection
function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial load
loadNotes();