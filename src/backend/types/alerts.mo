import Common "common";

module {
  public type AlertEvent = {
    id : Common.AlertId;
    machineId : Common.MachineId;
    machineName : Text;
    sensorName : Text;
    value : Float;
    severity : Text;
    timestamp : Common.Timestamp;
    acknowledged : Bool;
  };
};
