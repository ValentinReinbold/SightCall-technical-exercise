function Appointment(str) {
    
    this.id = str.id;

    this.startTime = new Date(str.attributes['start-time']);
    this.endTime = new Date(str.attributes['end-time']);

    this.name = str.attributes.name;
    this.agentName = str.attributes['agent-display-name'];
    this.usecaseID = str.attributes['usecase-id'];
    this.waitingRoomURL = str.attributes['agent-default-url'];
    this.scheduled = str.attributes.status == 'SCHEDULED';

    this.toString = function() {
        return "Appointment #" + this.id
            + (this.name ? " \"" + this.name + "\"" : '')
            + (this.scheduled ? '' : ' CANCELLED')
            + "\nfrom: " + this.startTime.toLocaleDateString() + " - " + this.startTime.toLocaleTimeString()
            + "\nuntil: " + this.endTime.toLocaleDateString() + " - " + this.endTime.toLocaleTimeString()
            + (this.agentName ? "\nagentName: " + this.agentName : '')
            + (this.usecaseID ? "\nusecaseID: " + this.usecaseID : '')
            + (this.waitingRoomURL ? "\nwaitingRoomURL: " + this.waitingRoomURL : '')
            + "\n";
    }
}