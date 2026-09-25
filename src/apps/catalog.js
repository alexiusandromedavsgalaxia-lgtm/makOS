import React from "react";
import {
  Folder,
  Globe,
  Terminal as TerminalIcon,
  Settings,
  CalendarDays,
  StickyNote,
  Calculator,
  Music2,
  Image as ImageIcon,
  Monitor,
  Wrench
} from "lucide-react";

export const APPS = {
  Finder: [Folder, "linear-gradient(135deg,#70b9ff,#2f72e8)"],
  Safari: [Globe, "linear-gradient(135deg,#67d5ff,#3574ff)"],
  Terminal: [TerminalIcon, "linear-gradient(135deg,#242833,#080a0f)"],
  Settings: [Settings, "linear-gradient(135deg,#8b95a8,#454d5e)"],
  Calendar: [CalendarDays, "linear-gradient(135deg,#fff,#ff5364)"],
  Notes: [StickyNote, "linear-gradient(135deg,#fff36a,#ffc400)"],
  Calculator: [Calculator, "linear-gradient(135deg,#5d6471,#222630)"],
  Music: [Music2, "linear-gradient(135deg,#ff7cbd,#9b37f2)"],
  Photos: [ImageIcon, "linear-gradient(135deg,#ffbf5f,#ef4e8a,#684cff)"],
  Downloads: [Folder, "linear-gradient(135deg,#8ed2ff,#2572d9)"],
  System: [Monitor, "linear-gradient(135deg,#6b7280,#1f2937)"],
  PartsService: [Wrench, "linear-gradient(135deg,#6fa8ff,#6b55d9)"]
};

export function Icon({ name, size = 24 }) {
  const [C, bg] = APPS[name] || APPS.Finder;
  return React.createElement(
    "span",
    { className: "appIcon", style: { background: bg } },
    React.createElement(C, { size })
  );
}
