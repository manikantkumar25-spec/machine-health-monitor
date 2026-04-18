import Common "../types/common";
import ProductionLib "../lib/production";
import List "mo:core/List";

mixin (
  productionHistory : List.List<ProductionLib.ProductionPoint>,
  wearHistory : List.List<ProductionLib.WearRecord>,
) {
  public func recordProduction(machineId : Common.MachineId, count : Nat) : async { #ok : ProductionLib.ProductionPoint; #err : Text } {
    ProductionLib.recordProduction(productionHistory, machineId, count);
  };

  public query func getProductionHistory(machineId : Common.MachineId, hours : Nat) : async [ProductionLib.ProductionPoint] {
    ProductionLib.getProductionHistory(productionHistory, machineId, hours);
  };

  public query func getTotalProduction() : async Nat {
    ProductionLib.getTotalProduction(productionHistory);
  };

  public func recordWear(machineId : Common.MachineId, wearPercent : Float) : async { #ok : (); #err : Text } {
    ProductionLib.recordWear(wearHistory, machineId, wearPercent);
  };

  public query func getWearHistory(machineId : Common.MachineId, hours : Nat) : async [ProductionLib.WearRecord] {
    ProductionLib.getWearHistory(wearHistory, machineId, hours);
  };
};
