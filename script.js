// script.js
import { notesData } from './dummyData.js';

// Fungsi untuk menginisialisasi localStorage dengan data dummy jika belum ada data
function initializeLocalStorage() {
  if (!localStorage.getItem('notes')) {
    localStorage.setItem('notes', JSON.stringify(notesData));
  }
}

// Panggil fungsi untuk menginisialisasi localStorage
initializeLocalStorage();

// Ambil data dari localStorage
const notesDataFromLocalStorage =
  JSON.parse(localStorage.getItem('notes')) || [];

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
    notesDataFromLocalStorage.forEach((note) => this.addNoteToList(note));
  }

  addNoteToList(note) {
    this.noteList.addNote(note);
  }

  filterNotes(query) {
    const filteredNotes = notesDataFromLocalStorage.filter(
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
