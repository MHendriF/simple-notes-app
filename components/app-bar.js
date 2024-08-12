// components\app-bar.js
class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: #007bff;
                    color: white;
                    padding: 10px;
                    text-align: center;
                }
            </style>
            <header>
                <h1>Notes App</h1>
            </header>
        `;
  }
}

customElements.define('app-bar', AppBar);
