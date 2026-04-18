import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Sensor {
    id: SensorId;
    sensorName: string;
    refreshInterval: bigint;
    createdAt: Timestamp;
    unit: string;
    enabled: boolean;
    machineId: MachineId;
}
export type Timestamp = bigint;
export interface AlertThreshold {
    id: string;
    sensorName: string;
    warnLevel: number;
    sensorId: SensorId;
    criticalLevel: number;
    machineId: MachineId;
}
export type AlertId = string;
export interface AlertEvent {
    id: AlertId;
    sensorName: string;
    value: number;
    acknowledged: boolean;
    timestamp: Timestamp;
    severity: string;
    machineId: MachineId;
    machineName: string;
}
export type MachineId = string;
export interface ProductionPoint {
    count: bigint;
    timestamp: Timestamp;
    machineId: MachineId;
}
export interface SensorReading {
    sensorName: string;
    value: number;
    sensorId: SensorId;
    timestamp: Timestamp;
    machineId: MachineId;
}
export interface Machine {
    id: MachineId;
    status: string;
    name: string;
    createdAt: Timestamp;
    machineType: string;
}
export type SensorId = string;
export interface WearRecord {
    wearPercent: number;
    timestamp: Timestamp;
    machineId: MachineId;
}
export interface backendInterface {
    acknowledgeAlert(id: AlertId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addAlertEvent(machineId: MachineId, machineName: string, sensorName: string, value: number, severity: string): Promise<{
        __kind__: "ok";
        ok: AlertEvent;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addMachine(name: string, machineType: string, status: string): Promise<{
        __kind__: "ok";
        ok: Machine;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addSensor(machineId: MachineId, sensorName: string, unit: string, refreshInterval: bigint): Promise<{
        __kind__: "ok";
        ok: Sensor;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearAlerts(): Promise<void>;
    deleteMachine(id: MachineId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteSensor(id: SensorId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAlertEvents(limit: bigint): Promise<Array<AlertEvent>>;
    getAlertThresholds(machineId: MachineId): Promise<Array<AlertThreshold>>;
    getMachines(): Promise<Array<Machine>>;
    getProductionHistory(machineId: MachineId, hours: bigint): Promise<Array<ProductionPoint>>;
    getSensorReadings(machineId: MachineId, sensorName: string, hours: bigint): Promise<Array<SensorReading>>;
    getSensorsForMachine(machineId: MachineId): Promise<Array<Sensor>>;
    getTotalProduction(): Promise<bigint>;
    getWearHistory(machineId: MachineId, hours: bigint): Promise<Array<WearRecord>>;
    recordProduction(machineId: MachineId, count: bigint): Promise<{
        __kind__: "ok";
        ok: ProductionPoint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordSensorReading(sensorId: SensorId, machineId: MachineId, sensorName: string, value: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recordWear(machineId: MachineId, wearPercent: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setAlertThreshold(machineId: MachineId, sensorId: SensorId, sensorName: string, warnLevel: number, criticalLevel: number): Promise<{
        __kind__: "ok";
        ok: AlertThreshold;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMachine(id: MachineId, name: string, machineType: string, status: string): Promise<{
        __kind__: "ok";
        ok: Machine;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSensor(id: SensorId, sensorName: string, unit: string, refreshInterval: bigint, enabled: boolean): Promise<{
        __kind__: "ok";
        ok: Sensor;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
