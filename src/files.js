const params = new URLSearchParams(window.location.search);
const query = (params.get('q') || '').trim();
const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
document.querySelector('#files-query').value = query;
const summary = document.querySelector('#result-summary');
const selectedPaths = new Set();
const deleteButton = document.querySelector('#delete-selected');
const deleteStatus = document.querySelector('#delete-status');
let deleting = false;
summary.textContent = 'Loading saved files...';

function updateSelection() {
  document.querySelector('#selection-count').textContent = `${selectedPaths.size} selected`;
  deleteButton.disabled = deleting || selectedPaths.size === 0;
}

function renderFiles(files) {
  selectedPaths.clear();
  updateSelection();
  const matches = files.filter((file) =>
    terms.every((term) => `${file.name} ${file.path}`.toLowerCase().includes(term)));
  const list = document.querySelector('#file-list');
  list.replaceChildren();
  for (const file of matches) {
    const item = document.createElement('li');
    item.className = 'file-entry';
    const label = document.createElement('label');
    label.className = 'file-selection';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', `Select ${file.name} (${file.path})`);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedPaths.add(file.path);
      else selectedPaths.delete(file.path);
      updateSelection();
    });
    const details = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = file.name;
    const path = document.createElement('p');
    path.textContent = file.path;
    details.append(title, path);
    label.append(checkbox, details);
    item.append(label);
    list.append(item);
  }
  summary.textContent = `${matches.length} saved ${matches.length === 1 ? 'file' : 'files'}${query ? ` matching "${query}"` : ''}`;
  document.querySelector('#no-matches').hidden = matches.length > 0;
}

async function loadFiles() {
  try {
    const result = await window.omniSearch.getKnowledge();
    renderFiles(result.files);
  } catch (error) {
    summary.textContent = 'Could not load saved files. Reload this page to try again.';
    console.error('Loading saved files failed:', error);
  }
}

deleteButton.addEventListener('click', async () => {
  if (deleting || selectedPaths.size === 0) return;
  deleting = true;
  updateSelection();
  document.querySelectorAll('#file-list input').forEach((input) => { input.disabled = true; });
  deleteStatus.textContent = 'Deleting selected entries...';
  try {
    const result = await window.omniSearch.deleteKnowledge([...selectedPaths]);
    renderFiles(result.files);
    deleteStatus.textContent = `${result.deleted} saved ${result.deleted === 1 ? 'entry' : 'entries'} deleted.`;
  } catch (error) {
    deleteStatus.textContent = 'Could not delete selected entries. Try again.';
    console.error('Deleting saved files failed:', error);
  } finally {
    deleting = false;
    document.querySelectorAll('#file-list input').forEach((input) => { input.disabled = false; });
    updateSelection();
  }
});

loadFiles();
