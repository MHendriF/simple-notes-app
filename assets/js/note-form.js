class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          input, textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            background: #007bff;
            color: #fff;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
          .error {
            color: red;
            margin-bottom: 10px;
          }
        </style>
        <form id="note-form">
          <input type="text" id="note-title" placeholder="Title" required>
          <textarea id="note-body" placeholder="Body" required></textarea>
          <div class="error" id="error-message"></div>
          <button type="submit">Add Note</button>
        </form>
      `;
  }

  addEventListeners() {
    this.shadowRoot
      .getElementById('note-form')
      .addEventListener('submit', this.handleSubmit.bind(this));
    this.shadowRoot
      .getElementById('note-title')
      .addEventListener('input', this.validateForm.bind(this));
    this.shadowRoot
      .getElementById('note-body')
      .addEventListener('input', this.validateForm.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.shadowRoot.getElementById('note-title').value;
    const body = this.shadowRoot.getElementById('note-body').value;
    if (title && body) {
      const notesList = document.querySelector('.notes-list');
      const newNote = document.createElement('note-item');
      newNote.setAttribute('id', `notes-${Date.now()}`);
      newNote.setAttribute('title', title);
      newNote.setAttribute('body', body);
      newNote.setAttribute('created-at', new Date().toISOString());
      newNote.setAttribute('archived', 'false');
      notesList.appendChild(newNote);
      this.shadowRoot.getElementById('note-title').value = '';
      this.shadowRoot.getElementById('note-body').value = '';
      this.shadowRoot.getElementById('error-message').textContent = '';
    } else {
      this.shadowRoot.getElementById('error-message').textContent =
        'Title and body are required';
    }
  }

  validateForm() {
    const title = this.shadowRoot.getElementById('note-title').value;
    const body = this.shadowRoot.getElementById('note-body').value;
    if (title && body) {
      this.shadowRoot.getElementById('error-message').textContent = '';
    } else {
      this.shadowRoot.getElementById('error-message').textContent =
        'Title and body are required';
    }
  }
}

customElements.define('note-form', NoteForm);
