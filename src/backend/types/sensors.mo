import Common "common";

module {
  public type Sensor = {
    id : Common.SensorId;
    machineId : Common.MachineId;
    sensorName : Text;
    unit : Text;
    refreshInterval : Nat;
    enabled : Bool;
    createdAt : Common.Timestamp;
  };

  public type AlertThreshold = {
    id : Text;
    machineId : Common.MachineId;
    sensorId : Common.SensorId;
    sensorName : Text;
    warnLevel : Float;
    criticalLevel : Float;
  };

  public type SensorReading = {
    sensorId : Common.SensorId;
    machineId : Common.MachineId;
    sensorName : Text;
    value : Float;
    timestamp : Common.Timestamp;
  };
};
