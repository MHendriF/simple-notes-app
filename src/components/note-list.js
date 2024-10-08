// components\note-list.js
import Swal from 'sweetalert2';
import anime from 'animejs';
const API_URL = 'https://notes-api.dicoding.dev/v2/notes';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.notes = [];
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
      const [activeNotesResponse, archivedNotesResponse] = await Promise.all([
        fetch(`${API_URL}`),
        fetch(`${API_URL}/archived`),
      ]);
      if (activeNotesResponse.ok && archivedNotesResponse.ok) {
        const activeNotes = await activeNotesResponse.json();
        const archivedNotes = await archivedNotesResponse.json();
        this.notes = [...activeNotes.data, ...archivedNotes.data];
        this.displayNotes(this.notes);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal memuat catatan!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat memuat catatan!',
      });
    }
  }

  displayNotes(notes) {
    const activeNotesContainer = this.shadowRoot.querySelector('#activeNotes');
    const archivedNotesContainer =
      this.shadowRoot.querySelector('#archivedNotes');
    activeNotesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';
    notes.forEach((note) => this.addNote(note));
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

    anime({
      targets: noteElement,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      easing: 'easeOutSine',
    });

    noteElement.querySelector('.delete-btn').addEventListener('click', () => {
      this.confirmDelete(note.id);
    });

    noteElement.querySelector('.archive-btn').addEventListener('click', () => {
      this.toggleArchive(note.id);
    });
  }

  async confirmDelete(noteId) {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda tidak akan dapat mengembalikan catatan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      await this.deleteNote(noteId);
    }
  }

  async deleteNote(noteId) {
    try {
      const response = await fetch(`${API_URL}/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.updateNoteList();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Berhasil menghapus catatan!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menghapus catatan!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat menghapus catatan!',
      });
    }
  }

  async toggleArchive(noteId) {
    console.log('🚀 ~ toggleArchive ~ noteId:', noteId);
    try {
      const note = this.notes.find((n) => n.id === noteId);
      console.log('🚀 ~ toggleArchive ~ note:', note);
      if (!note) return;

      const endpoint = note.archived
        ? `${API_URL}/${noteId}/unarchive`
        : `${API_URL}/${noteId}/archive`;
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      console.log('🚀 ~ toggleArchive ~ response:', response);

      if (response.ok) {
        await this.loadNotes();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal mengarsipkan/membuka arsip catatan!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat mengarsipkan/membuka arsip catatan!',
      });
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
