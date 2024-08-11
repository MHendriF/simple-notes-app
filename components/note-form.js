class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                }
                input, textarea {
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
            <form id="noteForm">
                <input type="text" id="title" placeholder="Judul Catatan" required>
                <textarea id="body" placeholder="Isi Catatan" required></textarea>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;

    this.shadowRoot
      .querySelector('#noteForm')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        const title = this.shadowRoot.querySelector('#title').value;
        const body = this.shadowRoot.querySelector('#body').value;
        this.addNote(title, body);
      });
  }

  addNote(title, body) {
    if (title.length < 3) {
      alert('Judul harus lebih dari 3 karakter.');
      return;
    }

    const newNote = {
      id: `notes-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    notesData.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notesData));
    this.dispatchEvent(new CustomEvent('note-added', { detail: newNote }));
    this.resetForm();
  }

  resetForm() {
    this.shadowRoot.querySelector('#noteForm').reset();
  }
}

customElements.define('note-form', NoteForm);
