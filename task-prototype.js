const taskNameInput = document.getElementById("taskName");
const dueDateInput = document.getElementById("dueDate");
const prioritySelect = document.getElementById("priority");
const estimateInput = document.getElementById("estimateHours");
const generateBtn = document.getElementById("generateBtn");

const errorMsg = document.getElementById("errorMsg");
const resultSection = document.getElementById("resultSection");
const summaryText = document.getElementById("summaryText");
const suggestionsList = document.getElementById("suggestionsList");

generateBtn.addEventListener("click", handleGenerate);

function handleGenerate() {
    const task = taskNameInput.value.trim();
    const due = dueDateInput.value;
    const priority = prioritySelect.value;
    const hours = Number(estimateInput.value);

    if (!task || !due || !hours) {
        showError("Please fill in all fields.");
        return;
    }

    hideError();

    const slots = generateStudySlots(new Date(), new Date(due), hours, priority);
    renderResults(task, new Date(due), priority, slots);
}

function showError(msg) {
    errorMsg.textContent = msg;
    resultSection.classList.add("hidden");
}
function hideError() {
    errorMsg.textContent = "";
}

function generateStudySlots(today, due, hours, priority) {
    const days = Math.max(1, Math.round((due - today) / (24*60*60*1000)));
    const blocks = Math.min(3, days);
    const perBlock = Math.ceil(hours / blocks);
    const slots = [];

    for (let i = 0; i < blocks; i++) {
        const date = new Date(today.getTime() + (i+1)*(days/(blocks+1))*24*60*60*1000);
        slots.push({
            dateLabel: date.toDateString(),
            timeRange: ["6 PM – 8 PM", "2 PM – 4 PM", "10 AM – 12 PM"][i],
            hours: perBlock,
            note: i === blocks-1 ? "Final review." : "Focus on main sections."
        });
    }

    return slots;
}

function renderResults(task, due, priority, slots) {
    summaryText.textContent = `Suggested plan for “${task}” (due ${due.toDateString()}, ${priority} priority):`;
    suggestionsList.innerHTML = "";

    slots.forEach((slot, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>Session ${i+1} – ${slot.dateLabel}</strong><br>
            ${slot.timeRange} (${slot.hours} hours)<br>
            <em>${slot.note}</em>
        `;
        suggestionsList.appendChild(li);
    });

    resultSection.classList.remove("hidden");
}

