const selectFolder = document.querySelector('#select-folder');
const selectedFolder = document.querySelector('#selected-folder');

selectFolder.addEventListener('click', async () => {
  selectFolder.disabled = true;
  const previousSelection = selectedFolder.textContent;
  try {
    const folder = await window.omniSearch.selectKnowledgeFolder();
    if (folder) {
      const result = await window.omniSearch.search(
        folder
      );
      console.log(result)
      selectedFolder.textContent = folder;
    }
    else selectedFolder.textContent = previousSelection;
  } catch (error) {
    selectedFolder.textContent = 'Could not open the folder picker. Try again.';
    console.error('Folder selection failed:', error);
  } finally {
    selectFolder.disabled = false;
  }
});
