const notesData = JSON.parse(localStorage.getItem('notes')) || [];

class App {
  constructor() {
    this.noteList = document.querySelector('note-list');
    this.noteForm = document.querySelector('note-form');
    this.noteForm.addEventListener('note-added', (event) => {
      this.addNoteToList(event.detail);
    });
    this.loadNotes();
  }

  loadNotes() {
    notesData.forEach((note) => this.addNoteToList(note));
  }

  addNoteToList(note) {
    this.noteList.addNote(note);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
