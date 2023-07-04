const hostURL = "https://appointment-ppr.sightcall.com";

const name = "SA_Interview";
const APIKey = "w7kPvNc3qyzASMMET17QYDMOsusgVWTp";

function request(method, endpoint, status, params) {
    var url = hostURL + endpoint;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', "application/vnd.api+json");
    xhr.setRequestHeader('X-Authorization', "Token " + APIKey);
    xhr.timeout = 2500;
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == status) {
            var result = xhr.response;
            console.log("Success", result);
        }
        else {
            console.log("Request failed", xhr);
        }
    };
    xhr.onerror = function () {
        console.log("Error");
    };
    xhr.ontimeout = function () {
        console.log("Timeout");
    };
    xhr.send(JSON.stringify(params));
}

function createAppointment() {
    params = {
        'data': {
            'type': 'appointments',
            'attributes': {
                'start-time': '2021-12-31T13:00:00.000Z',
                'end-time': '2021-12-31T14:00:00.000Z',
                'product-id': null
            }
        }
    };
    request('POST', "/api/appointments", 201, params);
}

function listAppointments() {
    request('GET', "/api/appointments", 200);
}

function retrieveAppointment() {
    id = 1764;
    request('GET', "/api/appointments/" + id, 200);
}

function updateAppointment() {
    id = 1764;
    params = {
        'data': {
            'id': id,
            'type': 'appointments',
            'attributes': {}
        }
    };
    request('PATCH', "/api/appointments/" + id, 200, params);
}

function deleteAppointment() {
    id = 1767;
    request('DELETE', "/api/appointments/" + id, 204);
}
