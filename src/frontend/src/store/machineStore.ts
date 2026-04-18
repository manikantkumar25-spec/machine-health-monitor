import { create } from "zustand";
import type {
  AlertEvent,
  AlertThreshold,
  LiveSensorSnapshot,
  Machine,
  ProductionPoint,
  Sensor,
  WearRecord,
} from "../types";

interface MachineState {
  machines: Machine[];
  sensors: Sensor[];
  thresholds: AlertThreshold[];
  alerts: AlertEvent[];
  productionData: ProductionPoint[];
  wearHistory: WearRecord[];
  liveReadings: Record<string, LiveSensorSnapshot>;
  selectedMachineId: string | null;
  simulationRunning: boolean;
  sidebarCollapsed: boolean;

  // Actions
  setMachines: (machines: Machine[]) => void;
  setSensors: (sensors: Sensor[]) => void;
  setThresholds: (thresholds: AlertThreshold[]) => void;
  addAlert: (alert: AlertEvent) => void;
  setAlerts: (alerts: AlertEvent[]) => void;
  setProductionData: (data: ProductionPoint[]) => void;
  setWearHistory: (history: WearRecord[]) => void;
  setLiveReading: (key: string, snap: LiveSensorSnapshot) => void;
  setSelectedMachine: (id: string | null) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useMachineStore = create<MachineState>((set) => ({
  machines: [],
  sensors: [],
  thresholds: [],
  alerts: [],
  productionData: [],
  wearHistory: [],
  liveReadings: {},
  selectedMachineId: null,
  simulationRunning: false,
  sidebarCollapsed: false,

  setMachines: (machines) => set({ machines }),
  setSensors: (sensors) => set({ sensors }),
  setThresholds: (thresholds) => set({ thresholds }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 200),
    })),
  setAlerts: (alerts) => set({ alerts }),
  setProductionData: (productionData) => set({ productionData }),
  setWearHistory: (wearHistory) => set({ wearHistory }),
  setLiveReading: (key, snap) =>
    set((state) => ({
      liveReadings: { ...state.liveReadings, [key]: snap },
    })),
  setSelectedMachine: (id) => set({ selectedMachineId: id }),
  startSimulation: () => set({ simulationRunning: true }),
  stopSimulation: () => set({ simulationRunning: false }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
