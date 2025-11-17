import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Study");



  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("mynotes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("mynotes", JSON.stringify(notes));
  }, [notes]);

  function openForm(note) {
    setShowForm(true); 

    if (note) {
      setEditId(note.id);
      setTitle(note.title);
      setDesc(note.description);
      setCategory(note.category);
    } else {
      setEditId(null);
      setTitle("");
      setDesc("");
      setCategory("Study");
    }
  }

  function saveNote() {
    if (!title.trim() || !desc.trim()) {
      alert("Please fill all fields");
      return;
    }


    if (editId) {
      const updated = notes.map((n) => {
        if (n.id === editId) {
          return {
            ...n,
            title: title,
            description: desc,
            category: category,
          };
        }
        return n;
      });
      setNotes(updated);
    } else {

      const newNote = {
        id: Date.now(),
        title,
        description: desc,
        category,
        created: new Date().toISOString().split("T")[0],
      };
      setNotes([newNote, ...notes]);
    }

    setShowForm(false);
  }

  function removeNote(id) {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  }

  const shownNotes = filter === "All" ? notes : notes.filter((n) => n.category === filter);

  return (
    <div className="app">
      <aside className="sidebar">
        <h3>All My Categories</h3>

        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={filter === "Study" ? "active" : ""}
          onClick={() => setFilter("Study")}
        >
          Study
        </button>
        <button
          className={filter === "Personal" ? "active" : ""}
          onClick={() => setFilter("Personal")}
        >
          Personal
        </button>
        <button
          className={filter === "College" ? "active" : ""}
          onClick={() => setFilter("College")}
        >
          College
        </button>
         <button
          className={filter === "Ideas" ? "active" : ""}
          onClick={() => setFilter("Ideas")}
        >
          Ideas
        </button>
         <button
          className={filter === "Meetings" ? "active" : ""}
          onClick={() => setFilter("Meetings")}
        >
          Meetings
        </button>

        <button className="add-btn" onClick={() => openForm(null)}>
          New Task
        </button>
      </aside>

      <main className="content">
        <div className="top-bar">
          <h2 className="heading">Shakti Notes</h2>
          </div>

        <div className="notes-list">
          {shownNotes.length === 0 ? (
            <p>No Task found.</p>
          ) : (
            shownNotes.map((n) => (
              <div className="note-card" key={n.id} onClick={() => openForm(n)}>
                <h1>{n.title}</h1>
                <h4>{n.description}</h4>
                <p>{n.category}</p>
                <div className="row">
                  <small>{n.created}</small>
                  <button
                    className="del"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNote(n.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showForm && (
        <div className="overlay">
          <div className="popup">
            <h3>{editId ? "Edit Task" : "New Task"}</h3>
            <input
              className="input"
              placeholder="Kya Title Hai?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="input"
              rows={3}
              placeholder="Kya Kaam Hai?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Study</option>
              <option>Personal</option>
              <option>College</option>
               <option>Ideas</option>
              <option>Meetings</option>
            </select>

            <div className="actions">
              <button
                className="btn secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="btn" onClick={saveNote}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
