import Common "../types/common";
import MachineTypes "../types/machines";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type Machine = MachineTypes.Machine;

  public func addMachine(
    machines : Map.Map<Common.MachineId, Machine>,
    idCounter : { var value : Nat },
    name : Text,
    machineType : Text,
    status : Text,
  ) : { #ok : Machine; #err : Text } {
    idCounter.value += 1;
    let id = idCounter.value.toText();
    let machine : Machine = {
      id;
      name;
      machineType;
      status;
      createdAt = Time.now();
    };
    machines.add(id, machine);
    #ok(machine);
  };

  public func updateMachine(
    machines : Map.Map<Common.MachineId, Machine>,
    id : Common.MachineId,
    name : Text,
    machineType : Text,
    status : Text,
  ) : { #ok : Machine; #err : Text } {
    switch (machines.get(id)) {
      case null { #err("Machine not found: " # id) };
      case (?existing) {
        let updated : Machine = { existing with name; machineType; status };
        machines.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteMachine(
    machines : Map.Map<Common.MachineId, Machine>,
    id : Common.MachineId,
  ) : { #ok : (); #err : Text } {
    switch (machines.get(id)) {
      case null { #err("Machine not found: " # id) };
      case (?_) {
        machines.remove(id);
        #ok(());
      };
    };
  };

  public func getMachines(
    machines : Map.Map<Common.MachineId, Machine>
  ) : [Machine] {
    machines.values().toArray();
  };
};
