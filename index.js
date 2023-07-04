var appointmentTable = document.getElementById("appointment_table");

var appointments = {};

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
            appointments = generateList(data);

            var appointmentSortedIDs = Object.keys(appointments).sort((a, b) => {
                return appointments[a].startTime.getTime() - appointments[b].startTime.getTime();
            });

            appointmentSortedIDs.forEach(id => {
                console.log(appointments[id].toString());
                addInTable(appointments[id]);
            });
        }

    });
}

function generateList(data) {
    var list = {};
    data.forEach(str => {
        list[str.id] = new Appointment(str);
    });
    return list;
}

function addInTable(appointment) {
    var str = "<tr>"
            + "<th>" + appointment.startTime.toLocaleDateString() + "</th>"
            + "<th>" + appointment.startTime.toLocaleTimeString() + "</th>"
            + "<th><a" + (appointment.waitingRoomURL ? " href='" + appointment.waitingRoomURL + "'" : "") + ">"
            + (appointment.name ? "\"" + appointment.name + "\"" : "Untitled")
            + (appointment.agentName ? " - " + appointment.agentName : "")
            + "</a></th>"
            + "<th></th>"
            + "</tr>";
    appointmentTable.insertAdjacentHTML('beforeend', str);
}