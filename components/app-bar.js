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
          :host {
            display: block;
          }

          header {
            background: var(--app-bar-bg, #007bff);
            color: var(--app-bar-color, white);
            padding: var(--app-bar-padding, 10px);
            text-align: center;
          }

          h1 {
            margin: 0;
            font-size: var(--app-bar-title-size, 1.5em);
          }

          @media (max-width: 600px) {
            header {
              padding: var(--app-bar-padding-mobile, 5px);
            }

            h1 {
              font-size: var(--app-bar-title-size-mobile, 1.2em);
            }
          }
        </style>
        <header>
            <h1>Notes App</h1>
        </header>
    `;
  }
}

customElements.define('app-bar', AppBar);
