import React from "react";
import { create } from "zustand";

interface IZoneRef {
  zoneRef: React.RefObject<HTMLDivElement>;
  gridRef: React.RefObject<HTMLDivElement>;
  setZoneRef: (zoneRef: React.RefObject<HTMLDivElement>) => void;
  setGridRef: (gridRef: React.RefObject<HTMLDivElement>) => void;
}

export const useZoneRef = create<IZoneRef>((set) => ({
  zoneRef: React.createRef<HTMLDivElement>(),
  gridRef: React.createRef<HTMLDivElement>(),
  setZoneRef: (zoneRef: React.RefObject<HTMLDivElement>) => set({ zoneRef }),
  setGridRef: (gridRef: React.RefObject<HTMLDivElement>) => set({ gridRef }),
}));
