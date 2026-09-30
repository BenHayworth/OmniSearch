const entries = [
  { name: 'Project roadmap.pdf', category: 'Files', description: 'Milestones and launch plans for OmniSearch.' },
  { name: 'Monthly budget.xlsx', category: 'Files', description: 'Team expenses and budget planning for September.' },
  { name: 'Website mockups.png', category: 'Files', description: 'Homepage design and search interface concepts.' },
  { name: 'Product requirements.docx', category: 'Files', description: 'Search features and project requirements.' },
  { name: 'Vacation itinerary.pdf', category: 'Files', description: 'Travel dates, hotel reservations, and activities.' },
  { name: 'Customer feedback.csv', category: 'Files', description: 'Feedback about the website and product launch.' },
  { name: 'Team meeting notes', category: 'Notes', description: 'Project updates, decisions, and next steps.' },
  { name: 'Design ideas', category: 'Notes', description: 'Ideas for the search interface and saved files page.' },
  { name: 'Shopping list', category: 'Notes', description: 'Coffee, fruit, bread, and office supplies.' },
  { name: 'Launch checklist', category: 'Notes', description: 'Website review and product launch tasks.' },
  { name: 'Design inspiration', category: 'Links', description: 'Website layouts and interface examples.' },
  { name: 'JavaScript guide', category: 'Links', description: 'Learning resources for JavaScript development.' },
];

const params = new URLSearchParams(window.location.search);
const query = (params.get('q') || '').trim();
const category = ['Files', 'Notes', 'Links'].includes(params.get('category')) ? params.get('category') : 'All';
const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
const matches = entries.filter((entry) => {
  const text = `${entry.name} ${entry.description}`.toLowerCase();
  return (category === 'All' || entry.category === category) && terms.every((term) => text.includes(term));
});

document.querySelector('#files-query').value = query;
document.querySelector('#files-category').value = category;
document.querySelector('#result-summary').textContent = `${matches.length} ${matches.length === 1 ? 'entry' : 'entries'}${query ? ` matching “${query}”` : ''}${category !== 'All' ? ` in ${category}` : ''}`;
const list = document.querySelector('#file-list');
for (const entry of matches) {
  const item = document.createElement('li');
  item.className = 'file-entry';
  const label = document.createElement('span');
  label.className = 'file-category';
  label.textContent = entry.category;
  const title = document.createElement('h2');
  title.textContent = entry.name;
  const description = document.createElement('p');
  description.textContent = entry.description;
  item.append(label, title, description);
  list.append(item);
}
document.querySelector('#no-matches').hidden = matches.length > 0;
