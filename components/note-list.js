class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                #activeNotesContainer, #archivedNotesContainer {
                    margin-bottom: 20px;
                }

                h2 {
                    color: #007bff;
                    margin-bottom: 10px;
                }

                #activeNotes, #archivedNotes {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Mengatur grid dengan maksimal 4 catatan */
                    gap: 15px; /* Jarak antar catatan */
                }

                .note {
                    border: 1px solid #e0e0e0;
                    background-color: #ffffff;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                }

                .note:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.2s;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 5px;
                }

                button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }

                button i {
                    margin-right: 5px;
                }
            </style>
            <div id="activeNotesContainer">
                <h2>Catatan Aktif</h2>
                <div id="activeNotes"></div>
            </div>
            <div id="archivedNotesContainer">
                <h2>Catatan Diarsipkan</h2>
                <div id="archivedNotes"></div>
            </div>
        `;
  }

  addNote(note) {
    const notesContainer = note.archived
      ? this.shadowRoot.querySelector('#archivedNotes')
      : this.shadowRoot.querySelector('#activeNotes');
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.setAttribute('part', 'note'); // Menambahkan part untuk styling
    noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <small>${new Date(note.createdAt).toLocaleString()}</small>
            <button class="delete-btn"><i class="fas fa-trash"></i> Hapus</button>
            <button class="archive-btn"><i class="fas ${
              note.archived ? 'fa-undo' : 'fa-archive'
            }"></i> ${note.archived ? 'Unarchive' : 'Archive'}</button>
        `;
    notesContainer.appendChild(noteElement);

    requestAnimationFrame(() => {
      noteElement.classList.add('show');
    });

    noteElement.querySelector('.delete-btn').addEventListener('click', () => {
      this.deleteNote(note.id);
    });

    noteElement.querySelector('.archive-btn').addEventListener('click', () => {
      this.toggleArchive(note.id);
    });
  }

  deleteNote(noteId) {
    const index = notesData.findIndex((n) => n.id === noteId);
    if (index > -1) {
      notesData.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notesData));
      this.updateNoteList();
    }
  }

  toggleArchive(noteId) {
    const note = notesData.find((n) => n.id === noteId);
    if (note) {
      note.archived = !note.archived;
      localStorage.setItem('notes', JSON.stringify(notesData));
      this.updateNoteList();
    }
  }

  updateNoteList() {
    const activeNotesContainer = this.shadowRoot.querySelector('#activeNotes');
    const archivedNotesContainer =
      this.shadowRoot.querySelector('#archivedNotes');
    activeNotesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';
    notesData.forEach((note) => this.addNote(note));
  }
}

customElements.define('note-list', NoteList);
