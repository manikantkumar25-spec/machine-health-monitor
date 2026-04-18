import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useParams } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAddSensor,
  useDeleteSensor,
  useSetAlertThreshold,
  useUpdateSensor,
} from "../hooks/useBackend";
import { useMachineStore } from "../store/machineStore";
import type { AlertThreshold, MachineStatus, Sensor } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SensorFormState = {
  sensorName: string;
  unit: string;
  refreshInterval: string;
  warnLevel: string;
  criticalLevel: string;
  enabled: boolean;
};

const EMPTY_FORM: SensorFormState = {
  sensorName: "",
  unit: "",
  refreshInterval: "3",
  warnLevel: "",
  criticalLevel: "",
  enabled: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: MachineStatus): string {
  if (status === "Running") return "#00d4ff";
  if (status === "Fault") return "#ff4444";
  return "#ffd700";
}

// ─── InlineThresholdRow ───────────────────────────────────────────────────────

function InlineThresholdRow({
  sensor,
  threshold,
  index,
  machineId,
}: {
  sensor: Sensor;
  threshold?: AlertThreshold;
  index: number;
  machineId: string;
}) {
  const { thresholds, setThresholds } = useMachineStore();
  const setThreshold = useSetAlertThreshold();

  const [warnVal, setWarnVal] = useState(
    threshold ? String(threshold.warnLevel) : "",
  );
  const [critVal, setCritVal] = useState(
    threshold ? String(threshold.criticalLevel) : "",
  );
  const [saved, setSaved] = useState(false);

  // Sync when threshold changes externally
  useEffect(() => {
    setWarnVal(threshold ? String(threshold.warnLevel) : "");
    setCritVal(threshold ? String(threshold.criticalLevel) : "");
  }, [threshold]);

  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  const handleSave = useCallback(async () => {
    const warn = Number.parseFloat(warnVal);
    const crit = Number.parseFloat(critVal);
    if (Number.isNaN(warn) || Number.isNaN(crit)) {
      toast.error("Enter valid numbers for thresholds");
      return;
    }
    // Optimistic update
    const existing = thresholds.find((t) => t.sensorId === sensor.id);
    if (existing) {
      setThresholds(
        thresholds.map((t) =>
          t.sensorId === sensor.id
            ? { ...t, warnLevel: warn, criticalLevel: crit }
            : t,
        ),
      );
    } else {
      setThresholds([
        ...thresholds,
        {
          id: `local-${Date.now()}`,
          machineId,
          sensorId: sensor.id,
          sensorName: sensor.sensorName,
          warnLevel: warn,
          criticalLevel: crit,
        },
      ]);
    }
    flashSaved();
    try {
      const result = await setThreshold.mutateAsync({
        machineId,
        sensorId: sensor.id,
        sensorName: sensor.sensorName,
        warnLevel: warn,
        criticalLevel: crit,
      });
      if (result) {
        const isThere = thresholds.find((t) => t.sensorId === sensor.id);
        if (isThere) {
          setThresholds(
            thresholds.map((t) =>
              t.sensorId === sensor.id ? (result as AlertThreshold) : t,
            ),
          );
        } else {
          setThresholds([...thresholds, result as AlertThreshold]);
        }
      }
    } catch {
      /* already updated optimistically */
    }
  }, [
    warnVal,
    critVal,
    sensor,
    machineId,
    thresholds,
    setThresholds,
    setThreshold,
    flashSaved,
  ]);

  const handleBlur = useCallback(() => {
    const warn = Number.parseFloat(warnVal);
    const crit = Number.parseFloat(critVal);
    if (!Number.isNaN(warn) && !Number.isNaN(crit) && warnVal && critVal) {
      handleSave();
    }
  }, [warnVal, critVal, handleSave]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-[10px] font-mono" style={{ color: "#ffd700" }}>
          WARN ≥
        </span>
        <Input
          type="number"
          value={warnVal}
          onChange={(e) => setWarnVal(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
          className="h-7 w-20 text-xs font-mono border-[#ffd700]/30 bg-white/5 px-2"
          data-ocid={`sensors.warn_input.${index}`}
        />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-[10px] font-mono" style={{ color: "#ff4444" }}>
          CRIT ≥
        </span>
        <Input
          type="number"
          value={critVal}
          onChange={(e) => setCritVal(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
          className="h-7 w-20 text-xs font-mono border-[#ff4444]/30 bg-white/5 px-2"
          data-ocid={`sensors.crit_input.${index}`}
        />
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSave}
        className={`h-7 px-2 text-xs transition-colors duration-200 ${
          saved
            ? "text-[#00ff88] bg-[#00ff88]/10"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-ocid={`sensors.save_threshold_button.${index}`}
      >
        {saved ? <Check className="h-3.5 w-3.5" /> : "Save"}
      </Button>
    </div>
  );
}

// ─── SensorCard ───────────────────────────────────────────────────────────────

function SensorCard({
  sensor,
  threshold,
  index,
  machineId,
  machineName,
  liveValue,
  onEdit,
  onDelete,
}: {
  sensor: Sensor;
  threshold?: AlertThreshold;
  index: number;
  machineId: string;
  machineName: string;
  liveValue?: { value: number; status: string; unit: string };
  onEdit: (s: Sensor) => void;
  onDelete: (s: Sensor) => void;
}) {
  const { sensors, setSensors } = useMachineStore();
  const updateSensor = useUpdateSensor();

  const handleToggle = useCallback(
    async (enabled: boolean) => {
      // Optimistic update
      setSensors(
        sensors.map((s) => (s.id === sensor.id ? { ...s, enabled } : s)),
      );
      try {
        await updateSensor.mutateAsync({
          id: sensor.id,
          sensorName: sensor.sensorName,
          unit: sensor.unit,
          refreshInterval: sensor.refreshInterval,
          enabled,
        });
      } catch {
        /* already updated optimistically */
      }
    },
    [sensor, sensors, setSensors, updateSensor],
  );

  const valueColor =
    liveValue?.status === "Critical"
      ? "#ff4444"
      : liveValue?.status === "Warning"
        ? "#ffd700"
        : "#00d4ff";

  const refreshSec =
    Number(sensor.refreshInterval) >= 1000
      ? (Number(sensor.refreshInterval) / 1000).toFixed(0)
      : String(Number(sensor.refreshInterval));
  const refreshUnit = Number(sensor.refreshInterval) >= 1000 ? "s" : "ms";

  return (
    <Card
      className={`border border-white/10 rounded-lg p-4 flex flex-col gap-3 transition-opacity duration-300 ${
        sensor.enabled ? "opacity-100" : "opacity-50"
      }`}
      style={{ backgroundColor: "#111118" }}
      data-ocid={`sensors.item.${index}`}
    >
      {/* Row 1: Name + unit badge + toggle */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="h-4 w-4 shrink-0" style={{ color: "#00d4ff" }} />
          <div className="min-w-0">
            <p className="font-bold text-base text-foreground leading-tight truncate">
              {sensor.sensorName}
            </p>
            <span
              className="text-[11px] font-mono px-1.5 py-0.5 rounded border"
              style={{
                color: "#00d4ff",
                borderColor: "#00d4ff30",
                backgroundColor: "#00d4ff0a",
              }}
            >
              {sensor.unit || "—"}
            </span>
          </div>
        </div>
        <Switch
          checked={sensor.enabled}
          onCheckedChange={handleToggle}
          className="shrink-0 mt-0.5"
          aria-label={`${sensor.enabled ? "Disable" : "Enable"} ${sensor.sensorName}`}
          data-ocid={`sensors.toggle.${index}`}
        />
      </div>

      {/* Row 2: Refresh interval + sensor ID */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span>
          Refresh:{" "}
          <span className="text-foreground/70">
            {refreshSec}
            {refreshUnit}
          </span>
        </span>
        <span className="truncate max-w-[120px] text-[10px]">{sensor.id}</span>
      </div>

      {/* Live reading */}
      {liveValue && sensor.enabled && (
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-white/5"
          style={{ backgroundColor: "#0a0a0f" }}
        >
          <span
            className="font-mono font-bold text-lg leading-none"
            style={{ color: valueColor }}
          >
            {liveValue.value.toFixed(
              sensor.sensorName.toLowerCase().includes("vib") ? 2 : 1,
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {liveValue.unit || sensor.unit}
          </span>
          <span
            className="ml-auto text-[10px] font-bold tracking-wide"
            style={{ color: valueColor }}
          >
            {liveValue.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Row 3: Inline threshold inputs */}
      <InlineThresholdRow
        sensor={sensor}
        threshold={threshold}
        index={index}
        machineId={machineId}
      />

      {/* Row 4: Edit + Delete */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[10px] text-muted-foreground">{machineName}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-white/10"
            onClick={() => onEdit(sensor)}
            aria-label={`Edit ${sensor.sensorName}`}
            data-ocid={`sensors.edit_button.${index}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-[#ff4444] hover:bg-[#ff4444]/10"
            onClick={() => onDelete(sensor)}
            aria-label={`Delete ${sensor.sensorName}`}
            data-ocid={`sensors.delete_button.${index}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── SensorsPage ──────────────────────────────────────────────────────────────

export default function SensorsPage() {
  const { machineId } = useParams({ strict: false }) as { machineId: string };
  const {
    machines,
    sensors,
    thresholds,
    liveReadings,
    setSensors,
    setThresholds,
  } = useMachineStore();

  const machine = machines.find((m) => m.id === machineId);
  const machineSensors = sensors.filter((s) => s.machineId === machineId);
  const machineThresholds = thresholds.filter((t) => t.machineId === machineId);

  const addSensorMutation = useAddSensor();
  const updateSensorMutation = useUpdateSensor();
  const deleteSensorMutation = useDeleteSensor();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Sensor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sensor | null>(null);
  const [form, setForm] = useState<SensorFormState>(EMPTY_FORM);

  // Used to keep a stable ref for the delete handler
  const sensorsRef = useRef(sensors);
  const thresholdsRef = useRef(thresholds);
  useEffect(() => {
    sensorsRef.current = sensors;
  }, [sensors]);
  useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  const handleOpenAdd = useCallback(() => {
    setForm(EMPTY_FORM);
    setShowAdd(true);
  }, []);

  const handleOpenEdit = useCallback((s: Sensor) => {
    const existingThreshold = thresholdsRef.current.find(
      (t) => t.sensorId === s.id,
    );
    setForm({
      sensorName: s.sensorName,
      unit: s.unit,
      refreshInterval: String(
        Number(s.refreshInterval) >= 1000
          ? Number(s.refreshInterval) / 1000
          : Number(s.refreshInterval),
      ),
      warnLevel: existingThreshold ? String(existingThreshold.warnLevel) : "",
      criticalLevel: existingThreshold
        ? String(existingThreshold.criticalLevel)
        : "",
      enabled: s.enabled,
    });
    setEditTarget(s);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowAdd(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }, []);

  // Compute refresh interval in ms from the form value
  const formIntervalMs = useCallback((val: string) => {
    const n = Number(val) || 3;
    // If user typed a small number (1-60), assume seconds
    return n <= 60 ? BigInt(n * 1000) : BigInt(n);
  }, []);

  const handleAddSensor = useCallback(async () => {
    if (!form.sensorName.trim() || !machineId) return;
    const intervalMs = formIntervalMs(form.refreshInterval);
    try {
      const result = await addSensorMutation.mutateAsync({
        machineId,
        sensorName: form.sensorName.trim(),
        unit: form.unit.trim(),
        refreshInterval: intervalMs,
      });
      if (result) {
        const newSensor = result as Sensor;
        setSensors([...sensorsRef.current, newSensor]);
        // Add threshold if provided
        const warn = Number.parseFloat(form.warnLevel);
        const crit = Number.parseFloat(form.criticalLevel);
        if (!Number.isNaN(warn) && !Number.isNaN(crit)) {
          setThresholds([
            ...thresholdsRef.current,
            {
              id: `local-${Date.now()}`,
              machineId,
              sensorId: newSensor.id,
              sensorName: newSensor.sensorName,
              warnLevel: warn,
              criticalLevel: crit,
            },
          ]);
        }
        toast.success(`${form.sensorName} added`);
      }
    } catch {
      const local: Sensor = {
        id: `local-${Date.now()}`,
        machineId,
        sensorName: form.sensorName.trim(),
        unit: form.unit.trim(),
        refreshInterval: intervalMs,
        enabled: form.enabled,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      };
      setSensors([...sensorsRef.current, local]);
      const warn = Number.parseFloat(form.warnLevel);
      const crit = Number.parseFloat(form.criticalLevel);
      if (!Number.isNaN(warn) && !Number.isNaN(crit)) {
        setThresholds([
          ...thresholdsRef.current,
          {
            id: `local-${Date.now()}`,
            machineId,
            sensorId: local.id,
            sensorName: local.sensorName,
            warnLevel: warn,
            criticalLevel: crit,
          },
        ]);
      }
      toast.success(`${form.sensorName} added (local)`);
    }
    handleCloseDialog();
  }, [
    form,
    machineId,
    addSensorMutation,
    setSensors,
    setThresholds,
    formIntervalMs,
    handleCloseDialog,
  ]);

  const handleUpdateSensor = useCallback(async () => {
    if (!editTarget) return;
    const intervalMs = formIntervalMs(form.refreshInterval);
    const updated: Sensor = {
      ...editTarget,
      sensorName: form.sensorName.trim(),
      unit: form.unit.trim(),
      refreshInterval: intervalMs,
      enabled: form.enabled,
    };
    // Optimistic
    setSensors(
      sensorsRef.current.map((s) => (s.id === editTarget.id ? updated : s)),
    );
    try {
      await updateSensorMutation.mutateAsync({
        id: editTarget.id,
        sensorName: updated.sensorName,
        unit: updated.unit,
        refreshInterval: updated.refreshInterval,
        enabled: updated.enabled,
      });
    } catch {
      /* already updated optimistically */
    }
    toast.success("Sensor updated");
    handleCloseDialog();
  }, [
    editTarget,
    form,
    setSensors,
    updateSensorMutation,
    formIntervalMs,
    handleCloseDialog,
  ]);

  const handleDeleteSensor = useCallback(async () => {
    if (!deleteTarget) return;
    setSensors(sensorsRef.current.filter((s) => s.id !== deleteTarget.id));
    setThresholds(
      thresholdsRef.current.filter((t) => t.sensorId !== deleteTarget.id),
    );
    setDeleteTarget(null);
    toast.success(`${deleteTarget.sensorName} removed`);
    try {
      await deleteSensorMutation.mutateAsync(deleteTarget.id);
    } catch {
      /* already updated optimistically */
    }
  }, [deleteTarget, setSensors, setThresholds, deleteSensorMutation]);

  if (!machine) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-20"
        data-ocid="sensors.not_found"
      >
        <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">Machine not found</p>
        <Link to="/" className="text-xs text-[#00d4ff] hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const machineStatusColor = statusColor(machine.status);

  return (
    <div className="p-4 md:p-6 space-y-5" data-ocid="sensors.page">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        aria-label="Breadcrumb"
        data-ocid="sensors.breadcrumb"
      >
        <Link
          to="/"
          className="hover:text-foreground transition-colors"
          data-ocid="sensors.breadcrumb_dashboard_link"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to="/machines"
          className="hover:text-foreground transition-colors"
          data-ocid="sensors.breadcrumb_machines_link"
        >
          {machine.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/80">Sensors</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display font-bold text-xl text-foreground leading-tight">
                {machine.name} — Sensor Configuration
              </h1>
              <Badge
                className="text-[10px] px-2 py-0.5 font-mono border"
                style={{
                  color: machineStatusColor,
                  borderColor: `${machineStatusColor}40`,
                  backgroundColor: `${machineStatusColor}12`,
                }}
                data-ocid="sensors.machine_status_badge"
              >
                {machine.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {machineSensors.length} sensor
              {machineSensors.length !== 1 ? "s" : ""} · {machine.machineType}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10"
          onClick={handleOpenAdd}
          data-ocid="sensors.add_sensor_button"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Sensor
        </Button>
      </div>

      {/* Sensor list or empty state */}
      {machineSensors.length === 0 ? (
        <div
          className="flex flex-col items-center gap-4 py-20 text-center"
          data-ocid="sensors.empty_state"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#00d4ff10",
              border: "1px solid #00d4ff30",
            }}
          >
            <Activity className="h-6 w-6" style={{ color: "#00d4ff" }} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              No sensors configured
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Add sensors to start monitoring this machine's health and
              production.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10"
            onClick={handleOpenAdd}
            data-ocid="sensors.empty_add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add first sensor
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          data-ocid="sensors.list"
        >
          {machineSensors.map((sensor, i) => {
            const key = `${machineId}-${sensor.sensorName}`;
            const live = liveReadings[key];
            const threshold = machineThresholds.find(
              (t) => t.sensorId === sensor.id,
            );
            return (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                threshold={threshold}
                index={i + 1}
                machineId={machineId}
                machineName={machine.name}
                liveValue={live}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTarget}
              />
            );
          })}
        </div>
      )}

      {/* Add / Edit Sensor Dialog */}
      <Dialog
        open={showAdd || !!editTarget}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent
          className="border-white/10"
          style={{ backgroundColor: "#111118" }}
          data-ocid="sensors.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editTarget
                ? `Edit Sensor — ${editTarget.sensorName}`
                : `Add Sensor to ${machine.name}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Sensor Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Sensor Name <span className="text-[#ff4444]">*</span>
              </Label>
              <Input
                placeholder="e.g. Temperature"
                value={form.sensorName}
                onChange={(e) =>
                  setForm({ ...form, sensorName: e.target.value })
                }
                className="border-white/20 bg-white/5"
                data-ocid="sensors.name_input"
              />
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Unit</Label>
              <Input
                placeholder="e.g. °C, mm/s, %, RPM, kg"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="border-white/20 bg-white/5"
                data-ocid="sensors.unit_input"
              />
            </div>

            {/* Refresh Interval */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Refresh Interval (seconds, 1–60)
              </Label>
              <Input
                type="number"
                min={1}
                max={60}
                placeholder="3"
                value={form.refreshInterval}
                onChange={(e) =>
                  setForm({ ...form, refreshInterval: e.target.value })
                }
                className="border-white/20 bg-white/5"
                data-ocid="sensors.interval_input"
              />
            </div>

            {/* Thresholds */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: "#ffd700" }}>
                  Warning Threshold (optional)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 70"
                  value={form.warnLevel}
                  onChange={(e) =>
                    setForm({ ...form, warnLevel: e.target.value })
                  }
                  className="border-[#ffd700]/30 bg-white/5"
                  data-ocid="sensors.warn_level_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: "#ff4444" }}>
                  Critical Threshold (optional)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 85"
                  value={form.criticalLevel}
                  onChange={(e) =>
                    setForm({ ...form, criticalLevel: e.target.value })
                  }
                  className="border-[#ff4444]/30 bg-white/5"
                  data-ocid="sensors.critical_level_input"
                />
              </div>
            </div>

            {/* Enabled toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <Label className="text-xs text-foreground">Enable Sensor</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Disabled sensors do not generate simulated data
                </p>
              </div>
              <Switch
                checked={form.enabled}
                onCheckedChange={(v) => setForm({ ...form, enabled: v })}
                data-ocid="sensors.enabled_switch"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDialog}
              data-ocid="sensors.cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/80 font-semibold"
              onClick={editTarget ? handleUpdateSensor : handleAddSensor}
              disabled={!form.sensorName.trim()}
              data-ocid="sensors.submit_button"
            >
              {editTarget ? "Save Changes" : "Add Sensor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent
          className="border-white/10"
          style={{ backgroundColor: "#111118" }}
          data-ocid="sensors.delete_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.sensorName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This will permanently remove{" "}
              <span className="text-foreground font-medium">
                {deleteTarget?.sensorName}
              </span>{" "}
              from{" "}
              <span className="text-foreground font-medium">
                {machine.name}
              </span>{" "}
              and delete all associated thresholds and historical data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-white/20"
              data-ocid="sensors.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#ff4444] text-white hover:bg-[#ff4444]/80"
              onClick={handleDeleteSensor}
              data-ocid="sensors.delete_confirm_button"
            >
              Delete Sensor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
