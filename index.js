const name = "SA_Interview";
const APIKey = "w7kPvNc3qyzASMMET17QYDMOsusgVWTp";

test();

function test() {
    var url = "https://appointment-ppr.sightcall.com/api/appointments";
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', "application/vnd.api+json");
    xhr.setRequestHeader('X-Authorization', "Token " + APIKey);
    xhr.timeout = 2500;
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
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
    xhr.send();
}