import Common "common";

module {
  public type ProductionPoint = {
    machineId : Common.MachineId;
    count : Nat;
    timestamp : Common.Timestamp;
  };

  public type WearRecord = {
    machineId : Common.MachineId;
    wearPercent : Float;
    timestamp : Common.Timestamp;
  };
};
