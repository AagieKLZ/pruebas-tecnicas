import { create } from "zustand";

interface IDragging {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  toggleDragging: () => void;
}

export const useDraggingStore = create<IDragging>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  toggleDragging: () => set((state) => ({ isDragging: !state.isDragging })),
}));
