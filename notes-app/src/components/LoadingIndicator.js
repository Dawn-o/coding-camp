class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
export default LoadingIndicator;
