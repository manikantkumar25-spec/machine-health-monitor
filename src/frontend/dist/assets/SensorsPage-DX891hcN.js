import { r as reactExports, m as useComposedRefs, j as jsxRuntimeExports, n as Primitive, p as composeEventHandlers, q as createContextScope, s as cn, t as useParams, u as useMachineStore, v as useAddSensor, w as useUpdateSensor, x as useDeleteSensor, T as TriangleAlert, L as Link, C as ChevronRight, B as Badge, l as Button, P as Plus, A as Activity, y as useSetAlertThreshold } from "./index-DlaMAZ3N.js";
import { L as Label, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, P as Pen } from "./label-DpgdIZyj.js";
import { C as Card } from "./card-CsCFZSSd.js";
import { e as useControllableState, f as usePrevious, g as useSize, u as ue, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, d as DialogFooter, T as Trash2, C as Check } from "./index-DkTwamNF.js";
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const EMPTY_FORM = {
  sensorName: "",
  unit: "",
  refreshInterval: "3",
  warnLevel: "",
  criticalLevel: "",
  enabled: true
};
function statusColor(status) {
  if (status === "Running") return "#00d4ff";
  if (status === "Fault") return "#ff4444";
  return "#ffd700";
}
function InlineThresholdRow({
  sensor,
  threshold,
  index,
  machineId
}) {
  const { thresholds, setThresholds } = useMachineStore();
  const setThreshold = useSetAlertThreshold();
  const [warnVal, setWarnVal] = reactExports.useState(
    threshold ? String(threshold.warnLevel) : ""
  );
  const [critVal, setCritVal] = reactExports.useState(
    threshold ? String(threshold.criticalLevel) : ""
  );
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setWarnVal(threshold ? String(threshold.warnLevel) : "");
    setCritVal(threshold ? String(threshold.criticalLevel) : "");
  }, [threshold]);
  const flashSaved = reactExports.useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);
  const handleSave = reactExports.useCallback(async () => {
    const warn = Number.parseFloat(warnVal);
    const crit = Number.parseFloat(critVal);
    if (Number.isNaN(warn) || Number.isNaN(crit)) {
      ue.error("Enter valid numbers for thresholds");
      return;
    }
    const existing = thresholds.find((t) => t.sensorId === sensor.id);
    if (existing) {
      setThresholds(
        thresholds.map(
          (t) => t.sensorId === sensor.id ? { ...t, warnLevel: warn, criticalLevel: crit } : t
        )
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
          criticalLevel: crit
        }
      ]);
    }
    flashSaved();
    try {
      const result = await setThreshold.mutateAsync({
        machineId,
        sensorId: sensor.id,
        sensorName: sensor.sensorName,
        warnLevel: warn,
        criticalLevel: crit
      });
      if (result) {
        const isThere = thresholds.find((t) => t.sensorId === sensor.id);
        if (isThere) {
          setThresholds(
            thresholds.map(
              (t) => t.sensorId === sensor.id ? result : t
            )
          );
        } else {
          setThresholds([...thresholds, result]);
        }
      }
    } catch {
    }
  }, [
    warnVal,
    critVal,
    sensor,
    machineId,
    thresholds,
    setThresholds,
    setThreshold,
    flashSaved
  ]);
  const handleBlur = reactExports.useCallback(() => {
    const warn = Number.parseFloat(warnVal);
    const crit = Number.parseFloat(critVal);
    if (!Number.isNaN(warn) && !Number.isNaN(crit) && warnVal && critVal) {
      handleSave();
    }
  }, [warnVal, critVal, handleSave]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", style: { color: "#ffd700" }, children: "WARN ≥" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          value: warnVal,
          onChange: (e) => setWarnVal(e.target.value),
          onBlur: handleBlur,
          placeholder: "—",
          className: "h-7 w-20 text-xs font-mono border-[#ffd700]/30 bg-white/5 px-2",
          "data-ocid": `sensors.warn_input.${index}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", style: { color: "#ff4444" }, children: "CRIT ≥" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          value: critVal,
          onChange: (e) => setCritVal(e.target.value),
          onBlur: handleBlur,
          placeholder: "—",
          className: "h-7 w-20 text-xs font-mono border-[#ff4444]/30 bg-white/5 px-2",
          "data-ocid": `sensors.crit_input.${index}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "sm",
        variant: "ghost",
        onClick: handleSave,
        className: `h-7 px-2 text-xs transition-colors duration-200 ${saved ? "text-[#00ff88] bg-[#00ff88]/10" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": `sensors.save_threshold_button.${index}`,
        children: saved ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) : "Save"
      }
    )
  ] });
}
function SensorCard({
  sensor,
  threshold,
  index,
  machineId,
  machineName,
  liveValue,
  onEdit,
  onDelete
}) {
  const { sensors, setSensors } = useMachineStore();
  const updateSensor = useUpdateSensor();
  const handleToggle = reactExports.useCallback(
    async (enabled) => {
      setSensors(
        sensors.map((s) => s.id === sensor.id ? { ...s, enabled } : s)
      );
      try {
        await updateSensor.mutateAsync({
          id: sensor.id,
          sensorName: sensor.sensorName,
          unit: sensor.unit,
          refreshInterval: sensor.refreshInterval,
          enabled
        });
      } catch {
      }
    },
    [sensor, sensors, setSensors, updateSensor]
  );
  const valueColor = (liveValue == null ? void 0 : liveValue.status) === "Critical" ? "#ff4444" : (liveValue == null ? void 0 : liveValue.status) === "Warning" ? "#ffd700" : "#00d4ff";
  const refreshSec = Number(sensor.refreshInterval) >= 1e3 ? (Number(sensor.refreshInterval) / 1e3).toFixed(0) : String(Number(sensor.refreshInterval));
  const refreshUnit = Number(sensor.refreshInterval) >= 1e3 ? "s" : "ms";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: `border border-white/10 rounded-lg p-4 flex flex-col gap-3 transition-opacity duration-300 ${sensor.enabled ? "opacity-100" : "opacity-50"}`,
      style: { backgroundColor: "#111118" },
      "data-ocid": `sensors.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 shrink-0", style: { color: "#00d4ff" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base text-foreground leading-tight truncate", children: sensor.sensorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[11px] font-mono px-1.5 py-0.5 rounded border",
                  style: {
                    color: "#00d4ff",
                    borderColor: "#00d4ff30",
                    backgroundColor: "#00d4ff0a"
                  },
                  children: sensor.unit || "—"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: sensor.enabled,
              onCheckedChange: handleToggle,
              className: "shrink-0 mt-0.5",
              "aria-label": `${sensor.enabled ? "Disable" : "Enable"} ${sensor.sensorName}`,
              "data-ocid": `sensors.toggle.${index}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Refresh:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground/70", children: [
              refreshSec,
              refreshUnit
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px] text-[10px]", children: sensor.id })
        ] }),
        liveValue && sensor.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-2.5 py-1.5 rounded border border-white/5",
            style: { backgroundColor: "#0a0a0f" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono font-bold text-lg leading-none",
                  style: { color: valueColor },
                  children: liveValue.value.toFixed(
                    sensor.sensorName.toLowerCase().includes("vib") ? 2 : 1
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: liveValue.unit || sensor.unit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-auto text-[10px] font-bold tracking-wide",
                  style: { color: valueColor },
                  children: liveValue.status.toUpperCase()
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InlineThresholdRow,
          {
            sensor,
            threshold,
            index,
            machineId
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: machineName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-white/10",
                onClick: () => onEdit(sensor),
                "aria-label": `Edit ${sensor.sensorName}`,
                "data-ocid": `sensors.edit_button.${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 w-7 p-0 text-muted-foreground hover:text-[#ff4444] hover:bg-[#ff4444]/10",
                onClick: () => onDelete(sensor),
                "aria-label": `Delete ${sensor.sensorName}`,
                "data-ocid": `sensors.delete_button.${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function SensorsPage() {
  const { machineId } = useParams({ strict: false });
  const {
    machines,
    sensors,
    thresholds,
    liveReadings,
    setSensors,
    setThresholds
  } = useMachineStore();
  const machine = machines.find((m) => m.id === machineId);
  const machineSensors = sensors.filter((s) => s.machineId === machineId);
  const machineThresholds = thresholds.filter((t) => t.machineId === machineId);
  const addSensorMutation = useAddSensor();
  const updateSensorMutation = useUpdateSensor();
  const deleteSensorMutation = useDeleteSensor();
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const sensorsRef = reactExports.useRef(sensors);
  const thresholdsRef = reactExports.useRef(thresholds);
  reactExports.useEffect(() => {
    sensorsRef.current = sensors;
  }, [sensors]);
  reactExports.useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);
  const handleOpenAdd = reactExports.useCallback(() => {
    setForm(EMPTY_FORM);
    setShowAdd(true);
  }, []);
  const handleOpenEdit = reactExports.useCallback((s) => {
    const existingThreshold = thresholdsRef.current.find(
      (t) => t.sensorId === s.id
    );
    setForm({
      sensorName: s.sensorName,
      unit: s.unit,
      refreshInterval: String(
        Number(s.refreshInterval) >= 1e3 ? Number(s.refreshInterval) / 1e3 : Number(s.refreshInterval)
      ),
      warnLevel: existingThreshold ? String(existingThreshold.warnLevel) : "",
      criticalLevel: existingThreshold ? String(existingThreshold.criticalLevel) : "",
      enabled: s.enabled
    });
    setEditTarget(s);
  }, []);
  const handleCloseDialog = reactExports.useCallback(() => {
    setShowAdd(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }, []);
  const formIntervalMs = reactExports.useCallback((val) => {
    const n = Number(val) || 3;
    return n <= 60 ? BigInt(n * 1e3) : BigInt(n);
  }, []);
  const handleAddSensor = reactExports.useCallback(async () => {
    if (!form.sensorName.trim() || !machineId) return;
    const intervalMs = formIntervalMs(form.refreshInterval);
    try {
      const result = await addSensorMutation.mutateAsync({
        machineId,
        sensorName: form.sensorName.trim(),
        unit: form.unit.trim(),
        refreshInterval: intervalMs
      });
      if (result) {
        const newSensor = result;
        setSensors([...sensorsRef.current, newSensor]);
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
              criticalLevel: crit
            }
          ]);
        }
        ue.success(`${form.sensorName} added`);
      }
    } catch {
      const local = {
        id: `local-${Date.now()}`,
        machineId,
        sensorName: form.sensorName.trim(),
        unit: form.unit.trim(),
        refreshInterval: intervalMs,
        enabled: form.enabled,
        createdAt: BigInt(Date.now()) * 1000000n
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
            criticalLevel: crit
          }
        ]);
      }
      ue.success(`${form.sensorName} added (local)`);
    }
    handleCloseDialog();
  }, [
    form,
    machineId,
    addSensorMutation,
    setSensors,
    setThresholds,
    formIntervalMs,
    handleCloseDialog
  ]);
  const handleUpdateSensor = reactExports.useCallback(async () => {
    if (!editTarget) return;
    const intervalMs = formIntervalMs(form.refreshInterval);
    const updated = {
      ...editTarget,
      sensorName: form.sensorName.trim(),
      unit: form.unit.trim(),
      refreshInterval: intervalMs,
      enabled: form.enabled
    };
    setSensors(
      sensorsRef.current.map((s) => s.id === editTarget.id ? updated : s)
    );
    try {
      await updateSensorMutation.mutateAsync({
        id: editTarget.id,
        sensorName: updated.sensorName,
        unit: updated.unit,
        refreshInterval: updated.refreshInterval,
        enabled: updated.enabled
      });
    } catch {
    }
    ue.success("Sensor updated");
    handleCloseDialog();
  }, [
    editTarget,
    form,
    setSensors,
    updateSensorMutation,
    formIntervalMs,
    handleCloseDialog
  ]);
  const handleDeleteSensor = reactExports.useCallback(async () => {
    if (!deleteTarget) return;
    setSensors(sensorsRef.current.filter((s) => s.id !== deleteTarget.id));
    setThresholds(
      thresholdsRef.current.filter((t) => t.sensorId !== deleteTarget.id)
    );
    setDeleteTarget(null);
    ue.success(`${deleteTarget.sensorName} removed`);
    try {
      await deleteSensorMutation.mutateAsync(deleteTarget.id);
    } catch {
    }
  }, [deleteTarget, setSensors, setThresholds, deleteSensorMutation]);
  if (!machine) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 py-20",
        "data-ocid": "sensors.not_found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Machine not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-xs text-[#00d4ff] hover:underline", children: "Back to Dashboard" })
        ]
      }
    );
  }
  const machineStatusColor = statusColor(machine.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-5", "data-ocid": "sensors.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
        "aria-label": "Breadcrumb",
        "data-ocid": "sensors.breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              className: "hover:text-foreground transition-colors",
              "data-ocid": "sensors.breadcrumb_dashboard_link",
              children: "Dashboard"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/machines",
              className: "hover:text-foreground transition-colors",
              "data-ocid": "sensors.breadcrumb_machines_link",
              children: machine.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: "Sensors" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-xl text-foreground leading-tight", children: [
            machine.name,
            " — Sensor Configuration"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-[10px] px-2 py-0.5 font-mono border",
              style: {
                color: machineStatusColor,
                borderColor: `${machineStatusColor}40`,
                backgroundColor: `${machineStatusColor}12`
              },
              "data-ocid": "sensors.machine_status_badge",
              children: machine.status.toUpperCase()
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          machineSensors.length,
          " sensor",
          machineSensors.length !== 1 ? "s" : "",
          " · ",
          machine.machineType
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-1.5 text-xs border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10",
          onClick: handleOpenAdd,
          "data-ocid": "sensors.add_sensor_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            "Add Sensor"
          ]
        }
      )
    ] }),
    machineSensors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-20 text-center",
        "data-ocid": "sensors.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-full flex items-center justify-center",
              style: {
                backgroundColor: "#00d4ff10",
                border: "1px solid #00d4ff30"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6", style: { color: "#00d4ff" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No sensors configured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Add sensors to start monitoring this machine's health and production." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5 border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10",
              onClick: handleOpenAdd,
              "data-ocid": "sensors.empty_add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                "Add first sensor"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3",
        "data-ocid": "sensors.list",
        children: machineSensors.map((sensor, i) => {
          const key = `${machineId}-${sensor.sensorName}`;
          const live = liveReadings[key];
          const threshold = machineThresholds.find(
            (t) => t.sensorId === sensor.id
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            SensorCard,
            {
              sensor,
              threshold,
              index: i + 1,
              machineId,
              machineName: machine.name,
              liveValue: live,
              onEdit: handleOpenEdit,
              onDelete: setDeleteTarget
            },
            sensor.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showAdd || !!editTarget,
        onOpenChange: (open) => {
          if (!open) handleCloseDialog();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "border-white/10",
            style: { backgroundColor: "#111118" },
            "data-ocid": "sensors.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: editTarget ? `Edit Sensor — ${editTarget.sensorName}` : `Add Sensor to ${machine.name}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                    "Sensor Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#ff4444]", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. Temperature",
                      value: form.sensorName,
                      onChange: (e) => setForm({ ...form, sensorName: e.target.value }),
                      className: "border-white/20 bg-white/5",
                      "data-ocid": "sensors.name_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. °C, mm/s, %, RPM, kg",
                      value: form.unit,
                      onChange: (e) => setForm({ ...form, unit: e.target.value }),
                      className: "border-white/20 bg-white/5",
                      "data-ocid": "sensors.unit_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Refresh Interval (seconds, 1–60)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 1,
                      max: 60,
                      placeholder: "3",
                      value: form.refreshInterval,
                      onChange: (e) => setForm({ ...form, refreshInterval: e.target.value }),
                      className: "border-white/20 bg-white/5",
                      "data-ocid": "sensors.interval_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", style: { color: "#ffd700" }, children: "Warning Threshold (optional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        placeholder: "e.g. 70",
                        value: form.warnLevel,
                        onChange: (e) => setForm({ ...form, warnLevel: e.target.value }),
                        className: "border-[#ffd700]/30 bg-white/5",
                        "data-ocid": "sensors.warn_level_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", style: { color: "#ff4444" }, children: "Critical Threshold (optional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        placeholder: "e.g. 85",
                        value: form.criticalLevel,
                        onChange: (e) => setForm({ ...form, criticalLevel: e.target.value }),
                        className: "border-[#ff4444]/30 bg-white/5",
                        "data-ocid": "sensors.critical_level_input"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-foreground", children: "Enable Sensor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Disabled sensors do not generate simulated data" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: form.enabled,
                      onCheckedChange: (v) => setForm({ ...form, enabled: v }),
                      "data-ocid": "sensors.enabled_switch"
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
                    onClick: handleCloseDialog,
                    "data-ocid": "sensors.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "bg-[#00d4ff] text-black hover:bg-[#00d4ff]/80 font-semibold",
                    onClick: editTarget ? handleUpdateSensor : handleAddSensor,
                    disabled: !form.sensorName.trim(),
                    "data-ocid": "sensors.submit_button",
                    children: editTarget ? "Save Changes" : "Add Sensor"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => {
          if (!open) setDeleteTarget(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "border-white/10",
            style: { backgroundColor: "#111118" },
            "data-ocid": "sensors.delete_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
                  "Delete ",
                  deleteTarget == null ? void 0 : deleteTarget.sensorName,
                  "?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground text-sm", children: [
                  "This will permanently remove",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: deleteTarget == null ? void 0 : deleteTarget.sensorName }),
                  " ",
                  "from",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: machine.name }),
                  " ",
                  "and delete all associated thresholds and historical data."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-white/20",
                    "data-ocid": "sensors.delete_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-[#ff4444] text-white hover:bg-[#ff4444]/80",
                    onClick: handleDeleteSensor,
                    "data-ocid": "sensors.delete_confirm_button",
                    children: "Delete Sensor"
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
  SensorsPage as default
};
