import './assets/styles.css';
import './components/AppBar.js';
import './components/NoteForm.js';
import './components/NoteItem.js';
import './components/LoadingIndicator.js';
import {
  getNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from './data/api.js';
import { showConfirm, showSuccess, showError } from './utils/notification.js';

document.addEventListener('DOMContentLoaded', async () => {
  const notesContainer = document.getElementById('notes-container');
  const archivedNotesContainer = document.getElementById('archived-notes');
  const loadingIndicator = document.querySelector('.loading-indicator');
  const archivedSection = document.getElementById('archived-section');
  const archivedToggle = document.getElementById('archive-toggle');

  archivedNotesContainer.style.display = 'none';

  function updateArchivedCount() {
    const count = document.querySelectorAll('#archived-notes > note-item').length;
    archivedToggle.innerHTML = `
      ${archivedNotesContainer.style.display === 'none' ? '▶' : '▼'} 
      Catatan Arsip (${count})
    `;
  }

  archivedToggle.addEventListener('click', () => {
    const isHidden = archivedNotesContainer.style.display === 'none';

    gsap.to(archivedNotesContainer, {
      height: isHidden ? 'auto' : 0,
      opacity: isHidden ? 1 : 0,
      duration: 0.2,
      onComplete: () => {
        archivedNotesContainer.style.display = isHidden ? 'grid' : 'none';
        updateArchivedCount();
      },
    });
  });

  function showLoading() {
    loadingIndicator.classList.add('show-loading');
  }

  function hideLoading() {
    loadingIndicator.classList.remove('show-loading');
  }

  async function renderAllNotes() {
    showLoading();
    try {
      const [activeNotes, archivedNotes] = await Promise.all([getNotes(), getArchivedNotes()]);

      await gsap.to('#notes-container > *', {
        opacity: 0,
        y: -20,
        stagger: 0.05,
        duration: 0.2,
      });
      await gsap.to('#archived-notes > *', {
        opacity: 0,
        y: -20,
        stagger: 0.05,
        duration: 0.2,
      });

      notesContainer.innerHTML = '';
      archivedNotesContainer.innerHTML = '';

      activeNotes.forEach(note => renderNote(note, notesContainer, false));
      archivedNotes.forEach(note => renderNote(note, archivedNotesContainer, true));

      updateArchivedCount();
    } catch (error) {
      await showError(error.message);
    } finally {
      hideLoading();
    }
  }

  function renderNote(note, container, isArchived) {
    const noteElement = document.createElement('note-item');
    noteElement.setAttribute('title', note.title);
    noteElement.setAttribute('content', note.body);
    noteElement.setAttribute('createdAt', note.createdAt);
    noteElement.setAttribute('data-id', note.id);
    if (isArchived) noteElement.setAttribute('archived', '');

    noteElement.addEventListener('delete-note', async event => {
      const { id } = event.detail;
      if (await showConfirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        await gsap.to(noteElement, {
          opacity: 0,
          x: -100,
          duration: 0.3,
        });

        showLoading();
        try {
          const success = await deleteNote(id);
          if (success) {
            await showSuccess('Catatan berhasil dihapus');
            await renderAllNotes();
          }
        } catch (error) {
          await showError(error.message);

          gsap.to(noteElement, {
            opacity: 1,
            x: 0,
            duration: 0.3,
          });
        } finally {
          hideLoading();
        }
      }
    });

    noteElement.addEventListener('toggle-archive', async () => {
      showLoading();
      try {
        if (isArchived) {
          await unarchiveNote(note.id);
          await showSuccess('Catatan berhasil dipindahkan dari arsip');
        } else {
          await archiveNote(note.id);
          await showSuccess('Catatan berhasil diarsipkan');
        }
        await renderAllNotes();
      } catch (error) {
        await showError(error.message);
      } finally {
        hideLoading();
      }
    });

    container.appendChild(noteElement);
  }

  document.addEventListener('add-note', async event => {
    const { title, body } = event.detail;
    showLoading();
    try {
      await addNote(title, body);
      renderAllNotes();
    } catch (error) {
      alert(`Gagal menambah catatan: ${error.message}`);
    } finally {
      hideLoading();
    }
  });

  renderAllNotes();
});
