import type { backendInterface } from "../backend.d";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const MACHINES = [
  { id: "m1", name: "CNC Milling Unit-1", machineType: "CNC", status: "Running", createdAt: now },
  { id: "m2", name: "Stamping Press Unit-2", machineType: "Stamping", status: "Running", createdAt: now },
  { id: "m3", name: "Welding Station Unit-3", machineType: "Welding", status: "Idle", createdAt: now },
  { id: "m4", name: "Assembly Line Unit-4", machineType: "Assembly", status: "Fault", createdAt: now },
];

const SENSORS = [
  { id: "s1", sensorName: "Temperature", unit: "°F", machineId: "m1", refreshInterval: BigInt(3), enabled: true, createdAt: now },
  { id: "s2", sensorName: "Vibration", unit: "mm/s", machineId: "m1", refreshInterval: BigInt(3), enabled: true, createdAt: now },
  { id: "s3", sensorName: "Load", unit: "%", machineId: "m1", refreshInterval: BigInt(3), enabled: true, createdAt: now },
  { id: "s4", sensorName: "Speed", unit: "RPM", machineId: "m1", refreshInterval: BigInt(3), enabled: true, createdAt: now },
  { id: "s5", sensorName: "Temperature", unit: "°F", machineId: "m2", refreshInterval: BigInt(3), enabled: true, createdAt: now },
  { id: "s6", sensorName: "Vibration", unit: "mm/s", machineId: "m2", refreshInterval: BigInt(3), enabled: true, createdAt: now },
];

const THRESHOLDS = [
  { id: "t1", sensorId: "s1", sensorName: "Temperature", machineId: "m1", warnLevel: 180, criticalLevel: 220 },
  { id: "t2", sensorId: "s2", sensorName: "Vibration", machineId: "m1", warnLevel: 5, criticalLevel: 8 },
  { id: "t3", sensorId: "s3", sensorName: "Load", machineId: "m1", warnLevel: 85, criticalLevel: 95 },
];

const ALERTS = [
  { id: "a1", machineId: "m4", machineName: "Assembly Line Unit-4", sensorName: "Temperature", value: 235.4, severity: "critical", acknowledged: false, timestamp: now },
  { id: "a2", machineId: "m2", machineName: "Stamping Press Unit-2", sensorName: "Vibration", value: 6.8, severity: "warning", acknowledged: false, timestamp: now },
  { id: "a3", machineId: "m1", machineName: "CNC Milling Unit-1", sensorName: "Load", value: 89.2, severity: "warning", acknowledged: false, timestamp: now },
];

const PRODUCTION_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  machineId: "m1",
  count: BigInt(Math.floor(800 + Math.random() * 400)),
  timestamp: BigInt(Date.now() - (23 - i) * 3_600_000) * BigInt(1_000_000),
}));

const WEAR_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  machineId: "m1",
  wearPercent: 30 + i * 2.7 + Math.random() * 2,
  timestamp: BigInt(Date.now() - (11 - i) * 3_600_000) * BigInt(1_000_000),
}));

const SENSOR_READINGS = Array.from({ length: 20 }, (_, i) => ({
  machineId: "m1",
  sensorId: "s1",
  sensorName: "Temperature",
  value: 155 + Math.random() * 30,
  timestamp: BigInt(Date.now() - (19 - i) * 600_000) * BigInt(1_000_000),
}));

export const mockBackend: backendInterface = {
  getMachines: async () => MACHINES,

  addMachine: async (name, machineType, status) => ({
    __kind__: "ok",
    ok: { id: `m-${Date.now()}`, name, machineType, status, createdAt: now },
  }),

  updateMachine: async (id, name, machineType, status) => ({
    __kind__: "ok",
    ok: { id, name, machineType, status, createdAt: now },
  }),

  deleteMachine: async () => ({ __kind__: "ok", ok: null }),

  getSensorsForMachine: async (machineId) => SENSORS.filter(s => s.machineId === machineId),

  addSensor: async (machineId, sensorName, unit, refreshInterval) => ({
    __kind__: "ok",
    ok: { id: `s-${Date.now()}`, sensorName, unit, machineId, refreshInterval, enabled: true, createdAt: now },
  }),

  updateSensor: async (id, sensorName, unit, refreshInterval, enabled) => ({
    __kind__: "ok",
    ok: { id, sensorName, unit, machineId: "m1", refreshInterval, enabled, createdAt: now },
  }),

  deleteSensor: async () => ({ __kind__: "ok", ok: null }),

  getAlertThresholds: async (machineId) => THRESHOLDS.filter(t => t.machineId === machineId),

  setAlertThreshold: async (machineId, sensorId, sensorName, warnLevel, criticalLevel) => ({
    __kind__: "ok",
    ok: { id: `th-${Date.now()}`, machineId, sensorId, sensorName, warnLevel, criticalLevel },
  }),

  getAlertEvents: async () => ALERTS,

  addAlertEvent: async (machineId, machineName, sensorName, value, severity) => ({
    __kind__: "ok",
    ok: {
      id: `al-${Date.now()}`,
      machineId,
      machineName,
      sensorName,
      value,
      severity,
      acknowledged: false,
      timestamp: now,
    },
  }),

  acknowledgeAlert: async () => ({ __kind__: "ok", ok: null }),

  clearAlerts: async () => undefined,

  getTotalProduction: async () => BigInt(89451),

  getProductionHistory: async () => PRODUCTION_HISTORY,

  recordProduction: async (machineId, count) => ({
    __kind__: "ok",
    ok: { machineId, count, timestamp: now },
  }),

  getSensorReadings: async () => SENSOR_READINGS,

  recordSensorReading: async () => ({ __kind__: "ok", ok: null }),

  getWearHistory: async () => WEAR_HISTORY,

  recordWear: async () => ({ __kind__: "ok", ok: null }),
};
