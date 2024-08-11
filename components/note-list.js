class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                .note {
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 5px;
                    background-color: #fff;
                    transition: transform 0.2s, box-shadow 0.2s;
                    opacity: 0; /* Mulai dengan opacity 0 untuk animasi masuk */
                    transform: translateY(20px); /* Mulai dengan sedikit terangkat */
                }
                .note.show {
                    opacity: 1; /* Menampilkan catatan */
                    transform: translateY(0); /* Kembali ke posisi normal */
                }
                .archived {
                    color: gray;
                }
                h2 {
                    margin: 20px 0 10px;
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
    noteElement.innerHTML = `
            <h3 class="${note.archived ? 'archived' : ''}">${note.title}</h3>
            <p>${note.body}</p>
            <small>${new Date(note.createdAt).toLocaleString()}</small>
            <button class="delete-btn">Hapus</button>
            <button class="archive-btn">${
              note.archived ? 'Unarchive' : 'Archive'
            }</button>
        `;
    notesContainer.appendChild(noteElement);

    // Menambahkan animasi masuk
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
