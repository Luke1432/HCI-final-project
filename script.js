const calendarGrid = document.getElementById('calendar-grid');
const monthSelect = document.getElementById('month-select');

function initializeCalendar(year, month) {
    calendarGrid.innerHTML = '';

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the selected month

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayCell.innerHTML = `<strong>${day}</strong>`;
        calendarGrid.appendChild(dayCell);
    }
}

monthSelect.addEventListener('change', () => {
    const [year, month] = monthSelect.value.split('-');
    initializeCalendar(parseInt(year), parseInt(month) - 1);
});

const [defaultYear, defaultMonth] = monthSelect.value.split('-');
initializeCalendar(parseInt(defaultYear), parseInt(defaultMonth) - 1);