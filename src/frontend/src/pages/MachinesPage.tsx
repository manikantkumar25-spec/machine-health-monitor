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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Edit2, Factory, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddMachine,
  useDeleteMachine,
  useUpdateMachine,
} from "../hooks/useBackend";
import { useMachineStore } from "../store/machineStore";
import type { Machine, MachineStatus } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MACHINE_TYPES = [
  "CNC",
  "Assembly",
  "Welding",
  "Painting",
  "Quality Control",
  "Other",
];

const STATUSES: MachineStatus[] = ["Running", "Idle", "Fault"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusDotConfig(status: MachineStatus) {
  if (status === "Running") return { color: "#00ff88", pulse: true };
  if (status === "Fault") return { color: "#ff4444", pulse: false };
  return { color: "#ffd700", pulse: false };
}

function statusBadgeStyle(status: MachineStatus): React.CSSProperties {
  if (status === "Running")
    return { backgroundColor: "#00ff8820", color: "#00ff88" };
  if (status === "Fault")
    return { backgroundColor: "#ff444420", color: "#ff4444" };
  return { backgroundColor: "#ffd70020", color: "#ffd700" };
}

// ─── Row Card ────────────────────────────────────────────────────────────────

function MachineRow({
  machine,
  index,
  onEdit,
  onDelete,
  onSensors,
}: {
  machine: Machine;
  index: number;
  onEdit: (m: Machine) => void;
  onDelete: (m: Machine) => void;
  onSensors: (m: Machine) => void;
}) {
  const dot = statusDotConfig(machine.status);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 transition-colors hover:border-white/20"
      style={{ backgroundColor: "#111118" }}
      data-ocid={`machines.item.${index}`}
    >
      {/* Status dot */}
      <div className="flex-shrink-0 flex items-center justify-center w-5">
        <span
          className={`h-2.5 w-2.5 rounded-full${dot.pulse ? " animate-pulse" : ""}`}
          style={{
            backgroundColor: dot.color,
            boxShadow: `0 0 6px ${dot.color}80`,
          }}
        />
      </div>

      {/* Machine Name */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-foreground truncate">
          {machine.name}
        </p>
      </div>

      {/* Machine ID */}
      <div className="hidden sm:block flex-shrink-0 w-28">
        <p
          className="text-[11px] font-mono text-muted-foreground truncate"
          title={machine.id}
        >
          {machine.id.slice(0, 10)}…
        </p>
      </div>

      {/* Type Badge */}
      <div className="hidden md:block flex-shrink-0">
        <Badge
          className="text-[10px] px-2 py-0.5 border font-medium"
          style={{
            backgroundColor: "#00d4ff10",
            color: "#00d4ff",
            borderColor: "#00d4ff30",
          }}
        >
          {machine.machineType}
        </Badge>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <Badge
          className="text-[10px] px-2 py-0.5 border-0 font-medium"
          style={statusBadgeStyle(machine.status)}
        >
          {machine.status}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[11px] gap-1 text-[#00d4ff] hover:bg-[#00d4ff]/10"
          onClick={() => onSensors(machine)}
          data-ocid={`machines.sensors_button.${index}`}
          aria-label={`Configure sensors for ${machine.name}`}
        >
          <Settings className="h-3 w-3" />
          <span className="hidden lg:inline">Sensors</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-white/5"
          onClick={() => onEdit(machine)}
          data-ocid={`machines.edit_button.${index}`}
          aria-label={`Edit ${machine.name}`}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-[#ff4444] hover:bg-[#ff4444]/10"
          onClick={() => onDelete(machine)}
          data-ocid={`machines.delete_button.${index}`}
          aria-label={`Delete ${machine.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Form State ───────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  machineId: string;
  machineType: string;
  status: MachineStatus;
};

const EMPTY_FORM: FormState = {
  name: "",
  machineId: "",
  machineType: "CNC",
  status: "Running",
};

// ─── Machine Form Dialog ──────────────────────────────────────────────────────

function MachineFormDialog({
  open,
  title,
  form,
  isPending,
  onFormChange,
  onSubmit,
  onClose,
  submitLabel,
}: {
  open: boolean;
  title: string;
  form: FormState;
  isPending: boolean;
  onFormChange: (f: FormState) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border-white/10 max-w-md"
        style={{ backgroundColor: "#111118" }}
        data-ocid="machines.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Machine Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Machine Name <span className="text-[#ff4444]">*</span>
            </Label>
            <Input
              placeholder="e.g. CNC-01"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              className="border-white/20 bg-white/5 text-sm"
              data-ocid="machines.name_input"
            />
          </div>

          {/* Machine ID */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Machine ID <span className="text-[#ff4444]">*</span>
            </Label>
            <Input
              placeholder="e.g. CNC-001"
              value={form.machineId}
              onChange={(e) =>
                onFormChange({ ...form, machineId: e.target.value })
              }
              className="border-white/20 bg-white/5 text-sm font-mono"
              data-ocid="machines.id_input"
            />
          </div>

          {/* Machine Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Machine Type
            </Label>
            <Select
              value={form.machineType}
              onValueChange={(v) => onFormChange({ ...form, machineType: v })}
            >
              <SelectTrigger
                className="border-white/20 bg-white/5 text-sm"
                data-ocid="machines.type_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: "#1a1a2e" }}>
                {MACHINE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Initial Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                onFormChange({ ...form, status: v as MachineStatus })
              }
            >
              <SelectTrigger
                className="border-white/20 bg-white/5 text-sm"
                data-ocid="machines.status_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: "#1a1a2e" }}>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="machines.cancel_button"
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-[#00d4ff] text-black hover:bg-[#00b8d9] font-semibold"
            onClick={onSubmit}
            disabled={!form.name.trim() || !form.machineId.trim() || isPending}
            data-ocid="machines.submit_button"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MachinesPage() {
  const { machines, setMachines, setSelectedMachine } = useMachineStore();
  const navigate = useNavigate();
  const addMachine = useAddMachine();
  const updateMachine = useUpdateMachine();
  const deleteMachine = useDeleteMachine();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Machine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Machine | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowAdd(true);
  };

  const openEdit = (m: Machine) => {
    setForm({
      name: m.name,
      machineId: m.id.slice(0, 12),
      machineType: m.machineType,
      status: m.status,
    });
    setEditTarget(m);
  };

  const closeDialog = () => {
    setShowAdd(false);
    setEditTarget(null);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.machineId.trim()) return;
    try {
      const result = await addMachine.mutateAsync({
        name: form.name.trim(),
        machineType: form.machineType,
        status: form.status,
      });
      if (result) {
        setMachines([...machines, { ...result, status: form.status }]);
        toast.success(`${form.name} added successfully`);
      }
    } catch {
      const localMachine: Machine = {
        id: form.machineId.trim().toUpperCase(),
        name: form.name.trim(),
        machineType: form.machineType,
        status: form.status,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      };
      setMachines([...machines, localMachine]);
      toast.success(`${form.name} added (simulation mode)`);
    }
    closeDialog();
  };

  const handleUpdate = async () => {
    if (!editTarget || !form.name.trim()) return;
    try {
      await updateMachine.mutateAsync({
        id: editTarget.id,
        name: form.name.trim(),
        machineType: form.machineType,
        status: form.status,
      });
    } catch {
      /* ignore — update store regardless */
    }
    setMachines(
      machines.map((m) =>
        m.id === editTarget.id
          ? {
              ...m,
              name: form.name.trim(),
              machineType: form.machineType,
              status: form.status,
            }
          : m,
      ),
    );
    toast.success("Machine updated");
    closeDialog();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMachine.mutateAsync(deleteTarget.id);
    } catch {
      /* ignore — remove from store regardless */
    }
    setMachines(machines.filter((m) => m.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} removed`);
    setDeleteTarget(null);
  };

  const handleSensors = (machine: Machine) => {
    setSelectedMachine(machine.id);
    navigate({ to: "/sensors/$machineId", params: { machineId: machine.id } });
  };

  // ─── Stats ─────────────────────────────────────────────────────────────────

  const totalCount = machines.length;
  const runningCount = machines.filter((m) => m.status === "Running").length;
  const faultCount = machines.filter((m) => m.status === "Fault").length;

  const kpiChips = [
    { label: "Total", value: totalCount, color: "#00d4ff" },
    { label: "Running", value: runningCount, color: "#00ff88" },
    { label: "Faults", value: faultCount, color: "#ff4444" },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-5" data-ocid="machines.page">
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-xl text-foreground">
            Machine Registry
          </h1>
          {/* KPI Chips */}
          <div className="hidden sm:flex items-center gap-2">
            {kpiChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border"
                style={{
                  backgroundColor: `${chip.color}12`,
                  color: chip.color,
                  borderColor: `${chip.color}30`,
                }}
              >
                <span className="font-bold">{chip.value}</span>
                <span className="opacity-70 font-sans font-normal text-[10px]">
                  {chip.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        <Button
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-[#00d4ff] text-black hover:bg-[#00b8d9] flex-shrink-0"
          onClick={openAdd}
          data-ocid="machines.add_machine_button"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Machine
        </Button>
      </div>

      {/* Mobile KPI row */}
      <div className="sm:hidden grid grid-cols-3 gap-2">
        {kpiChips.map((chip) => (
          <div
            key={chip.label}
            className="flex flex-col items-center py-2.5 rounded-lg border"
            style={{
              backgroundColor: `${chip.color}08`,
              borderColor: `${chip.color}25`,
            }}
          >
            <span
              className="font-mono font-bold text-xl"
              style={{ color: chip.color }}
            >
              {chip.value}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
              {chip.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Table Header ── */}
      {machines.length > 0 && (
        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60">
          <div className="w-5 flex-shrink-0" />
          <div className="flex-1">Name</div>
          <div className="flex-shrink-0 w-28">Machine ID</div>
          <div className="hidden md:block flex-shrink-0 w-28">Type</div>
          <div className="flex-shrink-0 w-20">Status</div>
          <div className="flex-shrink-0 w-28 text-right pr-1">Actions</div>
        </div>
      )}

      {/* ── Machine List ── */}
      {machines.length === 0 ? (
        <div
          className="flex flex-col items-center gap-4 py-20 text-center"
          data-ocid="machines.empty_state"
        >
          <div
            className="p-4 rounded-full"
            style={{
              backgroundColor: "#00d4ff0a",
              border: "1px solid #00d4ff20",
            }}
          >
            <Factory className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-muted-foreground">
              No machines configured
            </p>
            <p className="text-xs text-muted-foreground/60">
              Click "+ Add Machine" to get started.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/50"
            onClick={openAdd}
            data-ocid="machines.empty_add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Machine
          </Button>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="machines.list">
          {machines.map((machine, i) => (
            <MachineRow
              key={machine.id}
              machine={machine}
              index={i + 1}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onSensors={handleSensors}
            />
          ))}
        </div>
      )}

      {/* ── Add Machine Dialog ── */}
      <MachineFormDialog
        open={showAdd}
        title="Add New Machine"
        form={form}
        isPending={addMachine.isPending}
        onFormChange={setForm}
        onSubmit={handleAdd}
        onClose={closeDialog}
        submitLabel="Add Machine"
      />

      {/* ── Edit Machine Dialog ── */}
      <MachineFormDialog
        open={!!editTarget}
        title="Edit Machine"
        form={form}
        isPending={updateMachine.isPending}
        onFormChange={setForm}
        onSubmit={handleUpdate}
        onClose={closeDialog}
        submitLabel="Save Changes"
      />

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="border-white/10 max-w-sm"
          style={{ backgroundColor: "#111118" }}
          data-ocid="machines.delete_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete {deleteTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This will permanently remove{" "}
              <span className="text-foreground font-medium">
                {deleteTarget?.name}
              </span>{" "}
              and all associated sensors and data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-white/20 text-muted-foreground hover:text-foreground"
              data-ocid="machines.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#ff4444] text-white hover:bg-[#cc3333] font-semibold"
              onClick={handleDelete}
              data-ocid="machines.delete_confirm_button"
            >
              Delete Machine
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
