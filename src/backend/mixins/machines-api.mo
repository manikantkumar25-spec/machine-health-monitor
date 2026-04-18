import Common "../types/common";
import MachineLib "../lib/machines";
import Map "mo:core/Map";

mixin (
  machines : Map.Map<Common.MachineId, MachineLib.Machine>,
  machineIdCounter : { var value : Nat },
) {
  public func addMachine(name : Text, machineType : Text, status : Text) : async { #ok : MachineLib.Machine; #err : Text } {
    MachineLib.addMachine(machines, machineIdCounter, name, machineType, status);
  };

  public func updateMachine(id : Common.MachineId, name : Text, machineType : Text, status : Text) : async { #ok : MachineLib.Machine; #err : Text } {
    MachineLib.updateMachine(machines, id, name, machineType, status);
  };

  public func deleteMachine(id : Common.MachineId) : async { #ok : (); #err : Text } {
    MachineLib.deleteMachine(machines, id);
  };

  public query func getMachines() : async [MachineLib.Machine] {
    MachineLib.getMachines(machines);
  };
};
