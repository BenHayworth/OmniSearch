const MAX_VISIBLE_FILES = 20;
const selectFolder = document.querySelector('#select-folder');
const selectedFolder = document.querySelector('#selected-folder');
const fileList = document.querySelector('#file-list');
const selectedFiles = document.querySelector('#selected-files');
const fileCount = document.querySelector('#file-count');
const previewSummary = document.querySelector('#file-preview-summary');
const selectionStatus = document.querySelector('#selection-status');
const addToKnowledge = document.querySelector('#add-to-knowledge');
const saveStatus = document.querySelector('#save-status');
let pendingFiles = [];

selectFolder.addEventListener('click', async () => {
  selectFolder.disabled = true;
  addToKnowledge.disabled = true;
  selectionStatus.textContent = '';
  try {
    const folder = await window.omniSearch.selectKnowledgeFolder();
    if (!folder) return;
    pendingFiles = [];
    selectedFiles.hidden = true;
    saveStatus.textContent = '';
    selectionStatus.textContent = 'Reading folder files...';
    selectFolder.textContent = 'Reading...';
    const result = await window.omniSearch.search(folder);
    if (!Array.isArray(result.files) || !result.files.every((file) => typeof file === 'string')) {
      throw new Error('Invalid file list returned.');
    }
    const files = result.files;
    pendingFiles = files;
    const visibleFiles = files.slice(0, MAX_VISIBLE_FILES);
    const rows = visibleFiles.map((file) => {
      const row = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'knowledge-file-name';
      name.textContent = file.split(/[\\/]/).pop();
      const path = document.createElement('span');
      path.className = 'knowledge-file-path';
      path.textContent = file;
      row.append(name, path);
      return row;
    });
    fileList.replaceChildren(...rows);
    selectedFolder.textContent = folder;
    fileCount.textContent = `${files.length} ${files.length === 1 ? 'file' : 'files'}`;
    previewSummary.textContent = files.length === 0
      ? 'No files found in this folder.'
      : `Showing ${visibleFiles.length} of ${files.length} files${files.length > MAX_VISIBLE_FILES ? ` (${files.length - MAX_VISIBLE_FILES} more).` : '.'}`;
    selectedFiles.hidden = false;
    selectionStatus.textContent = 'Folder selected.';
  } catch (error) {
    selectionStatus.textContent = 'Could not read the folder. Try selecting it again.';
    console.error('Folder selection failed:', error);
  } finally {
    selectFolder.disabled = false;
    addToKnowledge.disabled = pendingFiles.length === 0;
    selectFolder.textContent = selectedFiles.hidden ? 'Select folder' : 'Change folder';
  }
});

addToKnowledge.addEventListener('click', async () => {
  addToKnowledge.disabled = true;
  selectFolder.disabled = true;
  saveStatus.textContent = 'Saving files...';
  try {
    const result = await window.omniSearch.addToKnowledge(pendingFiles);
    saveStatus.textContent = `${result.added} new files saved. View your saved files on the Files page.`;
  } catch (error) {
    saveStatus.textContent = 'Could not save files. Please try again.';
    addToKnowledge.disabled = false;
    console.error('Saving files failed:', error);
  } finally {
    selectFolder.disabled = false;
  }
});
