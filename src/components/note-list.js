// components\note-list.js
const API_URL = 'https://notes-api.dicoding.dev/v2/notes';

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
          background-color: var(--note-list-bg, #f9f9f9);
          border-radius: var(--note-list-radius, 8px);
          box-shadow: var(--note-list-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
        }

        #activeNotesContainer, #archivedNotesContainer {
          margin-bottom: 20px;
        }

        h2 {
          color: var(--note-list-title-color, #007bff);
          margin-bottom: 10px;
        }

        #activeNotes, #archivedNotes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .note {
          border: 1px solid var(--note-border, #e0e0e0);
          background-color: var(--note-bg, #ffffff);
          padding: var(--note-padding, 15px);
          border-radius: var(--note-radius, 8px);
          box-shadow: var(--note-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .note:hover {
          transform: scale(1.02);
          box-shadow: var(--note-hover-shadow, 0 4px 10px rgba(0, 0, 0, 0.2));
        }

        .note-content {
          flex: 1;
        }

        .note-buttons {
          display: flex;
          flex-direction: column;
        }

        button {
          padding: var(--note-button-padding, 10px);
          background-color: var(--note-button-bg, #007bff);
          color: var(--note-button-color, white);
          border: none;
          border-radius: var(--note-button-radius, 5px);
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
        }

        button:hover {
          background-color: var(--note-button-hover-bg, #0056b3);
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
          color: var(--note-small-color, #777);
        }
          
          button {
            padding: var(--note-button-padding-mobile, 8px);
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

  async loadNotes() {
    try {
      const response = await fetch(API_URL);
      console.log('🚀 ~ loadNotes ~ response:', response);
      if (response.ok) {
        const notes = await response.json();
        console.log('🚀 ~ loadNotes ~ notes:', notes);
        notes.data.forEach((note) => this.addNote(note));
      } else {
        console.error('Failed to load notes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

    noteElement.querySelector('.delete-btn').addEventListener('click', () => {
      this.deleteNote(note.id);
    });

    noteElement.querySelector('.archive-btn').addEventListener('click', () => {
      this.toggleArchive(note.id);
    });
  }

  async deleteNote(noteId) {
    try {
      const response = await fetch(`${API_URL}/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.updateNoteList();
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async toggleArchive(noteId) {
    try {
      const note = this.notes.find((n) => n.id === noteId);
      if (!note) return;

      const endpoint = note.archived
        ? `${API_URL}/${noteId}/unarchive`
        : `${API_URL}/${noteId}/archive`;
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      if (response.ok) {
        await this.loadNotes();
      } else {
        console.error('Failed to toggle archive status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async updateNoteList() {
    const activeNotesContainer = this.shadowRoot.querySelector('#activeNotes');
    const archivedNotesContainer =
      this.shadowRoot.querySelector('#archivedNotes');
    activeNotesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';
    await this.loadNotes();
  }

  filterNotes(query) {
    if (!this.notes) return;
    const filteredNotes = this.notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.displayNotes(filteredNotes);
  }
}

customElements.define('note-list', NoteList);
