const hostURL = "https://appointment-ppr.sightcall.com";

const name = "SA_Interview";
const APIKey = "w7kPvNc3qyzASMMET17QYDMOsusgVWTp";

function request(info, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(info.method, hostURL + info.endpoint, true);
    xhr.setRequestHeader('Content-Type', "application/vnd.api+json");
    xhr.setRequestHeader('X-Authorization', "Token " + APIKey);
    xhr.timeout = 2500;
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == info.status) {
            var result = xhr.response;
            callback(true, result);
        }
        else {
            callback(false, "Request failed");
        }
    };
    xhr.onerror = function () {
        callback(false, "Error");
    };
    xhr.ontimeout = function () {
        callback(false, "Timeout");
    };
    xhr.send(JSON.stringify(info.params));
}

function createAppointment(appointment, callback) {
    var params = appointment.toJSON();
    params.data.attributes['product-id'] = null;
    var info = {
        'method': 'POST',
        'endpoint': "/api/appointments",
        'status': 201,
        'params': params
    }
    request(info, callback);
}

function listAppointments(callback) {
    var info = {
        'method': 'GET',
        'endpoint': "/api/appointments",
        'status': 200
    }
    request(info, callback);
}

function retrieveAppointment(appointment, callback) {
    var info = {
        'method': 'GET',
        'endpoint': "/api/appointments/" + appointment.id,
        'status': 200
    }
    request(info, callback);
}

function updateAppointment(appointment, callback) {
    var params = appointment.toJSON();
    var info = {
        'method': 'PATCH',
        'endpoint': "/api/appointments/" + appointment.id,
        'status': 200,
        'params': params
    }
    request(info, callback);
}

function deleteAppointment(appointment, callback) {
    var info = {
        'method': 'DELETE',
        'endpoint': "/api/appointments/" + appointment.id,
        'status': 204
    }
    request(info, callback);
}
