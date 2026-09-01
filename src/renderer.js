const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const results = document.querySelector('#results');
const filters = document.querySelectorAll('.filter');
const platform = document.querySelector('#platform');

let activeFilter = 'All';

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    input.focus();
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = input.value.trim();

  results.innerHTML = query
    ? `<div class="empty-icon">⌕</div><h2>No ${activeFilter.toLowerCase()} results yet</h2><p>“${escapeHtml(query)}” is ready to connect to a search source.</p>`
    : '<div class="empty-icon">⌕</div><h2>Start searching</h2><p>Your results will appear here.</p>';
});

platform.textContent = window.omniSearch?.platform ? `· ${window.omniSearch.platform}` : '';

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}
