// components\note-form.js
const API_URL = 'https://notes-api.dicoding.dev/v2/notes';

class NoteForm extends HTMLElement {
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
            margin-bottom: 20px;
          }

          form {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            border: 1px solid var(--note-form-border, #e0e0e0);
            border-radius: var(--note-form-radius, 8px);
            padding: var(--note-form-padding, 20px);
            background-color: var(--note-form-bg, #ffffff);
            box-shadow: var(--note-form-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
          }

          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: var(--note-form-label-color, #333);
          }

          h2 {
              color: var(--note-form-title-color, #007bff);
              margin-bottom: 10px;
              text-align: center;
            }

          input[type="text"], textarea {
            width: 100%;
            padding: var(--note-form-input-padding, 10px);
            margin-bottom: 15px;
            border: 1px solid var(--note-form-input-border, #e0e0e0);
            border-radius: var(--note-form-input-radius, 4px);
            box-sizing: border-box;
          }

          button {
            padding: var(--note-form-button-padding, 10px);
            background-color: var(--note-form-button-bg, #007bff);
            color: var(--note-form-button-color, white);
            border: none;
            border-radius: var(--note-form-button-radius, 5px);
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
          }

          button:hover {
            background-color: var(--note-form-button-hover-bg, #0056b3);
            transform: translateY(-2px);
          }

          button i {
            margin-right: 5px;
          }

          .loading-bar {
            width: 100%;
            height: 4px;
            background-color: var(--note-form-loading-bar-bg, #e0e0e0);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .loading-bar::after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background-color: var(--note-form-loading-bar-active-bg, #007bff);
            transform: translateX(-100%);
            animation: loading 2s linear infinite;
          }

          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .success-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--note-form-success-message-bg, #28a745);
            color: var(--note-form-success-message-color, white);
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
          }

          .success-message.show {
            opacity: 1;
          }

          .error-message {
            color: red;
            font-size: 0.8em;
            margin-top: -10px;
            margin-bottom: 10px;
          }

          @media (max-width: 600px) {
            form {
              padding: var(--note-form-padding-mobile, 10px);
            }

            input[type="text"], textarea {
              padding: var(--note-form-input-padding-mobile, 8px);
            }

            button {
              padding: var(--note-form-button-padding-mobile, 8px);
            }
          }
        </style>
        <h2>Form Catatan</h2>
        <form id="noteForm">
            <label for="noteTitle">Judul</label>
            <input type="text" id="noteTitle">
            <div class="error-message" id="titleError"></div>

            <label for="noteBody">Konten</label>
            <textarea id="noteBody" rows="4"></textarea>
            <div class="error-message" id="bodyError"></div>

            <button type="submit"><i class="fas fa-plus"></i> Tambah Catatan</button>
        </form>
        <div class="loading-bar" style="display: none;"></div>
        <div class="success-message" id="successMessage">Catatan berhasil ditambahkan!</div>
    `;

    this.shadowRoot
      .querySelector('#noteForm')
      .addEventListener('submit', async (event) => {
        event.preventDefault();
        if (this.validateForm()) {
          this.showLoadingBar();
          await this.addNote();
          this.hideLoadingBar();
        }
      });

    this.shadowRoot
      .querySelector('#noteTitle')
      .addEventListener('input', () => this.validateTitle());
    this.shadowRoot
      .querySelector('#noteBody')
      .addEventListener('input', () => this.validateBody());
  }

  showLoadingBar() {
    this.shadowRoot.querySelector('.loading-bar').style.display = 'block';
  }

  hideLoadingBar() {
    this.shadowRoot.querySelector('.loading-bar').style.display = 'none';
  }

  showSuccessMessage() {
    const successMessage = this.shadowRoot.querySelector('#successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 3000);
  }

  validateForm() {
    return this.validateTitle() && this.validateBody();
  }

  validateTitle() {
    const titleInput = this.shadowRoot.querySelector('#noteTitle');
    const titleError = this.shadowRoot.querySelector('#titleError');
    if (titleInput.value.trim() === '') {
      titleError.textContent = 'Judul catatan tidak boleh kosong';
      return false;
    } else {
      titleError.textContent = '';
      return true;
    }
  }

  validateBody() {
    const bodyInput = this.shadowRoot.querySelector('#noteBody');
    const bodyError = this.shadowRoot.querySelector('#bodyError');
    if (bodyInput.value.trim() === '') {
      bodyError.textContent = 'Isi catatan tidak boleh kosong';
      return false;
    } else {
      bodyError.textContent = '';
      return true;
    }
  }

  async addNote() {
    const title = this.shadowRoot.querySelector('#noteTitle').value;
    const body = this.shadowRoot.querySelector('#noteBody').value;
    const note = { title, body };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (response.ok) {
        const newNote = await response.json();
        this.clearForm();
        this.showSuccessMessage();
        this.dispatchEvent(
          new CustomEvent('note-added', { detail: newNote.data })
        );
      } else {
        console.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  clearForm() {
    this.shadowRoot.querySelector('#noteTitle').value = '';
    this.shadowRoot.querySelector('#noteBody').value = '';
    this.shadowRoot.querySelector('#titleError').textContent = '';
    this.shadowRoot.querySelector('#bodyError').textContent = '';
  }
}

customElements.define('note-form', NoteForm);
