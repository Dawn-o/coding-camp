import { showError } from '../utils/notification.js';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

async function handleResponse(response, errorContext) {
  const responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(`${errorContext}: ${responseJson.message}`);
  }
  return responseJson;
}

async function getNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const { data } = await handleResponse(response, 'Gagal mengambil catatan');
    return data;
  } catch (error) {
    await showError(error.message);
    return [];
  }
}

async function getArchivedNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const { data } = await handleResponse(response, 'Gagal mengambil catatan yang diarsipkan');
    return data;
  } catch (error) {
    await showError(error.message);
    return [];
  }
}

async function addNote(title, body) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    await handleResponse(response, 'Gagal menambahkan catatan');
  } catch (error) {
    await showError(error.message);
  }
}

async function archiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    await handleResponse(response, 'Gagal mengarsipkan catatan');
  } catch (error) {
    await showError(error.message);
  }
}

async function unarchiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    await handleResponse(response, 'Gagal membatalkan arsip catatan');
  } catch (error) {
    await showError(error.message);
  }
}

async function deleteNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response, 'Gagal menghapus catatan');
    return true;
  } catch (error) {
    await showError(error.message);
    return false;
  }
}

export { getNotes, getArchivedNotes, addNote, archiveNote, unarchiveNote, deleteNote };
