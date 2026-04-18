import Common "../types/common";
import SensorTypes "../types/sensors";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type Sensor = SensorTypes.Sensor;
  public type AlertThreshold = SensorTypes.AlertThreshold;
  public type SensorReading = SensorTypes.SensorReading;

  let MAX_READINGS : Nat = 1000;

  public func addSensor(
    sensors : Map.Map<Common.SensorId, Sensor>,
    idCounter : { var value : Nat },
    machineId : Common.MachineId,
    sensorName : Text,
    unit : Text,
    refreshInterval : Nat,
  ) : { #ok : Sensor; #err : Text } {
    idCounter.value += 1;
    let id = idCounter.value.toText();
    let sensor : Sensor = {
      id;
      machineId;
      sensorName;
      unit;
      refreshInterval;
      enabled = true;
      createdAt = Time.now();
    };
    sensors.add(id, sensor);
    #ok(sensor);
  };

  public func updateSensor(
    sensors : Map.Map<Common.SensorId, Sensor>,
    id : Common.SensorId,
    sensorName : Text,
    unit : Text,
    refreshInterval : Nat,
    enabled : Bool,
  ) : { #ok : Sensor; #err : Text } {
    switch (sensors.get(id)) {
      case null { #err("Sensor not found: " # id) };
      case (?existing) {
        let updated : Sensor = { existing with sensorName; unit; refreshInterval; enabled };
        sensors.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteSensor(
    sensors : Map.Map<Common.SensorId, Sensor>,
    id : Common.SensorId,
  ) : { #ok : (); #err : Text } {
    switch (sensors.get(id)) {
      case null { #err("Sensor not found: " # id) };
      case (?_) {
        sensors.remove(id);
        #ok(());
      };
    };
  };

  public func getSensorsForMachine(
    sensors : Map.Map<Common.SensorId, Sensor>,
    machineId : Common.MachineId,
  ) : [Sensor] {
    sensors.values().filter(func(s) : Bool { s.machineId == machineId }).toArray();
  };

  public func setAlertThreshold(
    thresholds : Map.Map<Text, AlertThreshold>,
    idCounter : { var value : Nat },
    machineId : Common.MachineId,
    sensorId : Common.SensorId,
    sensorName : Text,
    warnLevel : Float,
    criticalLevel : Float,
  ) : { #ok : AlertThreshold; #err : Text } {
    // Reuse existing threshold id if one already exists for this machine+sensor pair
    let existing = thresholds.values().find(
      func(t : AlertThreshold) : Bool { t.machineId == machineId and t.sensorId == sensorId }
    );
    let id = switch (existing) {
      case (?t) { t.id };
      case null {
        idCounter.value += 1;
        idCounter.value.toText();
      };
    };
    let threshold : AlertThreshold = { id; machineId; sensorId; sensorName; warnLevel; criticalLevel };
    thresholds.add(id, threshold);
    #ok(threshold);
  };

  public func getAlertThresholds(
    thresholds : Map.Map<Text, AlertThreshold>,
    machineId : Common.MachineId,
  ) : [AlertThreshold] {
    thresholds.values().filter(func(t : AlertThreshold) : Bool { t.machineId == machineId }).toArray();
  };

  public func recordSensorReading(
    readings : List.List<SensorReading>,
    sensorId : Common.SensorId,
    machineId : Common.MachineId,
    sensorName : Text,
    value : Float,
  ) : { #ok : (); #err : Text } {
    let reading : SensorReading = {
      sensorId;
      machineId;
      sensorName;
      value;
      timestamp = Time.now();
    };
    readings.add(reading);
    // Trim to max size
    if (readings.size() > MAX_READINGS) {
      readings.truncate(MAX_READINGS);
    };
    #ok(());
  };

  public func getSensorReadings(
    readings : List.List<SensorReading>,
    machineId : Common.MachineId,
    sensorName : Text,
    hours : Nat,
  ) : [SensorReading] {
    let cutoff : Int = Time.now() - (hours * 3_600_000_000_000);
    readings.filter(func(r : SensorReading) : Bool {
      r.machineId == machineId and r.sensorName == sensorName and r.timestamp >= cutoff
    }).toArray();
  };
};
