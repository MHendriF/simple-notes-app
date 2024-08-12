// components\note-form.js
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
                      border: 1px solid #e0e0e0;
                      border-radius: 8px;
                      padding: 20px;
                      background-color: #ffffff;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
  
                  h2 {
                      color: #007bff;
                      text-align: center;
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
  
                  button i {
                      margin-right: 5px;
                  }
  
                  .loading-bar {
                      width: 100%;
                      height: 4px;
                      background-color: #e0e0e0;
                      border-radius: 2px;
                      overflow: hidden;
                      margin-bottom: 10px;
                  }
  
                  .loading-bar::after {
                      content: '';
                      display: block;
                      width: 100%;
                      height: 100%;
                      background-color: #007bff;
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
                      background-color: #28a745;
                      color: white;
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
  
                  @media (max-width: 600px) {
                      form {
                          padding: 10px;
                      }
  
                      input[type="text"], textarea {
                          padding: 8px;
                      }
  
                      button {
                          padding: 8px;
                      }
                  }
              </style>
              <h2>Form Catatan</h2>
              <form id="noteForm">
                  <label for="noteTitle">Judul</label>
                  <input type="text" id="noteTitle" required>
  
                  <label for="noteBody">Konten</label>
                  <textarea id="noteBody" rows="4" required></textarea>
  
                  <button type="submit"><i class="fas fa-plus"></i> Tambah Catatan</button>
              </form>
              <div class="loading-bar" style="display: none;"></div>
              <div class="success-message" id="successMessage">Catatan berhasil ditambahkan!</div>
          `;

    this.shadowRoot
      .querySelector('#noteForm')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        this.showLoadingBar();
        setTimeout(() => {
          this.addNote();
          this.hideLoadingBar();
          this.showSuccessMessage();
        }, 2000);
      });
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
