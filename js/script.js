//  Code for the Weather App

let reminders = [];
let editReminderId = null;

// Function to load reminders from local storage
function loadReminders() {
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
        reminders = JSON.parse(storedReminders);
        displayReminders();
    }
}

// Function to save reminders to local storage
function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Function to add a reminder
function addReminder() {
    const reminderTime = document.getElementById('reminderTime').value;
    if (!reminderTime) {
        alert('Please set a valid time for the reminder.');
        return;
    }

// Create a reminder object with a unique ID and the reminder time
    const reminder = {
        id: Date.now(),
        time: reminderTime,
    };

// Add the reminder to the reminders array, save the reminders to local storage, display the reminders, and show a success message
    reminders.push(reminder);
    saveReminders();
    displayReminders();
    document.getElementById('reminderMessage').innerText = 'Reminder set for ' + reminderTime;

    setNotification(reminderTime);
}

// Function to edit a reminder
function editReminder(id) {
    editReminderId = id;
    const reminder = reminders.find(reminder => reminder.id === id);
    document.getElementById('editReminderTime').value = reminder.time;
    document.getElementById('editModal').style.display = 'block';
    
}

// Function to save the edited reminder
function saveEditedReminder() {
    const newTime = document.getElementById('editReminderTime').value;
    if (!newTime) {
        alert('Please set a valid time for the reminder.');
        return;
    }

    const reminder = reminders.find(reminder => reminder.id === editReminderId);
    reminder.time = newTime;
    saveReminders();
    displayReminders();
    closeModal();
}

// Function to delete a reminder
function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders();
    displayReminders();
}

// Function to display reminders
function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';
    reminders.forEach(reminder => {
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item';
        reminderItem.innerHTML = `
            <span>${reminder.time}</span>
            <div>
                <button onclick="editReminder(${reminder.id})">Edit</button>
                <button onclick="deleteReminder(${reminder.id})">Delete</button>
            </div>
        `;
        reminderList.appendChild(reminderItem);
    });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    
}

function handleKeyUp(event){
    if (event.key === "Enter" || event.key === " ") {
        closeModal();
    }
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        closeModal();
    }

}

function saveEditReminder() {
    console.log('Reminder saved');
}

function editReminderTime(){
    console.log('Editing reminder time...');
}
 
// Function to fetch the weather data
async function fetchUVIndex() {
    const city = document.getElementById('city').value;
    const apiKey = '05263c6d5fd86fccce9977f1f7495061'; // Replace with your OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
// Fetch the weather data from the OpenWeather API
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
// Parse the weather data and extract the latitude and longitude

        const weatherData = await response.json();
        const { lat, lon } = weatherData.coord;
        // Fetch the UV index data from the OpenWeather API
        const uvApiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        const uvResponse = await fetch(uvApiUrl);
        if (!uvResponse.ok) {
            throw new Error(`Error: ${uvResponse.status} ${uvResponse.statusText}`);
        }
// Parse the UV index data and display the UV index
        const uvData = await uvResponse.json();
        document.getElementById('uvIndexDisplay').innerText = `UV Index: ${uvData.value}`;
        document.getElementById('errorDisplay').innerText = '';


        displayUVAdvice(uvData.value);
    } catch (error) {
        document.getElementById('errorDisplay').innerText = error.message;
        document.getElementById('uvIndexDisplay').innerText = '';
    }
}

function displayUVAdvice(uvIndex) {
    let advice = '';
    if (uvIndex < 3) {
        advice = 'Low risk. Wear sunglasses on bright days.';
    } else if (uvIndex < 6) {
        advice = 'Moderate risk. Wear sunglasses and a hat.';
    } else if (uvIndex < 8) {
        advice = 'High risk. Wear sunglasses, a hat, and sunscreen.';
    } else if (uvIndex < 11) {
        advice = 'Very high risk. Stay indoors or wear sunglasses, a hat, and sunscreen.';
    } else {
        advice = 'Extreme risk. Stay indoors or wear sunglasses, a hat, and sunscreen.';
    }
    document.getElementById('uvIndexDisplay').innerHTML += `<p>${advice}</p>`;

}

function setNotification(time) {
    if(typeof window.Notification === 'undefined') {
        alert('This browser does not support notifications.');
    } else if (Notification.permission === 'granted') {
        scheduleNotification(time);
    }else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                scheduleNotification(time);
            }
        });
    }
}

function scheduleNotification(time) {
    const currentTime = new Date();
    const reminderDate = new Date(currentTime.toDateString() + ' ' + time);

    if(reminderDate > currentTime) {
        const timeDiff = reminderDate - currentTime;
        setTimeout(() => {
            new Notification("Sun Safety Reminder", {
                body: "Time to reapply sunscreen"
            });
        }, timeDiff);
    }
}

function showNotification() {
    new Notification("Sun Safety Reminder", {
        body: "Time to reapply sunscreen"
    });
}
window.onload = loadReminders;
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
window.getLocation = function() {
    console.log("Getting location...");
    // Your logic here
  };