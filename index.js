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

update();

function update() {
    listAppointments((success, result) => {
        if (!success) {
            console.log(result);
            return;
        }

        var data = result.data;
        if (data && data.length) {
            appointments = {};
            appointments = generateList(data, day);

            var appointmentSortedIDs = Object.keys(appointments).sort((a, b) => {
                return appointments[a].startTime.getTime() - appointments[b].startTime.getTime();
            });

            clearTable();
            fillTable(appointmentSortedIDs);
        }
    });
}

function generateList(data, day) {
    var list = {};
    data.forEach(str => {
        var appointment = new Appointment(str);
        if (new Date(appointment.startTime.toDateString()) <= day && day <= new Date(appointment.endTime.toDateString())) {
            if (appointment.startTime.getHours() < eveningTime && morningTime < appointment.endTime.getHours()) {
                list[str.id] = new Appointment(str);
            }
        }
    });
    return list;
}

function clearTable() {
    while (appointmentTable.children[1]) {
        appointmentTable.removeChild(appointmentTable.lastChild);
    }
}

function fillTable(appointmentSortedIDs) {
    for (var h = morningTime; h <= eveningTime; h += period) {
        var hour = Math.floor(h);
        var minute = (h == hour ? 0 : period*60);
        var timeStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
            + ":" + minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});

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
        addRow(timeStr, appointment);
    }
}

function addRow(timeStr, appointment) {
    var str = "<tr><th>" + timeStr + "</th>";
    if (appointment) {
        str += "<th>" + (appointment.startTime ? appointment.startTime.toLocaleDateString() : "") + "</th>"
            + "<th>" + (appointment.startTime ? appointment.startTime.toLocaleTimeString() : "") + "</th>"
            + "<th><a" + (appointment.waitingRoomURL ? " href='" + appointment.waitingRoomURL + "'" : "") + ">"
            + (appointment.name ? "\"" + appointment.name + "\"" : "Untitled")
            + (appointment.agentName ? " - " + appointment.agentName : "")
            + "</a></th>";
    }
    else {
        str += "<th></th>"
            + "<th></th>"
            + "<th></th>";
    }
    str += "</tr>";
    appointmentTable.insertAdjacentHTML('beforeend', str);
}