import Common "../types/common";
import AlertLib "../lib/alerts";
import List "mo:core/List";

mixin (
  alertEvents : List.List<AlertLib.AlertEvent>,
  alertIdCounter : { var value : Nat },
) {
  public func addAlertEvent(machineId : Common.MachineId, machineName : Text, sensorName : Text, value : Float, severity : Text) : async { #ok : AlertLib.AlertEvent; #err : Text } {
    AlertLib.addAlertEvent(alertEvents, alertIdCounter, machineId, machineName, sensorName, value, severity);
  };

  public query func getAlertEvents(limit : Nat) : async [AlertLib.AlertEvent] {
    AlertLib.getAlertEvents(alertEvents, limit);
  };

  public func acknowledgeAlert(id : Common.AlertId) : async { #ok : (); #err : Text } {
    AlertLib.acknowledgeAlert(alertEvents, id);
  };

  public func clearAlerts() : async () {
    AlertLib.clearAlerts(alertEvents);
  };
};
