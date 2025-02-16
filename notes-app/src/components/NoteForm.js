class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <form id="note-form">
                <input type="text" id="title" placeholder="Judul Catatan" required>
                <textarea id="body" placeholder="Isi Catatan" required></textarea>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;

    this.querySelector('#note-form').addEventListener('submit', event => {
      event.preventDefault();
      const title = this.querySelector('#title').value;
      const body = this.querySelector('#body').value;
      document.dispatchEvent(new CustomEvent('add-note', { detail: { title, body } }));
      this.querySelector('#title').value = '';
      this.querySelector('#body').value = '';
    });
  }
}

customElements.define('note-form', NoteForm);
