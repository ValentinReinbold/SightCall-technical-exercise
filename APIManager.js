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
            console.log(result);
        }
        else {
            console.log("Request failed");
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

function listAppointments() {
    request('GET', "/api/appointments", 200);
}