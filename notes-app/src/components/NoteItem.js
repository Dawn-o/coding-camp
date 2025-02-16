class NoteItem extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Tanpa Judul';
    const content = this.getAttribute('content') || 'Tidak ada isi.';
    const createdAt = this.getAttribute('createdAt') || new Date().toISOString();
    const isArchived = this.hasAttribute('archived');

    this.innerHTML = `
            <div class="note-item animate-in">
                <h3>${title}</h3>
                <p>${content}</p>
                <small>${new Date(createdAt).toLocaleDateString()}</small>
                <div class="note-actions">
                    <button class="archive-btn">
                        ${isArchived ? 'Batal Arsip' : 'Arsipkan'}
                    </button>
                    <button class="delete-btn">Hapus</button>
                </div>
            </div>
        `;

    gsap.from(this.querySelector('.note-item'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });

    const deleteBtn = this.querySelector('.delete-btn');
    const archiveBtn = this.querySelector('.archive-btn');

    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          detail: { id },
        })
      );
    });

    archiveBtn.addEventListener('click', e => {
      e.stopPropagation();
      const id = this.getAttribute('data-id');
      this.dispatchEvent(
        new CustomEvent('toggle-archive', {
          detail: { id },
        })
      );
    });
  }
}

customElements.define('note-item', NoteItem);
