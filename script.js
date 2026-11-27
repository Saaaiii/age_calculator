const form = document.getElementById("age-form");
const dobInput = document.getElementById("dob");
const targetInput = document.getElementById("target-date");
const errorMsg = document.getElementById("error-msg");
const resultsSection = document.getElementById("results");

// Default target date to today
const todayStr = new Date().toISOString().split("T")[0];
targetInput.value = todayStr;
dobInput.max = todayStr;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  if (!dobInput.value) {
    errorMsg.textContent = "Please select your date of birth.";
    resultsSection.classList.add("hidden");
    return;
  }

  // Parse YYYY-MM-DD as local dates to avoid timezone shifts
  const [bYear, bMonth, bDay] = dobInput.value.split("-").map(Number);
  const [tYear, tMonth, tDay] = (targetInput.value || todayStr).split("-").map(Number);

  const birthDate = new Date(bYear, bMonth - 1, bDay);
  const targetDate = new Date(tYear, tMonth - 1, tDay);

  if (birthDate > targetDate) {
    errorMsg.textContent = "Date of birth cannot be after the target date.";
    resultsSection.classList.add("hidden");
    return;
  }

  // 1. Exact Years, Months, Days calculation
  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    months--;
    // Get days in the month prior to targetDate
    const daysInPrevMonth = new Date(tYear, tMonth - 1, 0).getDate();
    days += daysInPrevMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // 2. Total Days Lived
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((targetDate - birthDate) / msPerDay);

  // 3. Next Birthday Countdown (relative to target date)
  let nextBday = new Date(tYear, bMonth - 1, bDay);
  if (nextBday < targetDate) {
    nextBday.setFullYear(tYear + 1);
  }
  const daysUntilBday = Math.round((nextBday - targetDate) / msPerDay);
  const dayOfWeek = nextBday.toLocaleDateString("en-US", { weekday: "long" });

  // Render Results
  document.getElementById("years").textContent = years;
  document.getElementById("months").textContent = months;
  document.getElementById("days").textContent = days;
  document.getElementById("total-days").textContent = totalDays.toLocaleString();
  document.getElementById("next-bday").textContent =
    daysUntilBday === 0
      ? `Happy Birthday! (${dayOfWeek})`
      : `${daysUntilBday} days away (on a ${dayOfWeek})`;

  resultsSection.classList.remove("hidden");
});
