const hostURL = "https://appointment-ppr.sightcall.com";

const name = "SA_Interview";
const APIKey = "w7kPvNc3qyzASMMET17QYDMOsusgVWTp";

function request(info) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(info.method, hostURL + info.endpoint, true);
    xhr.setRequestHeader('Content-Type', "application/vnd.api+json");
    xhr.setRequestHeader('X-Authorization', "Token " + APIKey);
    xhr.timeout = 2500;
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == info.status) {
            var result = xhr.response;
            console.log("Success", result);
        }
        else {
            var errors = xhr.response.errors;
            console.log("Request failed", errors);
        }
    };
    xhr.onerror = function () {
        console.log("Error");
    };
    xhr.ontimeout = function () {
        console.log("Timeout");
    };
    xhr.send(JSON.stringify(info.params));
}

function createAppointment() {
    var params = {
        'data': {
            'type': 'appointments',
            'attributes': {
                'start-time': '2021-12-31T13:00:00.000Z',
                'end-time': '2021-12-31T14:00:00.000Z',
                'product-id': null
            }
        }
    };
    var info = {
        'method': 'POST',
        'endpoint': "/api/appointments",
        'status': 201,
        'params': params
    }
    request(info);
}

function listAppointments() {
    var info = {
        'method': 'GET',
        'endpoint': "/api/appointments",
        'status': 200
    }
    request(info);
}

function retrieveAppointment() {
    var id = 1764;
    var info = {
        'method': 'GET',
        'endpoint': "/api/appointments/" + id,
        'status': 200
    }
    request(info);
}

function updateAppointment() {
    var id = 1764;
    var params = {
        'data': {
            'id': id,
            'type': 'appointments',
            'attributes': {}
        }
    };
    var info = {
        'method': 'PATCH',
        'endpoint': "/api/appointments/" + id,
        'status': 200,
        'params': params
    }
    request(info);
}

function deleteAppointment() {
    var id = 1770;
    var info = {
        'method': 'DELETE',
        'endpoint': "/api/appointments/" + id,
        'status': 204
    }
    request(info);
}
