export type MachineStatus = "Running" | "Idle" | "Fault";
export type AlertSeverity = "Warning" | "Critical";
export type HealthStatus = "Good" | "Warning" | "Critical";

export interface Machine {
  id: string;
  name: string;
  machineType: string;
  status: MachineStatus;
  createdAt: bigint;
}

export interface Sensor {
  id: string;
  machineId: string;
  sensorName: string;
  unit: string;
  refreshInterval: bigint;
  enabled: boolean;
  createdAt: bigint;
}

export interface AlertThreshold {
  id: string;
  machineId: string;
  sensorId: string;
  sensorName: string;
  warnLevel: number;
  criticalLevel: number;
}

export interface SensorReading {
  sensorId: string;
  machineId: string;
  sensorName: string;
  value: number;
  timestamp: bigint;
}

export interface AlertEvent {
  id: string;
  machineId: string;
  machineName: string;
  sensorName: string;
  value: number;
  severity: AlertSeverity;
  timestamp: bigint;
  acknowledged: boolean;
}

export interface ProductionPoint {
  machineId: string;
  count: bigint;
  timestamp: bigint;
}

export interface WearRecord {
  machineId: string;
  wearPercent: number;
  timestamp: bigint;
}

/** Live snapshot for the UI — not stored to backend directly */
export interface LiveSensorSnapshot {
  machineId: string;
  sensorId: string;
  sensorName: string;
  unit: string;
  value: number;
  status: HealthStatus;
  timestamp: number;
}
