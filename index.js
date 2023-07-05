const agentName = "Valentin Reinbold";
const agentEmail = "valentinreinbold.pro@gmail.com";
const usecaseID = 19185;
const usecaseName = "Show me";

const morningTime = 9;
const eveningTime = 18;
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

update();

function update() {
    listAppointments((success, result) => {
        if (!success) {
            console.log("Listing:", result);
            return;
        }

        var data = result.data;
        console.log("Listing:", data);
        if (data && data.length) {

            //deleteAllAppointments(data);

            appointments = {};
            appointments = generateList(data, day);

            var appointmentSortedIDs = Object.keys(appointments).sort((a, b) => {
                return appointments[a].startTime.getTime() - appointments[b].startTime.getTime();
            });

            var schedule = {};
            schedule = generateSchedule(appointmentSortedIDs);

            clearTable();
            fillTable(schedule);
        }
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
    for (var h = morningTime; h <= eveningTime; h += period) {
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

    var str = "<tr><th>" + timeStr + "</th>";
    if (appointment) {
        str += "<td>" + (appointment.startTime ? appointment.startTime.toLocaleDateString() : "") + "</td>"
            + "<td>" + (appointment.startTime ? appointment.startTime.toLocaleTimeString() : "") + "</td>"
            + "<td><a" + (appointment.waitingRoomURL ? " href='" + appointment.waitingRoomURL + "'" : "") + ">"
            + (appointment.name ? "\"" + appointment.name + "\"" : "Untitled")
            + (appointment.agentName ? " - " + appointment.agentName : "")
            + "</a></td>"
            + "<td><button id='cancel_button' id='cancel_button_" + h + "' value='" + h + "'>Cancel</button></td>";
    }
    else {
        str += "<td></td>"
            + "<td></td>"
            + "<td><input hidden class='new_title' id='new_title_" + h + "' type='text' placeholder='Enter title'></input></td>"
            + "<td><button class='new_button' id='new_button_" + h + "' value='" + h + "'>New</button>"
            + "<button hidden class='add_button' id='add_button_" + h + "' value='" + h + "'>Add</button></td>";
    }
    str += "</tr>";
    appointmentTable.insertAdjacentHTML('beforeend', str);
}

function deleteAllAppointments(data) {
    data.forEach((a) => {
        if (a.id != 1764) {
            deleteAppointment(a, (success, result) => {
                if (!success) {
                    console.log("Deletion:", result);
                    return;
                }
                //update();
            });
        }
    })
}