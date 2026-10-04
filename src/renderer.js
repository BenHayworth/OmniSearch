const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
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
  const params = new URLSearchParams({ q: input.value.trim(), category: activeFilter });
  window.location.href = `files.html?${params}`;
});


platform.textContent = window.omniSearch?.platform ? `\u00b7 ${window.omniSearch.platform}` : '';
