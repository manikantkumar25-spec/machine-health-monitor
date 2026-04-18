import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMachineStore } from "../store/machineStore";

function StatusDot({ status }: { status: string }) {
  if (status === "Running")
    return (
      <span className="status-indicator bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
    );
  if (status === "Fault")
    return (
      <span className="status-indicator bg-[#ff4444] shadow-[0_0_6px_#ff4444] animate-pulse" />
    );
  return (
    <span className="status-indicator bg-[#ffd700] shadow-[0_0_6px_#ffd700]" />
  );
}

function AlertSeverityIcon({ severity }: { severity: string }) {
  if (severity === "Critical")
    return <XCircle className="h-3 w-3 text-[#ff4444]" />;
  return <AlertTriangle className="h-3 w-3 text-[#ffd700]" />;
}

function NavItem({
  to,
  children,
  ocid,
}: {
  to: string;
  children: React.ReactNode;
  ocid: string;
}) {
  const routerState = useRouterState();
  const isActive = routerState.location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded transition-smooth ${
        isActive
          ? "text-[#00d4ff] bg-[#00d4ff]/10"
          : "text-muted-foreground hover:text-foreground"
      }`}
      data-ocid={ocid}
    >
      {children}
    </Link>
  );
}

export function Layout() {
  const {
    machines,
    alerts,
    selectedMachineId,
    sidebarCollapsed,
    setSelectedMachine,
    setSidebarCollapsed,
  } = useMachineStore();
  const navigate = useNavigate();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const recentAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 3);

  const handleMachineClick = (id: string) => {
    setSelectedMachine(id);
    navigate({ to: "/" });
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Top Header */}
      <header
        className="flex items-center justify-between px-4 h-14 border-b shrink-0"
        style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        data-ocid="header"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#00d4ff]" />
            <span
              className="font-display font-bold text-base tracking-tight"
              style={{ color: "#00d4ff" }}
            >
              JSS Automotives
            </span>
          </div>
          <span className="text-muted-foreground text-xs hidden sm:block">
            |
          </span>
          <nav className="hidden sm:flex items-center gap-1">
            <NavItem to="/" ocid="nav.dashboard_link">
              Dashboard
            </NavItem>
            <NavItem to="/machines" ocid="nav.machines_link">
              Machines
            </NavItem>
            <NavItem to="/alerts" ocid="nav.alerts_link">
              Alerts
              {recentAlerts.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-[#ff4444] text-white font-bold">
                  {recentAlerts.length}
                </span>
              )}
            </NavItem>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="kpi-label text-[#00d4ff] hidden md:block">
            Machine Health Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span
            className="font-mono text-sm tracking-widest tabular-nums"
            style={{ color: "#00d4ff" }}
            data-ocid="header.clock"
          >
            {time}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`flex flex-col border-r shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? "w-12" : "w-60"
          }`}
          style={{ backgroundColor: "#0d0d15", borderColor: "#1e1e2e" }}
          data-ocid="sidebar"
        >
          {/* Collapse toggle */}
          <div
            className="flex items-center justify-end px-2 py-2 border-b"
            style={{ borderColor: "#1e1e2e" }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-[#00d4ff]"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              data-ocid="sidebar.collapse_button"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="px-3 py-2">
                <p className="kpi-label text-[10px]">Machines</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="px-2 pb-2 space-y-1">
                  {machines.map((machine, idx) => (
                    <button
                      type="button"
                      key={machine.id}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left transition-smooth ${
                        selectedMachineId === machine.id
                          ? "bg-[#00d4ff]/10 border border-[#00d4ff]/30"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                      onClick={() => handleMachineClick(machine.id)}
                      data-ocid={`sidebar.machine.${idx + 1}`}
                    >
                      <StatusDot status={machine.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-foreground">
                          {machine.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {machine.machineType}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 shrink-0 ${
                          machine.status === "Running"
                            ? "border-[#00ff88]/40 text-[#00ff88]"
                            : machine.status === "Fault"
                              ? "border-[#ff4444]/40 text-[#ff4444]"
                              : "border-[#ffd700]/40 text-[#ffd700]"
                        }`}
                      >
                        {machine.status}
                      </Badge>
                    </button>
                  ))}
                  {machines.length === 0 && (
                    <p
                      className="text-xs text-muted-foreground px-2 py-4 text-center"
                      data-ocid="sidebar.empty_state"
                    >
                      No machines yet
                    </p>
                  )}
                </div>
              </ScrollArea>
              <div className="p-2 border-t" style={{ borderColor: "#1e1e2e" }}>
                <Link to="/machines">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10"
                    data-ocid="sidebar.add_machine_button"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Machine
                  </Button>
                </Link>
              </div>
            </>
          )}

          {sidebarCollapsed && (
            <div className="flex-1 flex flex-col items-center gap-2 pt-2">
              {machines.map((machine) => (
                <button
                  type="button"
                  key={machine.id}
                  className="p-1.5 rounded hover:bg-white/5 transition-smooth"
                  title={machine.name}
                  onClick={() => handleMachineClick(machine.id)}
                >
                  <StatusDot status={machine.status} />
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "#0a0a0f" }}
        >
          <Outlet />
        </main>
      </div>

      {/* Bottom Alerts Strip */}
      <div
        className="shrink-0 border-t px-4 py-2 flex items-center gap-4"
        style={{
          backgroundColor: "#0d0d15",
          borderColor: "#1e1e2e",
          minHeight: "52px",
        }}
        data-ocid="alerts_strip"
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="kpi-label text-[10px]">Live Alerts</span>
        </div>
        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          {recentAlerts.length === 0 ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-[#00ff88]" />
              <span className="text-xs text-[#00ff88]">All systems normal</span>
            </div>
          ) : (
            recentAlerts.map((alert, idx) => (
              <div
                key={alert.id}
                className="flex items-center gap-1.5 shrink-0"
                data-ocid={`alerts_strip.item.${idx + 1}`}
              >
                <AlertSeverityIcon severity={alert.severity} />
                <span
                  className={`text-xs font-mono ${
                    alert.severity === "Critical"
                      ? "text-[#ff4444]"
                      : "text-[#ffd700]"
                  }`}
                >
                  {alert.machineName} — {alert.sensorName}:{" "}
                  {typeof alert.value === "number"
                    ? alert.value.toFixed(1)
                    : alert.value}
                </span>
              </div>
            ))
          )}
        </div>
        <Link
          to="/alerts"
          className="shrink-0 text-xs text-[#00d4ff] hover:underline font-semibold"
          data-ocid="alerts_strip.view_all_link"
        >
          View All →
        </Link>
      </div>
    </div>
  );
}
