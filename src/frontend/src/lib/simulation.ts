import type {
  AlertEvent,
  AlertThreshold,
  HealthStatus,
  MachineStatus,
  Sensor,
  SensorReading,
} from "../types";

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function generateSensorReading(
  sensor: Sensor,
  machineStatus: MachineStatus,
): SensorReading {
  const name = sensor.sensorName.toLowerCase();
  let value: number;

  if (name.includes("temp")) {
    const base = 55 + rand(-15, 15);
    value = machineStatus === "Fault" ? base + 20 : base;
  } else if (name.includes("vib")) {
    const base = 0.3 + rand(-0.1, 0.2);
    value = machineStatus === "Fault" ? base + 0.4 : base;
  } else if (name.includes("load")) {
    const base = 60 + rand(-25, 25);
    value = machineStatus === "Idle" ? base * 0.1 : base;
  } else if (name.includes("speed") || name.includes("rpm")) {
    const base = 2000 + rand(-800, 800);
    if (machineStatus === "Idle") value = base * 0.5;
    else if (machineStatus === "Fault") value = base * 0.3;
    else value = base;
  } else {
    // Generic sensor
    value = rand(10, 100);
  }

  return {
    sensorId: sensor.id,
    machineId: sensor.machineId,
    sensorName: sensor.sensorName,
    value: Math.max(0, Math.round(value * 10) / 10),
    timestamp: BigInt(Date.now()) * 1_000_000n,
  };
}

export function computeWear(
  load: number,
  speed: number,
  deltaT: number,
): number {
  return 0.5 * (load / 100) * (speed / 3500) * deltaT * 0.001;
}

export function computeFailureProbability(
  wearPercent: number,
  tempSpikeCount: number,
  vibTrend: number,
  prodDrop: number,
): number {
  const wearFactor = wearPercent / 100;
  const tempFactor = Math.min(tempSpikeCount / 10, 1) * 0.3;
  const vibFactor = Math.min(vibTrend, 1) * 0.2;
  const prodFactor = Math.min(prodDrop, 1) * 0.15;
  const raw = wearFactor * 0.35 + tempFactor + vibFactor + prodFactor;
  return Math.min(Math.round(raw * 1000) / 10, 100);
}

export function generateProductionIncrement(
  machineStatus: MachineStatus,
  _rate: number,
): number {
  if (machineStatus === "Fault") return 0;
  if (machineStatus === "Idle") return Math.floor(rand(0, 3));
  return Math.floor(rand(1, 8));
}

export function sensorHealthStatus(
  value: number,
  threshold: AlertThreshold | undefined,
): HealthStatus {
  if (!threshold) return "Good";
  if (value >= threshold.criticalLevel) return "Critical";
  if (value >= threshold.warnLevel) return "Warning";
  return "Good";
}

export function detectAnomalies(
  readings: SensorReading[],
  thresholds: AlertThreshold[],
  machineName: string,
): AlertEvent[] {
  const events: AlertEvent[] = [];
  for (const reading of readings) {
    const threshold = thresholds.find(
      (t) =>
        t.machineId === reading.machineId &&
        t.sensorName === reading.sensorName,
    );
    if (!threshold) continue;
    if (reading.value >= threshold.criticalLevel) {
      events.push({
        id: `${reading.machineId}-${reading.sensorName}-${Date.now()}`,
        machineId: reading.machineId,
        machineName,
        sensorName: reading.sensorName,
        value: reading.value,
        severity: "Critical",
        timestamp: reading.timestamp,
        acknowledged: false,
      });
    } else if (reading.value >= threshold.warnLevel) {
      events.push({
        id: `${reading.machineId}-${reading.sensorName}-${Date.now()}`,
        machineId: reading.machineId,
        machineName,
        sensorName: reading.sensorName,
        value: reading.value,
        severity: "Warning",
        timestamp: reading.timestamp,
        acknowledged: false,
      });
    }
  }
  return events;
}

export const DEMO_MACHINES = [
  {
    name: "CNC Lathe A1",
    machineType: "CNC",
    status: "Running" as MachineStatus,
  },
  {
    name: "Stamping Press B2",
    machineType: "Press",
    status: "Running" as MachineStatus,
  },
  {
    name: "Assembly Line C3",
    machineType: "Assembly",
    status: "Idle" as MachineStatus,
  },
];

export const DEMO_SENSORS = [
  { sensorName: "Temperature", unit: "°C", refreshInterval: 3000 },
  { sensorName: "Vibration", unit: "mm/s", refreshInterval: 3000 },
  { sensorName: "Load", unit: "%", refreshInterval: 3000 },
  { sensorName: "Speed (RPM)", unit: "RPM", refreshInterval: 3000 },
];

export const DEMO_THRESHOLDS = [
  { sensorName: "Temperature", warnLevel: 70, criticalLevel: 85 },
  { sensorName: "Vibration", warnLevel: 0.6, criticalLevel: 0.9 },
  { sensorName: "Load", warnLevel: 80, criticalLevel: 95 },
  { sensorName: "Speed (RPM)", warnLevel: 3000, criticalLevel: 3500 },
];
