import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef } from "react";
import { createActor } from "./backend";
import { Layout } from "./components/Layout";
import {
  useAddAlertEvent,
  useRecordProduction,
  useRecordSensorReading,
  useRecordWear,
} from "./hooks/useBackend";
import {
  DEMO_MACHINES,
  DEMO_SENSORS,
  DEMO_THRESHOLDS,
  computeWear,
  detectAnomalies,
  generateProductionIncrement,
  generateSensorReading,
} from "./lib/simulation";
import { useMachineStore } from "./store/machineStore";
import type { AlertThreshold, Machine, Sensor } from "./types";

// ─── Lazy page imports ────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MachinesPage = lazy(() => import("./pages/MachinesPage"));
const SensorsPage = lazy(() => import("./pages/SensorsPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function LazyDashboard() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}
function LazyMachines() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MachinesPage />
    </Suspense>
  );
}
function LazySensors() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SensorsPage />
    </Suspense>
  );
}
function LazyAlerts() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AlertsPage />
    </Suspense>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: () => <Outlet /> });

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: LazyDashboard,
});

const machinesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/machines",
  component: LazyMachines,
});

const sensorsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/sensors/$machineId",
  component: LazySensors,
});

const alertsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/alerts",
  component: LazyAlerts,
});

const catchAllRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    dashboardRoute,
    machinesRoute,
    sensorsRoute,
    alertsRoute,
    catchAllRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Build local demo data without actor ─────────────────────────────────────
function buildDemoData(): {
  machines: Machine[];
  sensors: Sensor[];
  thresholds: AlertThreshold[];
} {
  const machines: Machine[] = DEMO_MACHINES.map((dm, idx) => ({
    id: `demo-machine-${idx + 1}`,
    name: dm.name,
    machineType: dm.machineType,
    status: dm.status,
    createdAt: BigInt(Date.now()) * 1_000_000n,
  }));

  const sensors: Sensor[] = [];
  const thresholds: AlertThreshold[] = [];

  for (const machine of machines) {
    for (const ds of DEMO_SENSORS) {
      const sensorId = `${machine.id}-${ds.sensorName.replace(/\s+/g, "-").toLowerCase()}`;
      sensors.push({
        id: sensorId,
        machineId: machine.id,
        sensorName: ds.sensorName,
        unit: ds.unit,
        refreshInterval: BigInt(ds.refreshInterval),
        enabled: true,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      });
    }
    for (const dt of DEMO_THRESHOLDS) {
      const sensor = sensors.find(
        (s) => s.machineId === machine.id && s.sensorName === dt.sensorName,
      );
      if (!sensor) continue;
      thresholds.push({
        id: `thresh-${sensor.id}`,
        machineId: machine.id,
        sensorId: sensor.id,
        sensorName: dt.sensorName,
        warnLevel: dt.warnLevel,
        criticalLevel: dt.criticalLevel,
      });
    }
  }

  return { machines, sensors, thresholds };
}

