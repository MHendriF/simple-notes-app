class NoteForm extends HTMLElement {
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
                    margin-bottom: 20px;
                }

                form {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #333;
                }

                input[type="text"], textarea {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    box-sizing: border-box;
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
                }

                button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }
            </style>
            <form id="noteForm">
                <label for="noteTitle">Judul Catatan</label>
                <input type="text" id="noteTitle" required>

                <label for="noteBody">Isi Catatan</label>
                <textarea id="noteBody" rows="4" required></textarea>

                <button type="submit"><i class="fas fa-plus"></i> Tambah Catatan</button>
            </form>
        `;

    this.shadowRoot
      .querySelector('#noteForm')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        this.addNote();
      });
  }

  addNote() {
    const title = this.shadowRoot.querySelector('#noteTitle').value;
    const body = this.shadowRoot.querySelector('#noteBody').value;

    const note = {
      id: Date.now(),
      title: title,
      body: body,
      createdAt: new Date(),
      archived: false,
    };

    notesData.push(note);
    localStorage.setItem('notes', JSON.stringify(notesData));
    this.clearForm();
    this.dispatchEvent(new CustomEvent('note-added', { detail: note }));
  }

  clearForm() {
    this.shadowRoot.querySelector('#noteTitle').value = '';
    this.shadowRoot.querySelector('#noteBody').value = '';
  }
}

customElements.define('note-form', NoteForm);
