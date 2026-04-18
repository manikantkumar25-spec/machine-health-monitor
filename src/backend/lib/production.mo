import Common "../types/common";
import ProductionTypes "../types/production";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public type ProductionPoint = ProductionTypes.ProductionPoint;
  public type WearRecord = ProductionTypes.WearRecord;

  let MAX_PRODUCTION : Nat = 1000;

  public func recordProduction(
    history : List.List<ProductionPoint>,
    machineId : Common.MachineId,
    count : Nat,
  ) : { #ok : ProductionPoint; #err : Text } {
    let point : ProductionPoint = {
      machineId;
      count;
      timestamp = Time.now();
    };
    history.add(point);
    if (history.size() > MAX_PRODUCTION) {
      history.truncate(MAX_PRODUCTION);
    };
    #ok(point);
  };

  public func getProductionHistory(
    history : List.List<ProductionPoint>,
    machineId : Common.MachineId,
    hours : Nat,
  ) : [ProductionPoint] {
    let cutoff : Int = Time.now() - (hours * 3_600_000_000_000);
    history.filter(func(p : ProductionPoint) : Bool {
      p.machineId == machineId and p.timestamp >= cutoff
    }).toArray();
  };

  public func getTotalProduction(history : List.List<ProductionPoint>) : Nat {
    history.foldLeft(0, func(acc : Nat, p : ProductionPoint) : Nat { acc + p.count });

  };

  public func recordWear(
    wearHistory : List.List<WearRecord>,
    machineId : Common.MachineId,
    wearPercent : Float,
  ) : { #ok : (); #err : Text } {
    let record : WearRecord = {
      machineId;
      wearPercent;
      timestamp = Time.now();
    };
    wearHistory.add(record);
    #ok(());
  };

  public func getWearHistory(
    wearHistory : List.List<WearRecord>,
    machineId : Common.MachineId,
    hours : Nat,
  ) : [WearRecord] {
    let cutoff : Int = Time.now() - (hours * 3_600_000_000_000);
    wearHistory.filter(func(w : WearRecord) : Bool {
      w.machineId == machineId and w.timestamp >= cutoff
    }).toArray();
  };
};
