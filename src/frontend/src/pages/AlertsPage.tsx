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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Download,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAcknowledgeAlert } from "../hooks/useBackend";
import { useMachineStore } from "../store/machineStore";
import type { AlertEvent } from "../types";

type SeverityTab = "all" | "warning" | "critical";
type TimeRange = "1h" | "24h" | "all";

// ── helpers ──────────────────────────────────────────────────────────────────

function tsMs(alert: AlertEvent): number {
  return Number(alert.timestamp) / 1_000_000;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function exportCsv(alerts: AlertEvent[]) {
  const header = [
    "Timestamp",
    "Machine",
    "Sensor",
    "Value",
    "Severity",
    "Acknowledged",
  ];
  const rows = alerts.map((a) => [
    new Date(tsMs(a)).toISOString(),
    `"${a.machineName}"`,
    `"${a.sensorName}"`,
    a.value.toFixed(2),
    a.severity,
    a.acknowledged ? "Yes" : "No",
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// ── AlertRow ─────────────────────────────────────────────────────────────────

function AlertRow({
  alert,
  index,
  isNew,
  onAcknowledge,
  onDismiss,
}: {
  alert: AlertEvent;
  index: number;
  isNew: boolean;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const isCritical = alert.severity === "Critical";
  const isAcked = alert.acknowledged;
  const ms = tsMs(alert);
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setHighlight(false), 1800);
    return () => clearTimeout(t);
  }, [isNew]);

  const borderColor = isAcked
    ? "rgba(255,255,255,0.12)"
    : isCritical
      ? "#ff4444"
      : "#ffd700";

  const bgColor = highlight
    ? "rgba(255,215,0,0.08)"
    : isAcked
      ? "rgba(255,255,255,0.03)"
      : isCritical
        ? "rgba(255,68,68,0.05)"
        : "rgba(255,215,0,0.04)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isAcked ? 0.55 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22 }}
      className="flex items-center gap-3 px-4 py-3 rounded-r-lg mb-2 border-l-4 transition-colors duration-700"
      style={{ borderLeftColor: borderColor, backgroundColor: bgColor }}
      data-ocid={`alerts.item.${index}`}
    >
      {/* Severity badge */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        {isAcked ? (
          <CheckCircle2 className="h-4 w-4 text-[#00ff88]" />
        ) : isCritical ? (
          <XCircle className="h-4 w-4 text-[#ff4444]" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-[#ffd700]" />
        )}
        <span
          className="text-[9px] font-bold px-1 py-0.5 rounded leading-none"
          style={{
            backgroundColor: isAcked
              ? "rgba(0,255,136,0.15)"
              : isCritical
                ? "#ff4444"
                : "#ffd700",
            color: isAcked ? "#00ff88" : isCritical ? "#fff" : "#000",
          }}
        >
          {isAcked ? "ACK" : isCritical ? "CRITICAL" : "WARNING"}
        </span>
      </div>

      {/* Machine + sensor */}
      <div className="w-36 shrink-0 min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {alert.machineName}
        </p>
        <p className="text-xs text-white/60 truncate leading-tight mt-0.5">
          {alert.sensorName}
        </p>
      </div>

      {/* Value */}
      <div className="flex-1 min-w-0">
        <p
          className="font-mono text-base font-bold leading-tight"
          style={{ color: isAcked ? "rgba(255,255,255,0.4)" : borderColor }}
        >
          {alert.value.toFixed(2)}
        </p>
        <p className="text-[10px] text-white/40 leading-tight mt-0.5">
          {isCritical
            ? "Critical threshold exceeded"
            : "Warning threshold exceeded"}
        </p>
      </div>

      {/* Timestamp */}
      <div className="shrink-0 text-right mr-1">
        <p className="font-mono text-[10px] text-white/40 leading-tight">
          {formatTime(ms)}
        </p>
        <p className="text-[10px] text-white/30 leading-tight mt-0.5">
          {timeAgo(ms)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!isAcked && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#00ff88] hover:bg-[#00ff88]/10 hover:text-[#00ff88]"
            title="Acknowledge"
            aria-label="Acknowledge alert"
            onClick={() => onAcknowledge(alert.id)}
            data-ocid={`alerts.ack_button.${index}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/30 hover:bg-white/10 hover:text-white/70"
          title="Dismiss"
          aria-label="Dismiss alert"
          onClick={() => onDismiss(alert.id)}
          data-ocid={`alerts.dismiss_button.${index}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── KPI chip ─────────────────────────────────────────────────────────────────

function KpiChip({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border"
      style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
    >
      <span
        className="font-mono font-bold text-xl leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span className="text-xs text-white/50 font-medium uppercase tracking-wide leading-tight">
        {label}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const { alerts, machines, setAlerts } = useMachineStore();
  const acknowledgeAlert = useAcknowledgeAlert();

  const [search, setSearch] = useState("");
  const [machineFilter, setMachineFilter] = useState("all");
  const [severityTab, setSeverityTab] = useState<SeverityTab>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const prevAlertsRef = useRef<AlertEvent[]>(alerts);

  // Track newly added alerts for highlight animation
  useEffect(() => {
    const prev = prevAlertsRef.current;
    const prevIds = new Set(prev.map((a) => a.id));
    const freshIds = alerts.filter((a) => !prevIds.has(a.id)).map((a) => a.id);
    if (freshIds.length > 0) {
      setNewAlertIds((ids) => {
        const next = new Set(ids);
        for (const id of freshIds) next.add(id);
        return next;
      });
      // Clear highlight after animation completes
      setTimeout(() => {
        setNewAlertIds((ids) => {
          const next = new Set(ids);
          for (const id of freshIds) next.delete(id);
          return next;
        });
      }, 2000);
    }
    prevAlertsRef.current = alerts;
  }, [alerts]);

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert.mutateAsync(id);
    } catch {
      /* ignore backend error */
    }
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
    toast.success("Alert acknowledged");
  };

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setAlerts([]);
    setClearDialogOpen(false);
    toast.success("All alerts cleared");
  };

  const handleExport = () => {
    exportCsv(filtered);
    toast.success(`Exported ${filtered.length} alerts to CSV`);
  };

  // Filter logic
  const now = Date.now();
  const timeMs: Record<TimeRange, number> = {
    "1h": 3_600_000,
    "24h": 86_400_000,
    all: Number.POSITIVE_INFINITY,
  };

  const filtered = alerts.filter((a) => {
    const ms = tsMs(a);
    if (
      timeMs[timeRange] !== Number.POSITIVE_INFINITY &&
      now - ms > timeMs[timeRange]
    )
      return false;
    if (machineFilter !== "all" && a.machineId !== machineFilter) return false;
    if (severityTab === "warning" && a.severity !== "Warning") return false;
    if (severityTab === "critical" && a.severity !== "Critical") return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !a.machineName.toLowerCase().includes(q) &&
        !a.sensorName.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const totalCount = alerts.length;
  const criticalCount = alerts.filter(
    (a) => a.severity === "Critical" && !a.acknowledged,
  ).length;
  const unackedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="p-4 space-y-4" data-ocid="alerts.page">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-tight">
            Alerts &amp; Notifications
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Real-time alert feed — auto-updates every 3s
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:text-[#00d4ff]"
            onClick={handleExport}
            data-ocid="alerts.export_button"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-[#ff4444]/40 text-[#ff4444] hover:bg-[#ff4444]/10 hover:text-[#ff4444]"
            onClick={() => setClearDialogOpen(true)}
            disabled={alerts.length === 0}
            data-ocid="alerts.clear_all_button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </Button>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="flex flex-wrap gap-3" data-ocid="alerts.stats_row">
        <KpiChip label="Total Alerts" value={totalCount} color="#00d4ff" />
        <KpiChip label="Critical" value={criticalCount} color="#ff4444" />
        <KpiChip label="Unacknowledged" value={unackedCount} color="#ffd700" />
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <Input
              placeholder="Search machine or sensor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-[#00d4ff]/50"
              data-ocid="alerts.search_input"
            />
          </div>

          {/* Machine filter */}
          <Select value={machineFilter} onValueChange={setMachineFilter}>
            <SelectTrigger
              className="w-44 h-8 text-xs border-white/15 bg-white/5 text-white/70"
              data-ocid="alerts.machine_filter"
            >
              <SelectValue placeholder="All Machines" />
            </SelectTrigger>
            <SelectContent className="bg-[#111118] border-white/15 text-white">
              <SelectItem value="all" className="text-xs">
                All Machines
              </SelectItem>
              {machines.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time range filter */}
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <SelectTrigger
              className="w-36 h-8 text-xs border-white/15 bg-white/5 text-white/70"
              data-ocid="alerts.time_filter"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111118] border-white/15 text-white">
              <SelectItem value="1h" className="text-xs">
                Last hour
              </SelectItem>
              <SelectItem value="24h" className="text-xs">
                Last 24h
              </SelectItem>
              <SelectItem value="all" className="text-xs">
                All time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity tabs */}
        <Tabs
          value={severityTab}
          onValueChange={(v) => setSeverityTab(v as SeverityTab)}
        >
          <TabsList className="h-8 bg-white/5 border border-white/10 gap-0">
            <TabsTrigger
              value="all"
              className="text-xs h-6 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              data-ocid="alerts.tab.all"
            >
              All ({alerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="warning"
              className="text-xs h-6 px-3 data-[state=active]:bg-[#ffd700]/10"
              data-ocid="alerts.tab.warning"
            >
              <span className="text-[#ffd700]">
                ⚠ Warning (
                {
                  alerts.filter(
                    (a) => a.severity === "Warning" && !a.acknowledged,
                  ).length
                }
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="critical"
              className="text-xs h-6 px-3 data-[state=active]:bg-[#ff4444]/10"
              data-ocid="alerts.tab.critical"
            >
              <span className="text-[#ff4444]">
                ✕ Critical ({criticalCount})
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── Alert list ── */}
      <Card
        className="border-white/10 overflow-hidden"
        style={{ backgroundColor: "#0d0d14" }}
      >
        {/* List header */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </span>
            {filtered.length < alerts.length && (
              <Badge
                className="text-[9px] px-1.5 border-0"
                style={{
                  backgroundColor: "rgba(0,212,255,0.15)",
                  color: "#00d4ff",
                }}
              >
                filtered
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-white/25 font-mono">
            newest first
          </span>
        </div>

        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-16 text-center"
            data-ocid="alerts.empty_state"
          >
            <CheckCircle2 className="h-10 w-10 text-[#00ff88]/30" />
            <p className="text-sm text-white/40">No alerts to display</p>
            <p className="text-xs text-white/25">
              {alerts.length > 0
                ? "Try adjusting your filters"
                : "System is running normally"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="p-3">
              <AnimatePresence initial={false}>
                {filtered.map((alert, i) => (
                  <AlertRow
                    key={alert.id}
                    alert={alert}
                    index={i + 1}
                    isNew={newAlertIds.has(alert.id)}
                    onAcknowledge={handleAcknowledge}
                    onDismiss={handleDismiss}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </Card>

      {/* ── Clear All Confirm Dialog ── */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent
          className="border-white/15 max-w-sm"
          style={{ backgroundColor: "#111118" }}
          data-ocid="alerts.clear_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-[#ff4444]" />
              Clear all alerts?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/60 pt-1">
            This will permanently remove all{" "}
            <span className="text-white font-semibold">{alerts.length}</span>{" "}
            alert{alerts.length !== 1 ? "s" : ""} from the feed. This action
            cannot be undone.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/60 hover:text-white"
              onClick={() => setClearDialogOpen(false)}
              data-ocid="alerts.clear_cancel_button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#ff4444] hover:bg-[#ff4444]/80 text-white border-0"
              onClick={handleClearAll}
              data-ocid="alerts.clear_confirm_button"
            >
              Clear {alerts.length} alerts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
