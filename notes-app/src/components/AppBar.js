class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <header>
                <h1>${this.getAttribute('title') || 'Notes App'}</h1>
            </header>
        `;
  }
}

customElements.define('app-bar', AppBar);
