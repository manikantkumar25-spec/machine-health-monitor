import Common "types/common";
import MachineLib "lib/machines";
import SensorLib "lib/sensors";
import AlertLib "lib/alerts";
import ProductionLib "lib/production";
import MachinesApi "mixins/machines-api";
import SensorsApi "mixins/sensors-api";
import AlertsApi "mixins/alerts-api";
import ProductionApi "mixins/production-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  // Machine state
  let machines = Map.empty<Common.MachineId, MachineLib.Machine>();
  var machineIdCounter = { var value : Nat = 0 };

  // Sensor state
  let sensors = Map.empty<Common.SensorId, SensorLib.Sensor>();
  var sensorIdCounter = { var value : Nat = 0 };
  let thresholds = Map.empty<Text, SensorLib.AlertThreshold>();
  var thresholdIdCounter = { var value : Nat = 0 };
  let sensorReadings = List.empty<SensorLib.SensorReading>();

  // Alert state
  let alertEvents = List.empty<AlertLib.AlertEvent>();
  var alertIdCounter = { var value : Nat = 0 };

  // Production state
  let productionHistory = List.empty<ProductionLib.ProductionPoint>();
  let wearHistory = List.empty<ProductionLib.WearRecord>();

  // Include mixins
  include MachinesApi(machines, machineIdCounter);
  include SensorsApi(sensors, sensorIdCounter, thresholds, thresholdIdCounter, sensorReadings);
  include AlertsApi(alertEvents, alertIdCounter);
  include ProductionApi(productionHistory, wearHistory);
};
