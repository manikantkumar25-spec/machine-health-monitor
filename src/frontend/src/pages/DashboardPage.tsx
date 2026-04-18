import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  Clock,
  Gauge,
  RefreshCw,
  Thermometer,
  Vibrate,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeFailureProbability } from "../lib/simulation";
import { useMachineStore } from "../store/machineStore";
import type { HealthStatus } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────
const CYAN = "#00d4ff";
const WARN = "#ffd700";
const CRIT = "#ff4444";
const GOOD = "#00ff88";
const CARD_BG = "#111118";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SensorHistoryPoint {
  ts: number;
  value: number;
}

interface SensorHistoryBuffer {
  [machineId: string]: {
    [sensorName: string]: SensorHistoryPoint[];
  };
}

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded border border-white/10 px-3 py-2 text-xs"
      style={{ backgroundColor: "#0d0d14" }}
    >
      {label && <p className="text-white/40 mb-1 font-mono">{label}</p>}
      {payload.map((p) => (
        <p
          key={p.name}
          className="font-mono font-bold"
          style={{ color: p.color }}
        >
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Sparkline (canvas) ───────────────────────────────────────────────────────
function Sparkline({ data, color = CYAN }: { data: number[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / range) * (h - 4) - 2,
    }));
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2;
      ctx.bezierCurveTo(cp1x, pts[i - 1].y, cp1x, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineTo(pts[pts.length - 1].x, h);
    ctx.lineTo(pts[0].x, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${color}40`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fill();
  }, [data, color]);
  return (
    <canvas ref={canvasRef} width={80} height={28} className="opacity-80" />
  );
}

// ─── Wear Gauge (SVG) ─────────────────────────────────────────────────────────
function WearGauge({ percent }: { percent: number }) {
  const angle = -140 + (percent / 100) * 280;
  const r = 56;
  const cx = 72;
  const cy = 72;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (startDeg: number, endDeg: number, radius: number) => {
    const start = {
      x: cx + radius * Math.cos(toRad(startDeg)),
      y: cy + radius * Math.sin(toRad(startDeg)),
    };
    const end = {
      x: cx + radius * Math.cos(toRad(endDeg)),
      y: cy + radius * Math.sin(toRad(endDeg)),
    };
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  };
  const color = percent >= 70 ? CRIT : percent >= 40 ? WARN : CYAN;
  const needleX = cx + (r - 10) * Math.cos(toRad(angle));
  const needleY = cy + (r - 10) * Math.sin(toRad(angle));
  return (
    <svg
      width="144"
      height="100"
      viewBox="0 0 144 100"
      className="mx-auto"
      role="img"
      aria-label={`Wear gauge: ${percent.toFixed(0)}%`}
    >
      <path
        d={arcPath(-140, 140, r)}
        fill="none"
        stroke="#1e1e2e"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d={arcPath(-140, -140 + (percent / 100) * 280, r)}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={4} fill={color} />
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Geist Mono"
      >
        {percent.toFixed(0)}%
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fill="#666"
        fontSize="8"
        fontFamily="sans-serif"
      >
        WEAR
      </text>
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  unit,
  sub,
  subColor,
  ocid,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subColor?: string;
  ocid: string;
}) {
  return (
    <Card
      className="p-4 border-white/10 flex flex-col gap-1 relative overflow-hidden"
      style={{ backgroundColor: CARD_BG }}
      data-ocid={ocid}
    >
      <span className="kpi-label text-[10px]">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {sub && (
        <span
          className="text-xs font-semibold"
          style={{ color: subColor ?? GOOD }}
        >
          {sub}
        </span>
      )}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: `${subColor ?? CYAN}60` }}
      />
    </Card>
  );
}

// ─── Sensor Tile ──────────────────────────────────────────────────────────────
function SensorTile({
  name,
  value,
  unit,
  status,
  history,
  icon: Icon,
  ocid,
}: {
  name: string;
  value: number;
  unit: string;
  status: HealthStatus;
  history: number[];
  icon: React.ComponentType<{ className?: string }>;
  ocid: string;
}) {
  const statusColor =
    status === "Critical" ? CRIT : status === "Warning" ? WARN : GOOD;
  const sparkColor =
    status === "Critical" ? CRIT : status === "Warning" ? WARN : CYAN;
  const trend = useMemo(() => {
    if (history.length < 3) return "→";
    const last3 = history.slice(-3);
    const delta = last3[2] - last3[0];
    if (delta > last3[0] * 0.02) return "↑";
    if (delta < -last3[0] * 0.02) return "↓";
    return "→";
  }, [history]);

  return (
    <Card
      className="p-4 border-white/10 relative overflow-hidden"
      style={{ backgroundColor: CARD_BG }}
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="kpi-label text-[10px]">{name}</span>
        </div>
        <Sparkline
          data={history.length > 1 ? history : [value, value]}
          color={sparkColor}
        />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
          {typeof value === "number"
            ? value.toFixed(name.toLowerCase().includes("vib") ? 2 : 1)
            : "—"}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
        <span className="text-base ml-auto" style={{ color: statusColor }}>
          {trend}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: statusColor }}
        >
          {status}
        </span>
        <Badge
          className="text-[9px] px-1.5 py-0 border-0"
          style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
        >
          {status === "Good" ? "NORMAL" : status.toUpperCase()}
        </Badge>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: statusColor, opacity: 0.5 }}
      />
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    machines,
    selectedMachineId,
    liveReadings,
    alerts,
    wearHistory,
    productionData,
  } = useMachineStore();

  // ─── Local sensor history buffer ─────────────────────────────────────────
  const sensorHistoryRef = useRef<SensorHistoryBuffer>({});

  const machine = useMemo(
    () =>
      machines.find((m) => m.id === selectedMachineId) ?? machines[0] ?? null,
    [machines, selectedMachineId],
  );

  const machineReadings = useMemo(() => {
    if (!machine) return {};
    return Object.fromEntries(
      Object.entries(liveReadings).filter(([k]) =>
        k.startsWith(`${machine.id}-`),
      ),
    );
  }, [machine, liveReadings]);

  // ─── Update local sensor history on each reading ──────────────────────────
  useEffect(() => {
    if (!machine) return;
    const buf = sensorHistoryRef.current;
    if (!buf[machine.id]) buf[machine.id] = {};
    for (const snap of Object.values(machineReadings)) {
      const key = snap.sensorName;
      if (!buf[machine.id][key]) buf[machine.id][key] = [];
      buf[machine.id][key].push({ ts: snap.timestamp, value: snap.value });
      if (buf[machine.id][key].length > 30) buf[machine.id][key].shift();
    }
  }, [machine, machineReadings]);

  // ─── Sensor tiles definition ──────────────────────────────────────────────
  const sensorTiles = useMemo(() => {
    const entries = Object.values(machineReadings);
    const buf = machine ? (sensorHistoryRef.current[machine.id] ?? {}) : {};
    return [
      {
        name: "Temperature",
        key: "Temperature",
        unit: "°C",
        icon: Thermometer,
        match: (n: string) => n.toLowerCase().includes("temp"),
      },
      {
        name: "Vibration",
        key: "Vibration",
        unit: "mm/s",
        icon: Vibrate,
        match: (n: string) => n.toLowerCase().includes("vib"),
      },
      {
        name: "Load",
        key: "Load",
        unit: "%",
        icon: Gauge,
        match: (n: string) => n.toLowerCase().includes("load"),
      },
      {
        name: "Speed",
        key: "Speed",
        unit: "RPM",
        icon: Zap,
        match: (n: string) =>
          n.toLowerCase().includes("speed") || n.toLowerCase().includes("rpm"),
      },
    ].map((tile) => {
      const snap = entries.find((e) => tile.match(e.sensorName));
      const hist = snap ? (buf[snap.sensorName] ?? []).map((p) => p.value) : [];
      return { ...tile, snap, history: hist };
    });
  }, [machine, machineReadings]);

  // ─── Wear data ────────────────────────────────────────────────────────────
  const currentWear = useMemo(() => {
    if (!machine) return 0;
    const records = wearHistory.filter((w) => w.machineId === machine.id);
    return records.length > 0 ? records[records.length - 1].wearPercent : 0;
  }, [machine, wearHistory]);

  const wearStatus: HealthStatus =
    currentWear >= 70 ? "Critical" : currentWear >= 40 ? "Warning" : "Good";

  const maintenanceEstimate = useMemo(() => {
    if (currentWear >= 90) return "IMMEDIATE";
    if (currentWear >= 70) return "~2 WEEKS";
    if (currentWear >= 40) return "~2 MONTHS";
    return "~6 MONTHS";
  }, [currentWear]);

  // ─── Wear chart data: generate seed + live data ───────────────────────────
  const wearChartData = useMemo(() => {
    if (!machine) return [];
    const liveRecords = wearHistory
      .filter((w) => w.machineId === machine.id)
      .slice(-20);
    if (liveRecords.length >= 3) {
      return liveRecords.map((w) => ({
        time: new Date(Number(w.timestamp) / 1_000_000).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit" },
        ),
        wear: Math.round(w.wearPercent * 10) / 10,
      }));
    }
    // Seed: 24 hourly points from 5% → currentWear
    const now = Date.now();
    const seed: { time: string; wear: number }[] = [];
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * 3600_000);
      const progress = (24 - i) / 24;
      const baseWear =
        5 + (currentWear - 5) * progress + (Math.random() - 0.5) * 1.5;
      seed.push({
        time: t.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        wear: Math.max(
          0,
          Math.round(Math.min(baseWear, currentWear) * 10) / 10,
        ),
      });
    }
    return seed;
  }, [machine, wearHistory, currentWear]);

  // ─── Production data ──────────────────────────────────────────────────────
  const machineProductionData = useMemo(
    () => productionData.filter((p) => p.machineId === (machine?.id ?? "")),
    [machine, productionData],
  );

  const totalProduction = useMemo(
    () => machineProductionData.reduce((sum, p) => sum + Number(p.count), 0),
    [machineProductionData],
  );

  const productionRate = useMemo(() => {
    const recent = machineProductionData.slice(-20);
    if (recent.length < 2) return 0;
    const total = recent.reduce((sum, p) => sum + Number(p.count), 0);
    return Math.round((total / recent.length) * 20);
  }, [machineProductionData]);

  // ─── Production chart data: seed or live ─────────────────────────────────
  const productionChartData = useMemo(() => {
    if (!machine) return [];
    const live = machineProductionData.slice(-30);
    if (live.length >= 5) {
      let cumulative = 0;
      return live.map((p) => {
        cumulative += Number(p.count);
        return {
          time: new Date(Number(p.timestamp) / 1_000_000).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit" },
          ),
          count: cumulative,
        };
      });
    }
    // Seed: 24 hourly production points
    const now = Date.now();
    const hourlyBase =
      machine.status === "Idle" ? 40 : machine.status === "Fault" ? 0 : 280;
    let cumulative = 0;
    const seed: { time: string; count: number }[] = [];
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * 3600_000);
      cumulative += Math.floor(hourlyBase * (0.7 + Math.random() * 0.6));
      seed.push({
        time: t.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        count: cumulative,
      });
    }
    return seed;
  }, [machine, machineProductionData]);

  // ─── Sensor trend chart data ──────────────────────────────────────────────
  const sensorTrendData = useMemo(() => {
    if (!machine) return [];
    const buf = sensorHistoryRef.current[machine.id] ?? {};
    const keys = ["Temperature", "Vibration", "Load", "Speed (RPM)"];
    // normalize each sensor 0-100
    const maxValues: Record<string, number> = {
      Temperature: 100,
      Vibration: 1.2,
      Load: 100,
      "Speed (RPM)": 4000,
    };
    const maxLen = Math.max(...keys.map((k) => (buf[k] ?? []).length), 0);
    if (maxLen < 2) {
      // Generate seed data
      const now = Date.now();
      return Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - (19 - i) * 10_000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        Temperature:
          Math.round((55 + Math.sin(i * 0.4) * 8 + Math.random() * 4) * 10) /
          10,
        Vibration:
          Math.round(
            (0.35 + Math.sin(i * 0.3) * 0.08 + Math.random() * 0.05) * 100,
          ) / 100,
        Load:
          Math.round((65 + Math.sin(i * 0.5) * 12 + Math.random() * 6) * 10) /
          10,
      }));
    }
    const liveNow = Date.now();
    return Array.from({ length: Math.min(maxLen, 20) }, (_, idx) => {
      const point: Record<string, string | number> = {
        time: new Date(liveNow - (maxLen - 1 - idx) * 3000).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit", second: "2-digit" },
        ),
      };
      for (const key of keys) {
        const hist = buf[key] ?? [];
        const offset = hist.length - maxLen;
        const entry = hist[idx + offset];
        if (entry) {
          const pct = Math.min(
            100,
            Math.round((entry.value / (maxValues[key] ?? 100)) * 1000) / 10,
          );
          const displayKey = key.replace(" (RPM)", "");
          point[displayKey] = pct;
        }
      }
      return point;
    });
  }, [machine]);

  // ─── Fleet KPIs ───────────────────────────────────────────────────────────
  const runningCount = useMemo(
    () => machines.filter((m) => m.status === "Running").length,
    [machines],
  );
  const fleetEfficiency =
    machines.length > 0
      ? Math.round((runningCount / machines.length) * 100)
      : 0;

  // ─── Alerts ───────────────────────────────────────────────────────────────
  const machineAlerts = useMemo(() => {
    if (!machine) return [];
    return alerts
      .filter((a) => a.machineId === machine.id && !a.acknowledged)
      .slice(0, 5);
  }, [machine, alerts]);

  const failureProbability = useMemo(
    () =>
      computeFailureProbability(
        currentWear,
        machineAlerts.filter((a) => a.severity === "Critical").length,
        0,
        0,
      ),
    [currentWear, machineAlerts],
  );

  // ─── Loading state ────────────────────────────────────────────────────────
  if (!machine) {
    return (
      <div className="p-6 space-y-4" data-ocid="dashboard.loading_state">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const statusColor =
    machine.status === "Running"
      ? GOOD
      : machine.status === "Fault"
        ? CRIT
        : WARN;
  const wearColor =
    wearStatus === "Critical" ? CRIT : wearStatus === "Warning" ? WARN : CYAN;

  return (
    <div className="p-4 space-y-4" data-ocid="dashboard.page">
      {/* ── Machine Header Bar ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/10"
        style={{ backgroundColor: CARD_BG }}
        data-ocid="dashboard.machine_header"
      >
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4" style={{ color: CYAN }} />
          <span className="font-display font-bold text-sm text-foreground">
            {machine.name}
          </span>
          <Badge
            className="text-[10px] px-2 py-0.5 border"
            style={{
              borderColor: `${statusColor}40`,
              color: statusColor,
              backgroundColor: `${statusColor}15`,
            }}
          >
            {machine.status.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {machine.machineType}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="font-mono">
              {machines.length} MACHINES TRACKED
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: CYAN }}
          >
            <RefreshCw
              className="h-3 w-3 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span className="font-mono font-bold">LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Section 1: KPI Cards ─────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
          KEY PERFORMANCE INDICATORS
        </p>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          data-ocid="dashboard.kpi_row"
        >
          <KpiCard
            label="Total Production Today"
            value={totalProduction.toLocaleString()}
            unit="UNITS"
            sub={`+${(productionRate / 10).toFixed(1)}% from yesterday`}
            subColor={GOOD}
            ocid="dashboard.total_production_card"
          />
          <KpiCard
            label="Production Rate"
            value={productionRate.toLocaleString()}
            unit="UNITS/HR"
            sub={
              machine.status === "Running"
                ? "On target"
                : machine.status === "Idle"
                  ? "Idle"
                  : "Fault — stopped"
            }
            subColor={
              machine.status === "Running"
                ? GOOD
                : machine.status === "Idle"
                  ? WARN
                  : CRIT
            }
            ocid="dashboard.rate_card"
          />
          <KpiCard
            label="Fleet Efficiency"
            value={`${fleetEfficiency}`}
            unit="%"
            sub={
              fleetEfficiency >= 80
                ? "Excellent"
                : fleetEfficiency >= 50
                  ? "Moderate"
                  : "Low — check faults"
            }
            subColor={
              fleetEfficiency >= 80 ? GOOD : fleetEfficiency >= 50 ? WARN : CRIT
            }
            ocid="dashboard.fleet_efficiency_card"
          />
          <KpiCard
            label="Active Machines"
            value={`${runningCount} / ${machines.length}`}
            unit="RUNNING"
            sub={`${machines.filter((m) => m.status === "Fault").length} fault${machines.filter((m) => m.status === "Fault").length !== 1 ? "s" : ""} detected`}
            subColor={
              machines.filter((m) => m.status === "Fault").length > 0
                ? CRIT
                : GOOD
            }
            ocid="dashboard.active_machines_card"
          />
        </div>
      </div>

      {/* ── Section 2: Sensor Values Grid ───────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
          LIVE SENSOR READINGS — {machine.name}
        </p>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          data-ocid="dashboard.sensor_tiles"
        >
          {sensorTiles.map((tile, i) => (
            <SensorTile
              key={tile.key}
              name={tile.name}
              value={tile.snap?.value ?? 0}
              unit={tile.snap?.unit ?? tile.unit}
              status={tile.snap?.status ?? "Good"}
              history={tile.history}
              icon={tile.icon}
              ocid={`dashboard.sensor.${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Section 3: Charts Row ────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
          PRODUCTION & SENSOR TRENDS
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* LEFT: Production Over Time */}
          <Card
            className="p-4 border-white/10"
            style={{ backgroundColor: CARD_BG }}
            data-ocid="dashboard.production_chart"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="kpi-label text-[10px]">
                Production Over Time
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                LAST 24 HRS
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart
                data={productionChartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CYAN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CYAN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff08"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "#ffffff10" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Units"
                  stroke={CYAN}
                  strokeWidth={2}
                  fill="url(#prodGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: CYAN,
                    stroke: "#0a0a0f",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* RIGHT: Sensor Trends */}
          <Card
            className="p-4 border-white/10"
            style={{ backgroundColor: CARD_BG }}
            data-ocid="dashboard.sensor_trends_chart"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="kpi-label text-[10px]">
                Sensor Trends (Normalized)
              </span>
              <div className="flex items-center gap-3 text-[9px] font-mono">
                <span style={{ color: CYAN }}>● TEMP</span>
                <span style={{ color: WARN }}>● VIB</span>
                <span style={{ color: CRIT }}>● LOAD</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={sensorTrendData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff08"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "#ffffff10" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Temperature"
                  name="Temp %"
                  stroke={CYAN}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Vibration"
                  name="Vib %"
                  stroke={WARN}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Load"
                  name="Load %"
                  stroke={CRIT}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ── Section 4: Machine Health + Wear Chart ───────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
          MACHINE HEALTH & WEAR PROGRESSION
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* LEFT: Health Card */}
          <Card
            className="p-5 border-white/10 flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: CARD_BG }}
            data-ocid="dashboard.health_card"
          >
            <Badge
              className="text-xs px-4 py-1.5 font-bold tracking-widest border-0 uppercase"
              style={{
                backgroundColor: `${wearColor}25`,
                color: wearColor,
                boxShadow: `0 0 20px ${wearColor}30`,
              }}
            >
              {wearStatus === "Good"
                ? "GOOD"
                : wearStatus === "Warning"
                  ? "WARNING"
                  : "CRITICAL"}
            </Badge>

            <WearGauge percent={currentWear} />

            <div className="w-full space-y-3 text-center">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">
                  WEAR LEVEL
                </p>
                <p
                  className="font-mono text-4xl font-bold"
                  style={{ color: wearColor }}
                >
                  {currentWear.toFixed(0)}%
                </p>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">
                  FAILURE RISK
                </p>
                <p
                  className="font-mono font-bold text-base"
                  style={{
                    color:
                      failureProbability > 50
                        ? CRIT
                        : failureProbability > 25
                          ? WARN
                          : GOOD,
                  }}
                >
                  {failureProbability.toFixed(0)}% risk
                </p>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">
                  REPLACEMENT NEEDED
                </p>
                <p
                  className="font-mono font-bold text-sm"
                  style={{ color: wearColor }}
                >
                  {maintenanceEstimate}
                </p>
              </div>
            </div>
          </Card>

          {/* RIGHT: Wear Progression Chart */}
          <Card
            className="p-4 border-white/10 lg:col-span-2"
            style={{ backgroundColor: CARD_BG }}
            data-ocid="dashboard.wear_chart"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="kpi-label text-[10px]">Wear Progression</span>
              <div className="flex items-center gap-3 text-[9px] font-mono">
                <span style={{ color: WARN }}>— WARN 40%</span>
                <span style={{ color: CRIT }}>— CRIT 70%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={wearChartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="wearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CYAN} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CYAN} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff08"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "#ffffff10" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{
                    fill: "#ffffff40",
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine
                  y={40}
                  stroke={WARN}
                  strokeDasharray="4 3"
                  strokeOpacity={0.6}
                  label={{
                    value: "40%",
                    fill: WARN,
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke={CRIT}
                  strokeDasharray="4 3"
                  strokeOpacity={0.6}
                  label={{
                    value: "70%",
                    fill: CRIT,
                    fontSize: 9,
                    fontFamily: "Geist Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="wear"
                  name="Wear %"
                  stroke={CYAN}
                  strokeWidth={2}
                  fill="url(#wearGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: CYAN,
                    stroke: "#0a0a0f",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ── Alerts Panel ─────────────────────────────────────────────── */}
      <Card
        className="p-4 border-white/10"
        style={{ backgroundColor: CARD_BG }}
        data-ocid="dashboard.alerts_panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-3.5 w-3.5" style={{ color: WARN }} />
          <span className="kpi-label text-[10px]">
            Active Alerts — {machine.name}
          </span>
          {machineAlerts.length > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white"
              style={{ backgroundColor: CRIT }}
            >
              {machineAlerts.length}
            </span>
          )}
        </div>
        {machineAlerts.length === 0 ? (
          <div
            className="flex items-center gap-2 py-2"
            data-ocid="dashboard.alerts.empty_state"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: GOOD, boxShadow: `0 0 6px ${GOOD}` }}
            />
            <span className="text-xs" style={{ color: GOOD }}>
              All systems operating normally
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {machineAlerts.map((alert, i) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 px-3 py-2 rounded border"
                style={{
                  borderColor:
                    alert.severity === "Critical" ? `${CRIT}40` : `${WARN}40`,
                  backgroundColor:
                    alert.severity === "Critical" ? `${CRIT}0a` : `${WARN}0a`,
                }}
                data-ocid={`dashboard.alert.${i + 1}`}
              >
                <Badge
                  className="text-[9px] px-1.5 py-0 shrink-0 border-0 font-bold"
                  style={{
                    backgroundColor:
                      alert.severity === "Critical" ? CRIT : WARN,
                    color: alert.severity === "Critical" ? "white" : "#000",
                  }}
                >
                  {alert.severity.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono flex-1 min-w-0 truncate">
                  {alert.sensorName.toUpperCase()} — {alert.value.toFixed(1)}{" "}
                  {alert.severity === "Critical" ? "⚠" : "!"}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono">
                    {new Date(
                      Number(alert.timestamp) / 1_000_000,
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
