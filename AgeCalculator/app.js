window.onload = function() {
    populateYear('dob-year');
    populateMonth('dob-month');
    updateDays('dob');

    populateYear('ref-year');
    populateMonth('ref-month');
    updateDays('ref');
    setTodayOption(); // Set the "Today" option in reference date
};

// Populate years from 2024 down to 1900
function populateYear(id) {
    let yearDropdown = document.getElementById(id);
    let currentYear = new Date().getFullYear();

    // Populate years from current year down to 1900
    for (let year = currentYear; year >= 1900; year--) {
        let option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearDropdown.add(option);
    }
}

// Populate months from January to December
function populateMonth(id) {
    let monthDropdown = document.getElementById(id);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let month = 0; month < 12; month++) {
        let option = document.createElement('option');
        option.value = month + 1; // months are 1-based
        option.text = monthNames[month];
        monthDropdown.add(option);
    }
}

// Update the days dropdown based on the selected month and year
function updateDays(type) {
    let dayDropdown = document.getElementById(`${type}-day`);
    let month = document.getElementById(`${type}-month`).value;
    let year = document.getElementById(`${type}-year`).value;

    // Clear the previous day options
    dayDropdown.innerHTML = '';

    // Get the correct number of days for the selected month and year
    let daysInMonth = getDaysInMonth(month, year);
    
    // Populate the day dropdown with the correct number of days
    for (let day = 1; day <= daysInMonth; day++) {
        let option = document.createElement('option');
        option.value = day;
        option.text = day;
        dayDropdown.add(option);
    }
}

// Get the number of days in a month, accounting for leap years
function getDaysInMonth(month, year) {
    month = parseInt(month);
    year = parseInt(year);

    // Handle leap years for February
    if (month === 2) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    // April, June, September, November have 30 days
    else if (month === 4 || month === 6 || month === 9 || month === 11) {
        return 30;
    }
    // All other months have 31 days
    else {
        return 31;
    }
}

// Set "Today" as an option for reference date dropdowns (day, month, year)
function setTodayOption() {
    const todayBtn = document.createElement('button');
    todayBtn.textContent = "Set Today";
    todayBtn.classList.add('today-btn');
    document.querySelector('.date-inputs:last-child').appendChild(todayBtn);

    todayBtn.addEventListener('click', () => {
        let today = new Date();
        
        // Set today's day, month, and year in the reference date dropdowns
        document.getElementById('ref-day').value = today.getDate();
        document.getElementById('ref-month').value = today.getMonth() + 1; // JS months are 0-indexed
        document.getElementById('ref-year').value = today.getFullYear();
    });
}

// Calculate age and display results
document.getElementById('calculate-btn').addEventListener('click', calculateAge);

// Calculate age and display results
function calculateAge() {
    const dobDay = document.getElementById('dob-day').value;
    const dobMonth = document.getElementById('dob-month').value;
    const dobYear = document.getElementById('dob-year').value;

    const refDay = document.getElementById('ref-day').value;
    const refMonth = document.getElementById('ref-month').value;
    const refYear = document.getElementById('ref-year').value;

    const resultDiv = document.getElementById('age-result');

    // Default end date: Today, if reference date is not provided
    let endDate = new Date();
    if (refDay && refMonth && refYear) {
        endDate = new Date(refYear, refMonth - 1, refDay);
    }

    // Check if all fields are filled out
    if (!dobDay || !dobMonth || !dobYear) {
        resultDiv.textContent = "Please fill out all the fields!";
        resultDiv.classList.add('error');
        return;
    }

    // Create Date objects for the selected birth date and reference date
    const dob = new Date(dobYear, dobMonth - 1, dobDay); // JS months are 0-indexed

    // Check if the date of birth is later than the reference date
    if (dob > endDate) {
        resultDiv.textContent = "The reference date must be later than the date of birth.";
        resultDiv.classList.add('error');
        return;
    }

    // Calculate age in years, months, and days
    let years = endDate.getFullYear() - dob.getFullYear();
    let months = endDate.getMonth() - dob.getMonth();
    let days = endDate.getDate() - dob.getDate();

    // Adjust for negative months and days
    if (days < 0) {
        months--;
        days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate(); // Get the last day of the previous month
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Total days, weeks, hours, minutes, and seconds
    let totalDays = Math.floor((endDate - dob) / (1000 * 60 * 60 * 24));
    let totalWeeks = Math.floor(totalDays / 7);
    let totalHours = totalDays * 24;
    let totalMinutes = totalHours * 60;
    let totalSeconds = totalMinutes * 60;

    // Display the results
    resultDiv.classList.remove('error');
    resultDiv.innerHTML = `
        <p><strong>1. Age:</strong> ${years} years, ${months} months, ${days} days</p>
        <p><strong>2. Total Time:</strong></p>
        <p><strong>Months and Days:</strong> ${years * 12 + months} months, ${days} days</p>
        <p><strong>Weeks and Days:</strong> ${totalWeeks} weeks, ${days} days</p>
        <p><strong>Total Days:</strong> ${totalDays.toLocaleString()}</p>
        <p><strong>Total Hours:</strong> ${totalHours.toLocaleString()}</p>
        <p><strong>Total Minutes:</strong> ${totalMinutes.toLocaleString()}</p>
        <p><strong>Total Seconds:</strong> ${totalSeconds.toLocaleString()}</p>
    `;

    // Start live seconds update (optional, but can be added as before)
    startLiveSeconds(totalSeconds);
}



// Function to update live seconds count
let liveSecondsInterval;  // Declare the interval globally

function startLiveSeconds(initialSeconds) {
    let liveSecondsDiv = document.getElementById('live-seconds');
    let currentSeconds = initialSeconds;

    // If the interval already exists, clear it to prevent multiple intervals
    if (liveSecondsInterval) {
        clearInterval(liveSecondsInterval);
    }

    // Set a new interval
    liveSecondsInterval = setInterval(() => {
        liveSecondsDiv.textContent = `Live Seconds: ${++currentSeconds}`;
    }, 1000);
}

