document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('dashboard-search');
  const searchableItems = Array.from(document.querySelectorAll('[data-search]'));
  const defaultDisplays = new Map();

  searchableItems.forEach((item) => {
    defaultDisplays.set(item, getComputedStyle(item).display || 'block');
  });

  const filterItems = (query) => {
    const normalized = query.trim().toLowerCase();
    searchableItems.forEach((item) => {
      const haystack = (item.dataset.search || item.textContent).toLowerCase();
      const shouldShow = !normalized || haystack.includes(normalized);
      item.style.display = shouldShow ? defaultDisplays.get(item) : 'none';
    });
  };

  if (searchInput) {
    filterItems(searchInput.value);
    searchInput.addEventListener('input', (event) => {
      filterItems(event.target.value);
    });
  }

  const chartBars = Array.from(document.querySelectorAll('.chart-bars .bar'));
  const datasets = {
    '12 Months': [60, 75, 55, 90, 78, 68, 82, 57, 88, 64, 92, 73],
    '6 Months': [42, 58, 63, 74, 69, 77, 71, 65, 80, 67, 76, 72],
    '30 Days': [36, 48, 52, 60, 55, 63, 59, 53, 61, 50, 58, 56],
    '7 Days': [28, 34, 39, 44, 41, 47, 43, 38, 45, 36, 42, 40],
  };

  if (chartBars.length) {
    const baseline = datasets['12 Months'];
    chartBars.forEach((bar, index) => {
      const initial = baseline?.[index] ?? 0;
      if (!bar.style.getPropertyValue('--value')) {
        bar.style.setProperty('--value', `${initial}%`);
      }
      bar.setAttribute('aria-label', `12 Months · ${bar.dataset.month} · ${initial}%`);
    });
  }

  const chipButtons = document.querySelectorAll('.chip-group .chip');

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      chipButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      const label = chip.textContent.trim();
      const values = datasets[label];
      if (values && values.length === chartBars.length) {
        chartBars.forEach((bar, index) => {
          const value = values[index];
          bar.style.setProperty('--value', `${value}%`);
          bar.setAttribute('aria-label', `${label} · ${bar.dataset.month} · ${value}%`);
        });
      }
    });
  });
});
