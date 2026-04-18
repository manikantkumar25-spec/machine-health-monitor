import { c as createLucideIcon, u as useMachineStore, e as useNavigate, f as useAddMachine, h as useUpdateMachine, k as useDeleteMachine, r as reactExports, j as jsxRuntimeExports, l as Button, P as Plus, B as Badge } from "./index-DlaMAZ3N.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, P as Pen, L as Label } from "./label-DpgdIZyj.js";
import { u as ue, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, d as DialogFooter } from "./index-DkTwamNF.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-PD3JDCYT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  [
    "path",
    {
      d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
      key: "1iv0i2"
    }
  ],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const Factory = createLucideIcon("factory", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
const MACHINE_TYPES = [
  "CNC",
  "Assembly",
  "Welding",
  "Painting",
  "Quality Control",
  "Other"
];
const STATUSES = ["Running", "Idle", "Fault"];
function statusDotConfig(status) {
  if (status === "Running") return { color: "#00ff88", pulse: true };
  if (status === "Fault") return { color: "#ff4444", pulse: false };
  return { color: "#ffd700", pulse: false };
}
function statusBadgeStyle(status) {
  if (status === "Running")
    return { backgroundColor: "#00ff8820", color: "#00ff88" };
  if (status === "Fault")
    return { backgroundColor: "#ff444420", color: "#ff4444" };
  return { backgroundColor: "#ffd70020", color: "#ffd700" };
}
function MachineRow({
  machine,
  index,
  onEdit,
  onDelete,
  onSensors
}) {
  const dot = statusDotConfig(machine.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 transition-colors hover:border-white/20",
      style: { backgroundColor: "#111118" },
      "data-ocid": `machines.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 flex items-center justify-center w-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `h-2.5 w-2.5 rounded-full${dot.pulse ? " animate-pulse" : ""}`,
            style: {
              backgroundColor: dot.color,
              boxShadow: `0 0 6px ${dot.color}80`
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: machine.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block flex-shrink-0 w-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-[11px] font-mono text-muted-foreground truncate",
            title: machine.id,
            children: [
              machine.id.slice(0, 10),
              "…"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "text-[10px] px-2 py-0.5 border font-medium",
            style: {
              backgroundColor: "#00d4ff10",
              color: "#00d4ff",
              borderColor: "#00d4ff30"
            },
            children: machine.machineType
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "text-[10px] px-2 py-0.5 border-0 font-medium",
            style: statusBadgeStyle(machine.status),
            children: machine.status
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2 text-[11px] gap-1 text-[#00d4ff] hover:bg-[#00d4ff]/10",
              onClick: () => onSensors(machine),
              "data-ocid": `machines.sensors_button.${index}`,
              "aria-label": `Configure sensors for ${machine.name}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline", children: "Sensors" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-white/5",
              onClick: () => onEdit(machine),
              "data-ocid": `machines.edit_button.${index}`,
              "aria-label": `Edit ${machine.name}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0 text-muted-foreground hover:text-[#ff4444] hover:bg-[#ff4444]/10",
              onClick: () => onDelete(machine),
              "data-ocid": `machines.delete_button.${index}`,
              "aria-label": `Delete ${machine.name}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
const EMPTY_FORM = {
  name: "",
  machineId: "",
  machineType: "CNC",
  status: "Running"
};
function MachineFormDialog({
  open,
  title,
  form,
  isPending,
  onFormChange,
  onSubmit,
  onClose,
  submitLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "border-white/10 max-w-md",
      style: { backgroundColor: "#111118" },
      "data-ocid": "machines.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
              "Machine Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#ff4444]", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. CNC-01",
                value: form.name,
                onChange: (e) => onFormChange({ ...form, name: e.target.value }),
                className: "border-white/20 bg-white/5 text-sm",
                "data-ocid": "machines.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
              "Machine ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#ff4444]", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. CNC-001",
                value: form.machineId,
                onChange: (e) => onFormChange({ ...form, machineId: e.target.value }),
                className: "border-white/20 bg-white/5 text-sm font-mono",
                "data-ocid": "machines.id_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Machine Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.machineType,
                onValueChange: (v) => onFormChange({ ...form, machineType: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "border-white/20 bg-white/5 text-sm",
                      "data-ocid": "machines.type_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { style: { backgroundColor: "#1a1a2e" }, children: MACHINE_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Initial Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.status,
                onValueChange: (v) => onFormChange({ ...form, status: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "border-white/20 bg-white/5 text-sm",
                      "data-ocid": "machines.status_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { style: { backgroundColor: "#1a1a2e" }, children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              "data-ocid": "machines.cancel_button",
              className: "text-muted-foreground hover:text-foreground",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "bg-[#00d4ff] text-black hover:bg-[#00b8d9] font-semibold",
              onClick: onSubmit,
              disabled: !form.name.trim() || !form.machineId.trim() || isPending,
              "data-ocid": "machines.submit_button",
              children: submitLabel
            }
          )
        ] })
      ]
    }
  ) });
}
function MachinesPage() {
  const { machines, setMachines, setSelectedMachine } = useMachineStore();
  const navigate = useNavigate();
  const addMachine = useAddMachine();
  const updateMachine = useUpdateMachine();
  const deleteMachine = useDeleteMachine();
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowAdd(true);
  };
  const openEdit = (m) => {
    setForm({
      name: m.name,
      machineId: m.id.slice(0, 12),
      machineType: m.machineType,
      status: m.status
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
        status: form.status
      });
      if (result) {
        setMachines([...machines, { ...result, status: form.status }]);
        ue.success(`${form.name} added successfully`);
      }
    } catch {
      const localMachine = {
        id: form.machineId.trim().toUpperCase(),
        name: form.name.trim(),
        machineType: form.machineType,
        status: form.status,
        createdAt: BigInt(Date.now()) * 1000000n
      };
      setMachines([...machines, localMachine]);
      ue.success(`${form.name} added (simulation mode)`);
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
        status: form.status
      });
    } catch {
    }
    setMachines(
      machines.map(
        (m) => m.id === editTarget.id ? {
          ...m,
          name: form.name.trim(),
          machineType: form.machineType,
          status: form.status
        } : m
      )
    );
    ue.success("Machine updated");
    closeDialog();
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMachine.mutateAsync(deleteTarget.id);
    } catch {
    }
    setMachines(machines.filter((m) => m.id !== deleteTarget.id));
    ue.success(`${deleteTarget.name} removed`);
    setDeleteTarget(null);
  };
  const handleSensors = (machine) => {
    setSelectedMachine(machine.id);
    navigate({ to: "/sensors/$machineId", params: { machineId: machine.id } });
  };
  const totalCount = machines.length;
  const runningCount = machines.filter((m) => m.status === "Running").length;
  const faultCount = machines.filter((m) => m.status === "Fault").length;
  const kpiChips = [
    { label: "Total", value: totalCount, color: "#00d4ff" },
    { label: "Running", value: runningCount, color: "#00ff88" },
    { label: "Faults", value: faultCount, color: "#ff4444" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-5", "data-ocid": "machines.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground", children: "Machine Registry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex items-center gap-2", children: kpiChips.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border",
            style: {
              backgroundColor: `${chip.color}12`,
              color: chip.color,
              borderColor: `${chip.color}30`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: chip.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70 font-sans font-normal text-[10px]", children: chip.label })
            ]
          },
          chip.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 text-xs font-semibold bg-[#00d4ff] text-black hover:bg-[#00b8d9] flex-shrink-0",
          onClick: openAdd,
          "data-ocid": "machines.add_machine_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            "Add Machine"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden grid grid-cols-3 gap-2", children: kpiChips.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-2.5 rounded-lg border",
        style: {
          backgroundColor: `${chip.color}08`,
          borderColor: `${chip.color}25`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono font-bold text-xl",
              style: { color: chip.color },
              children: chip.value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5", children: chip.label })
        ]
      },
      chip.label
    )) }),
    machines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 px-4 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-28", children: "Machine ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block flex-shrink-0 w-28", children: "Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-20", children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-28 text-right pr-1", children: "Actions" })
    ] }),
    machines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-20 text-center",
        "data-ocid": "machines.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-4 rounded-full",
              style: {
                backgroundColor: "#00d4ff0a",
                border: "1px solid #00d4ff20"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Factory, { className: "h-10 w-10 text-muted-foreground/40" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "No machines configured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: 'Click "+ Add Machine" to get started.' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5 border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/50",
              onClick: openAdd,
              "data-ocid": "machines.empty_add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                "Add Machine"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "machines.list", children: machines.map((machine, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MachineRow,
      {
        machine,
        index: i + 1,
        onEdit: openEdit,
        onDelete: setDeleteTarget,
        onSensors: handleSensors
      },
      machine.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MachineFormDialog,
      {
        open: showAdd,
        title: "Add New Machine",
        form,
        isPending: addMachine.isPending,
        onFormChange: setForm,
        onSubmit: handleAdd,
        onClose: closeDialog,
        submitLabel: "Add Machine"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MachineFormDialog,
      {
        open: !!editTarget,
        title: "Edit Machine",
        form,
        isPending: updateMachine.isPending,
        onFormChange: setForm,
        onSubmit: handleUpdate,
        onClose: closeDialog,
        submitLabel: "Save Changes"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "border-white/10 max-w-sm",
            style: { backgroundColor: "#111118" },
            "data-ocid": "machines.delete_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "text-foreground", children: [
                  "Delete ",
                  deleteTarget == null ? void 0 : deleteTarget.name,
                  "?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground text-sm", children: [
                  "This will permanently remove",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: deleteTarget == null ? void 0 : deleteTarget.name }),
                  " ",
                  "and all associated sensors and data. This action cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-white/20 text-muted-foreground hover:text-foreground",
                    "data-ocid": "machines.delete_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-[#ff4444] text-white hover:bg-[#cc3333] font-semibold",
                    onClick: handleDelete,
                    "data-ocid": "machines.delete_confirm_button",
                    children: "Delete Machine"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  MachinesPage as default
};
