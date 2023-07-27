import { create } from "zustand";

interface ITheme {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const theme = localStorage.getItem("theme");

export const useThemeStore = create<ITheme>((set) => ({
  theme: (theme as "light" | "dark") || "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setTheme: (theme: "light" | "dark") => set({ theme }),
}));