// ─── Simulation + seeding inner component ────────────────────────────────────
function AppCore() {
  const { actor } = useActor(createActor);

  const recordSensor = useRecordSensorReading();
  const recordProduction = useRecordProduction();
  const recordWear = useRecordWear();
  const addAlertEvent = useAddAlertEvent();

  // Stable refs for mutation functions (from React Query — stable, but kept
  // in refs to avoid any accidental closure staleness)
  const recordSensorRef = useRef(recordSensor);
  const recordProductionRef = useRef(recordProduction);
  const recordWearRef = useRef(recordWear);
  const addAlertEventRef = useRef(addAlertEvent);
  recordSensorRef.current = recordSensor;
  recordProductionRef.current = recordProduction;
  recordWearRef.current = recordWear;
  addAlertEventRef.current = addAlertEvent;

  const seededRef = useRef(false);
  const wearRef = useRef<Record<string, number>>({});
  const productionRef = useRef<Record<string, number>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Seed demo machines once on mount — EMPTY DEPS, access store via getState ─
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    const {
      machines: demoMachines,
      sensors: demoSensors,
      thresholds: demoThresholds,
    } = buildDemoData();

    const store = useMachineStore.getState();
    store.setMachines(demoMachines);
    store.setSensors(demoSensors);
    store.setThresholds(demoThresholds);
    store.setSelectedMachine(demoMachines[0].id);
    store.startSimulation();
  }, []); // EMPTY — no store actions or state in deps

  // ── Optional: sync demo data to backend when actor first becomes available ─
  const backendSyncedRef = useRef(false);
  const actorRef = useRef(actor);
  actorRef.current = actor;
  useEffect(() => {
    if (!actor || backendSyncedRef.current) return;

    const syncToBackend = async () => {
      const { machines } = useMachineStore.getState();
      if (machines.length === 0) return;
      backendSyncedRef.current = true;
      try {
        const existingRaw = await actor.getMachines();
        if (existingRaw.length > 0) return; // backend already has data
      } catch {
        return; // backend not reachable — skip silently
      }
      const { machines: currentMachines } = useMachineStore.getState();
      for (const machine of currentMachines) {
        try {
          await actor.addMachine(
            machine.name,
            machine.machineType,
            machine.status,
          );
        } catch {
          /* ignore */
        }
      }
    };

    syncToBackend().catch(() => {
      /* ignore */
    });
  }, [actor]);

  // ── Simulation loop — EMPTY DEPS, reads store state via getState() each tick ─
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const { machines, sensors, thresholds, setLiveReading, addAlert } =
        useMachineStore.getState();

      if (machines.length === 0) return;

      const now = Date.now();
      for (const machine of machines) {
        const machineSensors = sensors.filter(
          (s) => s.machineId === machine.id && s.enabled,
        );
        const machineThresholds = thresholds.filter(
          (t) => t.machineId === machine.id,
        );
        const readings = machineSensors.map((s) =>
          generateSensorReading(s, machine.status),
        );

        // Update live readings in store
        for (const reading of readings) {
          const threshold = machineThresholds.find(
            (t) => t.sensorName === reading.sensorName,
          );
          let status: "Good" | "Warning" | "Critical" = "Good";
          if (threshold) {
            if (reading.value >= threshold.criticalLevel) status = "Critical";
            else if (reading.value >= threshold.warnLevel) status = "Warning";
          }
          const key = `${machine.id}-${reading.sensorName}`;
          const sensor = machineSensors.find(
            (s) => s.sensorName === reading.sensorName,
          );
          setLiveReading(key, {
            machineId: machine.id,
            sensorId: reading.sensorId,
            sensorName: reading.sensorName,
            unit: sensor?.unit ?? "",
            value: reading.value,
            status,
            timestamp: now,
          });
        }

        // Detect anomalies → add to store alerts
        const newAlerts = detectAnomalies(
          readings,
          machineThresholds,
          machine.name,
        );
        for (const alert of newAlerts) {
          addAlert(alert);
          addAlertEventRef.current.mutate(
            {
              machineId: alert.machineId,
              machineName: alert.machineName,
              sensorName: alert.sensorName,
              value: alert.value,
              severity: alert.severity,
            },
            {
              onError: () => {
                /* silent */
              },
            },
          );
        }

        // Compute wear
        const loadReading = readings.find((r) =>
          r.sensorName.toLowerCase().includes("load"),
        );
        const speedReading = readings.find(
          (r) =>
            r.sensorName.toLowerCase().includes("speed") ||
            r.sensorName.toLowerCase().includes("rpm"),
        );
        if (loadReading && speedReading && machine.status === "Running") {
          const prevWear = wearRef.current[machine.id] ?? 0;
          const delta = computeWear(loadReading.value, speedReading.value, 3);
          const newWear = Math.min(prevWear + delta, 100);
          wearRef.current[machine.id] = newWear;
          recordWearRef.current.mutate(
            { machineId: machine.id, wearPercent: newWear },
            {
              onError: () => {
                /* silent */
              },
            },
          );
        }

        // Track production
        if (machine.status !== "Fault") {
          const increment = generateProductionIncrement(machine.status, 5);
          const prev = productionRef.current[machine.id] ?? 0;
          productionRef.current[machine.id] = prev + increment;
          if (increment > 0) {
            recordProductionRef.current.mutate(
              { machineId: machine.id, count: BigInt(increment) },
              {
                onError: () => {
                  /* silent */
                },
              },
            );
          }
        }

        // Fire-and-forget sensor readings to backend
        for (const reading of readings.slice(0, 2)) {
          recordSensorRef.current.mutate(
            {
              sensorId: reading.sensorId,
              machineId: reading.machineId,
              sensorName: reading.sensorName,
              value: reading.value,
            },
            {
              onError: () => {
                /* silent */
              },
            },
          );
        }
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // EMPTY DEPS — store accessed via getState() each tick

  return null;
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AppCore />
    </>
  );
}
