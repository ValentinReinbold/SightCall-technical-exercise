const agentName = "Valentin Reinbold";
const agentEmail = "valentinreinbold.pro@gmail.com";
const usecaseID = 19185;
const usecaseName = "Show me";

const morningTime = 9;
const eveningTime = 17;
const period = 0.5;

var dayPicker = document.getElementById("day_picker");
var appointmentTable = document.getElementById("appointment_table");

var day = new Date((new Date()).toDateString());
var appointments = {};

dayPicker.value = day.getFullYear() + "-"
    + (day.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + "-"
    + day.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

dayPicker.addEventListener("change", (event) => {
    day = new Date((new Date(event.target.value)).toDateString());
    update();
});
document.getElementById('delete_all').addEventListener("click", deleteAllAppointments);

update();

function update() {
    listAppointments((success, result) => {
        if (!success) {
            console.log("Listing:", result);
            return;
        }

        var data = result.data;
        var appointmentSortedIDs = [];
        
        if (data && data.length) {
            appointments = {};
            appointments = generateList(data, day);

            appointmentSortedIDs = Object.keys(appointments).sort((a, b) => {
                return appointments[a].startTime.getTime() - appointments[b].startTime.getTime();
            });
        }

        var schedule = {};
        schedule = generateSchedule(appointmentSortedIDs);

        clearTable();
        fillTable(schedule);

        handleButtons(schedule);
    });
}

function generateList(data, day) {
    var list = {};
    data.forEach(str => {
        var appointment = new Appointment(str);
        if (new Date(appointment.startTime.toDateString()) <= day && day <= new Date(appointment.endTime.toDateString())) {
            if (appointment.startTime.getHours() < eveningTime && morningTime < appointment.endTime.getHours()) {
                list[str.id] = appointment;
            }
        }
    });
    return list;
}

function generateSchedule(appointmentSortedIDs) {
    var schedule = {};
    for (var h = morningTime; h < eveningTime; h += period) {
        var appointment = null
        for (var id of appointmentSortedIDs) {
            appointment = appointments[id];
            startHour = appointment.startTime.getHours() + appointment.startTime.getMinutes() / 60;
            endHour = appointment.endTime.getHours() + appointment.endTime.getMinutes() / 60;
            if (startHour < h + period && h < endHour) {
                break;
            }
            appointment = null;
        }
        schedule[h*100] = appointment ? appointment.id : null;
    }
    return schedule;
}

function clearTable() {
    while (appointmentTable.children[1]) {
        appointmentTable.removeChild(appointmentTable.lastChild);
    }
}

function fillTable(schedule) {
    for (const h in schedule) {
        addRow(h, schedule[h]);
    }
}

function addRow(h, id) {
    var hour = Math.floor(h/100);
    var minute = (h/100 == hour ? 0 : period*60);
    var timeStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
        + ":" + minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    var appointment = appointments[id];

    var str = "<tbody><tr>"
        + "<th>" + timeStr + "</th>";
    if (appointment) {
        str += "<td>" + (appointment.agentName ? appointment.agentName : "") + "</td>"
            + "<td>" + (appointment.name ? "\"" + appointment.name + "\"" : "Untitled") + "</td>";
        if (appointment.scheduled) {
            str += "<td><a" + (appointment.waitingRoomURL ? " href='" + appointment.waitingRoomURL + "'" : "") + ">Waiting Room</a></td>"
                + "<td><button class='cancel_button' id='cancel_button_" + h + "' value='" + h + "'>Cancel</button></td>";
        }
        else {
            str += "<td>- Cancelled -</td>"
                + "<td><button class='delete_button' id='delete_button_" + h + "' value='" + h + "'>Delete</button></td>";
        }
    }
    else {
        str += "<td></td>"
            + "<td><input hidden class='new_title' id='new_title_" + h + "' type='text' placeholder='Enter title'></input></td>"
            + "<td></td>"
            + "<td><button class='new_button' id='new_button_" + h + "' value='" + h + "'>New</button>"
            + "<button hidden class='add_button' id='add_button_" + h + "' value='" + h + "'>Add</button></td>";
    }
    str += "</tr></tbody>";
    appointmentTable.insertAdjacentHTML('beforeend', str);
}

function handleButtons(schedule) {
    var newButtons = document.getElementsByClassName('new_button');
    var addButtons = document.getElementsByClassName('add_button');
    var cancelButtons = document.getElementsByClassName('cancel_button');
    var deleteButtons = document.getElementsByClassName('delete_button');

    for (let button of newButtons) {
        button.addEventListener("click", (event) => {
            var h = event.target.value;

            disableButtons(cancelButtons, true);
            disableButtons(newButtons, true);

            button.style.display = 'none';
            document.getElementById('add_button_' + h).style.display = 'block';
            document.getElementById('new_title_' + h).style.display = 'block';
        });
    }

    for (let button of addButtons) {
        button.addEventListener("click", (event) => {
            var h = event.target.value;

            disableButtons(cancelButtons, false);
            disableButtons(newButtons, false);

            var startDate = new Date(day);
            var endDate = new Date(day);
            startDate.setTime(startDate.getTime() + h/100 * 60 * 60 * 1000);
            endDate.setTime(endDate.getTime() + (h/100 + period) * 60 * 60 * 1000);
            
            var newAppointment = new Appointment({
                "startTime": startDate,
                "endTime": endDate,
                "name": document.getElementById('new_title_' + h).value,
                "agentName": agentName,
                "usecaseID": usecaseID,
                "scheduled": true
            });
            createAppointment(newAppointment, (success, result) => {
                if (!success) {
                    console.log("Creation:", result);
                    return;
                }
                update();
            });
        });
    }

    for (let button of cancelButtons) {
        button.addEventListener("click", (event) => {
            var h = event.target.value;
            var appointment = appointments[schedule[h]];
            appointment.scheduled = false;
            updateAppointment(appointment, (success, result) => {
                if (!success) {
                    console.log("Update:", result);
                    return;
                }
                update();
            });
        });
    }

    for (let button of deleteButtons) {
        button.addEventListener("click", (event) => {
            var h = event.target.value;
            var appointment = appointments[schedule[h]];
            deleteAppointment(appointment, (success, result) => {
                if (!success) {
                    console.log("Deletion:", result);
                    return;
                }
                update();
            });
        });
    }
}

function disableButtons(buttons, state) {
    for (let button of buttons) {
        button.disabled = state;
    }
}

function deleteAllAppointments(data) {
    listAppointments((success, result) => {
        if (!success) {
            console.log("Listing:", result);
            return;
        }
        var data = result.data;
        data.forEach((appointment) => {
            deleteAppointment(appointment, (success, result) => {
                if (!success) {
                    console.log("Deletion:", result);
                    return;
                }
                update();
            });
        })
    });
}