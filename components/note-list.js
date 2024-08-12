// components\note-list.js
class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                }

                .note {
                    border: 1px solid #e0e0e0;
                    background-color: #ffffff;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .note:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                .note-content {
                    flex: 1;
                }

                .note-buttons {
                    display: flex;
                    flex-direction: column;
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

                h3, small {
                    margin: 0;
                    word-wrap: break-word;
                }

                p {
                  word-wrap: break-word;
                }

                small {
                    margin-bottom: 10px;
                    font-size: 0.8em;
                    color: #777;
                }

                @media (max-width: 600px) {
                    #activeNotes, #archivedNotes {
                        grid-template-columns: 1fr;
                    }

                    .note {
                        padding: 10px;
                    }

                    button {
                        padding: 8px;
                    }
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
    noteElement.setAttribute('part', 'note');
    noteElement.innerHTML = `
            <div class="note-content">
                <h3>${note.title}</h3>
                 <small>${new Date(note.createdAt).toLocaleString()}</small>
                <p>${note.body}</p>
            </div>
            <div class="note-buttons">
                <button class="delete-btn"><i class="fas fa-trash"></i> Hapus</button>
                <button class="archive-btn"><i class="fas ${
                  note.archived ? 'fa-undo' : 'fa-archive'
                }"></i> ${note.archived ? 'Unarchive' : 'Archive'}</button>
            </div>
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
