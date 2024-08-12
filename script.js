const notesData = JSON.parse(localStorage.getItem('notes')) || [];

class App {
  constructor() {
    this.noteList = document.querySelector('note-list');
    this.noteForm = document.querySelector('note-form');
    this.searchBar = document.querySelector('search-bar');

    this.noteForm.addEventListener('note-added', (event) => {
      this.addNoteToList(event.detail);
    });

    this.searchBar.addEventListener('search-change', (event) => {
      this.filterNotes(event.detail);
    });

    this.loadNotes();
  }

  loadNotes() {
    this.noteList.updateNoteList(notesData);
  }

  addNoteToList(note) {
    this.noteList.addNote(note);
  }

  filterNotes(query) {
    const filteredNotes = notesData.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
    );
    this.noteList.updateNoteList(filteredNotes);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
