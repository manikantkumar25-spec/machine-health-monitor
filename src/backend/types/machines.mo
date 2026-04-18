import Common "common";

module {
  public type Machine = {
    id : Common.MachineId;
    name : Text;
    machineType : Text;
    status : Text;
    createdAt : Common.Timestamp;
  };
};
