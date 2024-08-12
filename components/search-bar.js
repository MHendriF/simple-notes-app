class SearchBar extends HTMLElement {
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

          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: var(--search-bar-label-color, #333);
          }

          input[type="text"] {
            width: 100%;
            padding: var(--search-bar-input-padding, 10px);
            border: 1px solid var(--search-bar-input-border, #e0e0e0);
            border-radius: var(--search-bar-input-radius, 4px);
            box-sizing: border-box;
          }

          @media (max-width: 600px) {
            input[type="text"] {
              padding: var(--search-bar-input-padding-mobile, 8px);
            }
          }
        </style>
        <label for="searchInput">Cari Catatan</label>
        <input type="text" id="searchInput" placeholder="Masukkan keyword pencarian...">
      `;

    this.shadowRoot
      .querySelector('#searchInput')
      .addEventListener('input', (event) => {
        this.dispatchEvent(
          new CustomEvent('search-change', { detail: event.target.value })
        );
      });
  }
}

customElements.define('search-bar', SearchBar);
