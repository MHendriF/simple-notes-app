class NoteItem extends HTMLElement {
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
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h2 {
            margin: 0 0 10px;
            font-size: 1.2em;
          }
          p {
            margin: 0;
            color: #555;
          }
        </style>
        <h2>${this.getAttribute('title')}</h2>
        <p>${this.getAttribute('body')}</p>
        <p><small>Created at: ${new Date(
          this.getAttribute('created-at')
        ).toLocaleString()}</small></p>
      `;
  }
}

customElements.define('note-item', NoteItem);
