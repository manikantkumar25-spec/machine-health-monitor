import Common "../types/common";
import AlertTypes "../types/alerts";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type AlertEvent = AlertTypes.AlertEvent;

  let MAX_ALERTS : Nat = 500;

  public func addAlertEvent(
    alerts : List.List<AlertEvent>,
    idCounter : { var value : Nat },
    machineId : Common.MachineId,
    machineName : Text,
    sensorName : Text,
    value : Float,
    severity : Text,
  ) : { #ok : AlertEvent; #err : Text } {
    idCounter.value += 1;
    let id = idCounter.value.toText();
    let event : AlertEvent = {
      id;
      machineId;
      machineName;
      sensorName;
      value;
      severity;
      timestamp = Time.now();
      acknowledged = false;
    };
    alerts.add(event);
    if (alerts.size() > MAX_ALERTS) {
      alerts.truncate(MAX_ALERTS);
    };
    #ok(event);
  };

  public func getAlertEvents(
    alerts : List.List<AlertEvent>,
    limit : Nat,
  ) : [AlertEvent] {
    let all = alerts.toArray();
    let total = all.size();
    let take = if (limit == 0 or limit >= total) total else limit;
    // Return newest-first: slice from end
    let from : Int = total - take;
    let slice = all.sliceToArray(from, total);
    slice.reverse();
  };

  public func acknowledgeAlert(
    alerts : List.List<AlertEvent>,
    id : Common.AlertId,
  ) : { #ok : (); #err : Text } {
    var found = false;
    alerts.mapInPlace(func(e : AlertEvent) : AlertEvent {
      if (e.id == id) {
        found := true;
        { e with acknowledged = true };
      } else { e };
    });
    if (found) #ok(()) else #err("Alert not found: " # id);
  };

  public func clearAlerts(alerts : List.List<AlertEvent>) : () {
    alerts.clear();
  };
};
