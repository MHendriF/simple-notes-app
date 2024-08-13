import './components/app-bar.js';
import './components/note-form.js';
import './components/note-list.js';
import './components/search-bar.js';

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

  async loadNotes() {
    await this.noteList.loadNotes();
  }

  addNoteToList(note) {
    this.noteList.addNote(note);
  }

  filterNotes(query) {
    console.log('🚀 ~ App ~ filterNotes ~ query:', query);
    this.noteList.filterNotes(query);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
