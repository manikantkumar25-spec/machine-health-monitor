import Common "../types/common";
import SensorLib "../lib/sensors";
import List "mo:core/List";
import Map "mo:core/Map";

mixin (
  sensors : Map.Map<Common.SensorId, SensorLib.Sensor>,
  sensorIdCounter : { var value : Nat },
  thresholds : Map.Map<Text, SensorLib.AlertThreshold>,
  thresholdIdCounter : { var value : Nat },
  sensorReadings : List.List<SensorLib.SensorReading>,
) {
  public func addSensor(machineId : Common.MachineId, sensorName : Text, unit : Text, refreshInterval : Nat) : async { #ok : SensorLib.Sensor; #err : Text } {
    SensorLib.addSensor(sensors, sensorIdCounter, machineId, sensorName, unit, refreshInterval);
  };

  public func updateSensor(id : Common.SensorId, sensorName : Text, unit : Text, refreshInterval : Nat, enabled : Bool) : async { #ok : SensorLib.Sensor; #err : Text } {
    SensorLib.updateSensor(sensors, id, sensorName, unit, refreshInterval, enabled);
  };

  public func deleteSensor(id : Common.SensorId) : async { #ok : (); #err : Text } {
    SensorLib.deleteSensor(sensors, id);
  };

  public query func getSensorsForMachine(machineId : Common.MachineId) : async [SensorLib.Sensor] {
    SensorLib.getSensorsForMachine(sensors, machineId);
  };

  public func setAlertThreshold(machineId : Common.MachineId, sensorId : Common.SensorId, sensorName : Text, warnLevel : Float, criticalLevel : Float) : async { #ok : SensorLib.AlertThreshold; #err : Text } {
    SensorLib.setAlertThreshold(thresholds, thresholdIdCounter, machineId, sensorId, sensorName, warnLevel, criticalLevel);
  };

  public query func getAlertThresholds(machineId : Common.MachineId) : async [SensorLib.AlertThreshold] {
    SensorLib.getAlertThresholds(thresholds, machineId);
  };

  public func recordSensorReading(sensorId : Common.SensorId, machineId : Common.MachineId, sensorName : Text, value : Float) : async { #ok : (); #err : Text } {
    SensorLib.recordSensorReading(sensorReadings, sensorId, machineId, sensorName, value);
  };

  public query func getSensorReadings(machineId : Common.MachineId, sensorName : Text, hours : Nat) : async [SensorLib.SensorReading] {
    SensorLib.getSensorReadings(sensorReadings, machineId, sensorName, hours);
  };
};
