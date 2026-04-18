import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AlertEvent, AlertThreshold, Machine, Sensor } from "../types";

// ─── Machines ───────────────────────────────────────────────────────────────

export function useMachines() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Machine[]>({
    queryKey: ["machines"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getMachines();
      return raw.map((m) => ({
        ...m,
        status: m.status as Machine["status"],
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAddMachine() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      machineType,
      status,
    }: { name: string; machineType: string; status: string }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.addMachine(name, machineType, status);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["machines"] }),
  });
}

export function useUpdateMachine() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      machineType,
      status,
    }: {
      id: string;
      name: string;
      machineType: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.updateMachine(id, name, machineType, status);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["machines"] }),
  });
}

export function useDeleteMachine() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.deleteMachine(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["machines"] }),
  });
}

// ─── Sensors ────────────────────────────────────────────────────────────────

export function useSensors(machineId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Sensor[]>({
    queryKey: ["sensors", machineId],
    queryFn: async () => {
      if (!actor || !machineId) return [];
      const raw = await actor.getSensorsForMachine(machineId);
      return raw as Sensor[];
    },
    enabled: !!actor && !isFetching && !!machineId,
  });
}

export function useAllSensors() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Sensor[]>({
    queryKey: ["sensors", "all"],
    queryFn: async () => {
      if (!actor) return [];
      // Fetch sensors for each known machine is done in simulation — here we return cached
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSensor() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      machineId,
      sensorName,
      unit,
      refreshInterval,
    }: {
      machineId: string;
      sensorName: string;
      unit: string;
      refreshInterval: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.addSensor(
        machineId,
        sensorName,
        unit,
        refreshInterval,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["sensors", vars.machineId] }),
  });
}

export function useUpdateSensor() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      sensorName,
      unit,
      refreshInterval,
      enabled,
    }: {
      id: string;
      sensorName: string;
      unit: string;
      refreshInterval: bigint;
      enabled: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.updateSensor(
        id,
        sensorName,
        unit,
        refreshInterval,
        enabled,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensors"] }),
  });
}

export function useDeleteSensor() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.deleteSensor(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensors"] }),
  });
}

// ─── Alert Thresholds ────────────────────────────────────────────────────────

export function useAlertThresholds(machineId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AlertThreshold[]>({
    queryKey: ["thresholds", machineId],
    queryFn: async () => {
      if (!actor || !machineId) return [];
      const raw = await actor.getAlertThresholds(machineId);
      return raw as AlertThreshold[];
    },
    enabled: !!actor && !isFetching && !!machineId,
  });
}

export function useSetAlertThreshold() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      machineId,
      sensorId,
      sensorName,
      warnLevel,
      criticalLevel,
    }: {
      machineId: string;
      sensorId: string;
      sensorName: string;
      warnLevel: number;
      criticalLevel: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.setAlertThreshold(
        machineId,
        sensorId,
        sensorName,
        warnLevel,
        criticalLevel,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["thresholds", vars.machineId] }),
  });
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export function useAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AlertEvent[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAlertEvents(100n);
      return raw.map((a) => ({
        ...a,
        severity: a.severity as AlertEvent["severity"],
      }));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5_000,
  });
}

export function useAcknowledgeAlert() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.acknowledgeAlert(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

// ─── Production ──────────────────────────────────────────────────────────────

export function useProductionData(machineId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["production", machineId],
    queryFn: async () => {
      if (!actor || !machineId) return [];
      return actor.getProductionHistory(machineId, 24n);
    },
    enabled: !!actor && !isFetching && !!machineId,
    refetchInterval: 10_000,
  });
}

export function useRecordProduction() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      machineId,
      count,
    }: { machineId: string; count: bigint }) => {
      if (!actor) return;
      try {
        const res = await actor.recordProduction(machineId, count);
        if (res.__kind__ === "err") throw new Error(res.err);
        return res.ok;
      } catch {
        /* silent — store is source of truth */
      }
    },
  });
}

export function useTotalProduction() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["totalProduction"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTotalProduction();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

// ─── Wear ────────────────────────────────────────────────────────────────────

export function useWearHistory(machineId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["wear", machineId],
    queryFn: async () => {
      if (!actor || !machineId) return [];
      return actor.getWearHistory(machineId, 24n);
    },
    enabled: !!actor && !isFetching && !!machineId,
    refetchInterval: 15_000,
  });
}

export function useRecordWear() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      machineId,
      wearPercent,
    }: { machineId: string; wearPercent: number }) => {
      if (!actor) return;
      try {
        const res = await actor.recordWear(machineId, wearPercent);
        if (res.__kind__ === "err") throw new Error(res.err);
      } catch {
        /* silent */
      }
    },
  });
}

// ─── Sensor Readings ─────────────────────────────────────────────────────────

export function useRecordSensorReading() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      sensorId,
      machineId,
      sensorName,
      value,
    }: {
      sensorId: string;
      machineId: string;
      sensorName: string;
      value: number;
    }) => {
      if (!actor) return;
      try {
        const res = await actor.recordSensorReading(
          sensorId,
          machineId,
          sensorName,
          value,
        );
        if (res.__kind__ === "err") throw new Error(res.err);
      } catch {
        /* silent */
      }
    },
  });
}

export function useAddAlertEvent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      machineId,
      machineName,
      sensorName,
      value,
      severity,
    }: {
      machineId: string;
      machineName: string;
      sensorName: string;
      value: number;
      severity: string;
    }) => {
      if (!actor) return;
      try {
        const res = await actor.addAlertEvent(
          machineId,
          machineName,
          sensorName,
          value,
          severity,
        );
        if (res.__kind__ === "err") throw new Error(res.err);
        return res.ok;
      } catch {
        /* silent */
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
