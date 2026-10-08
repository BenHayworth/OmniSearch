const params = new URLSearchParams(window.location.search);
const query = (params.get('q') || '').trim();
const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
document.querySelector('#files-query').value = query;
const summary = document.querySelector('#result-summary');
summary.textContent = 'Loading saved files...';

async function loadFiles() {
  try {
    const result = await window.omniSearch.getKnowledge();
    const matches = result.files.filter((file) =>
      terms.every((term) => `${file.name} ${file.path}`.toLowerCase().includes(term)));
    const list = document.querySelector('#file-list');
    list.replaceChildren();
    for (const file of matches) {
      const item = document.createElement('li');
      item.className = 'file-entry';
      const title = document.createElement('h2');
      title.textContent = file.name;
      const path = document.createElement('p');
      path.textContent = file.path;
      item.append(title, path);
      list.append(item);
    }
    summary.textContent = `${matches.length} saved ${matches.length === 1 ? 'file' : 'files'}${query ? ` matching “${query}”` : ''}`;
    document.querySelector('#no-matches').hidden = matches.length > 0;
  } catch (error) {
    summary.textContent = 'Could not load saved files. Reload this page to try again.';
    console.error('Loading saved files failed:', error);
  }
}

loadFiles();
