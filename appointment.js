class Appointment {
    
    constructor(str) {

        let instance = this;

        this.id = null;
        this.startTime = null;
        this.endTime = null;
        this.name = null;
        this.agentName = null;
        this.usecaseID = null;
        this.waitingRoomURL = null;
        this.scheduled = null;

        if (str.id) {
            parse(str);
        }
        else {
            init(str);
        }

        function parse(obj) {
            instance.id = obj.id;

            instance.startTime = new Date(obj.attributes['start-time']);
            instance.endTime = new Date(obj.attributes['end-time']);

            instance.name = obj.attributes.name;
            instance.agentName = obj.attributes['agent-display-name'];
            instance.usecaseID = obj.attributes['usecase-id'];
            instance.waitingRoomURL = obj.attributes['agent-default-url'] ?? obj.attributes['guest-default-url'];
            instance.scheduled = obj.attributes.status == 'SCHEDULED';
        }

        function init(obj) {
            instance.startTime = obj.startTime;
            instance.endTime = obj.endTime;
            instance.name = obj.name;
            instance.agentName = obj.agentName;
            instance.usecaseID = obj.usecaseID;
            instance.scheduled = obj.scheduled;
        }
    }

    toJSON() {
        let json = {
            'data': {
                'type': 'appointments',
                'attributes': {
                    'start-time': this.startTime.toJSON(),
                    'end-time': this.endTime.toJSON(),
                    'name': this.name,
                    'agent-display-name': this.agentName,
                    //'usecase-id': this.usecaseID,
                    'status': this.scheduled ? 'SCHEDULED' : 'CANCELLED'
                }
            }
        };
        if (this.id) {
            json.data.id = this.id;
        }
        return json;
    };

    toString() {
        let str = "Appointment #" + this.id
            + (this.name ? " \"" + this.name + "\"" : '')
            + (this.scheduled ? '' : ' CANCELLED')
            + "\nfrom: " + this.startTime.toLocaleDateString() + " - " + this.startTime.toLocaleTimeString()
            + "\nuntil: " + this.endTime.toLocaleDateString() + " - " + this.endTime.toLocaleTimeString()
            + (this.agentName ? "\nagentName: " + this.agentName : '')
            + (this.usecaseID ? "\nusecaseID: " + this.usecaseID : '')
            + (this.waitingRoomURL ? "\nwaitingRoomURL: " + this.waitingRoomURL : '')
            + "\n";
        return str;
    };
}