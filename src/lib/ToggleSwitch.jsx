import { Sun, Moon } from "lucide-react";
import { useState } from "react";
import { themeColors } from '../styles/themeColors.js';

/**
 * ToggleSwitch
 * props:
 *   checked   : boolean   – status saklar
 *   onChange  : function  – callback ketika saklar digeser
 *   label     : string    – (opsional) teks untuk screen reader
 */
export default function ToggleSwitch({ checked, onChange, label = "Ganti Mode" }) {
  // Local fallback kalau parent tidak kirim state (uncontrolled mode)
  const [internal, setInternal] = useState(false);
  const isControlled = typeof checked === "boolean";
  const isOn = isControlled ? checked : internal;

  function handleToggle(e) {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e.target.checked);
  }

  return (
    <label className="relative inline-flex items-center w-28 h-8 cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isOn}
        onChange={handleToggle}
        aria-label={label}
      />

      {/* Track */}
      <div
        className="block w-full h-full rounded-full bg-themeColors-light-secondary border-2 border-themeColors-light-primary peer-checked:bg-themeColors-dark-boxColumn-default peer-checked:border-themeColors-dark-border transition-colors duration-300"
      />

      {/* Knob */}
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full transition-transform duration-300 peer-checked:translate-x-[80px] ${isOn ? "bg-gray-200" : "bg-themeColors-light-card"}`}
      />

      {/* Ikon kiri: Sun (Light Mode) */}
      <Sun
        className={`absolute left-1 w-6 h-6 text-yellow-500 transition-opacity duration-300 ${isOn ? "opacity-0" : "opacity-100"}`}
      />

      {/* Ikon kanan: Moon (Dark Mode) */}
      <Moon
        className={`absolute right-1 w-6 h-6 transition-opacity duration-300 ${isOn ? "opacity-100 text-gray-800" : "opacity-0"}`}
      />

      {/* Teks Light Mode */}
      <span
        className={`absolute left-9 text-[11px] font-bold text-themeColors-light-text-default transition-opacity duration-300 ${isOn ? "opacity-0" : "opacity-100"}`}
      >
        Day Mode
      </span>

      {/* Teks Dark Mode */}
      <span
        className={`absolute right-9 text-[11px] font-bold transition-opacity duration-300 ${isOn ? "opacity-100 text-white" : "opacity-0"}`}
      >
        Night Mode
      </span>
    </label>
  );
}
