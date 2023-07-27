import { create } from "zustand";

interface IReadingListModal {
  modalOpen: boolean;
  toggleModal: () => void;
  setModalOpen: (modalOpen: boolean) => void;
}

export const useReadingListModalStore = create<IReadingListModal>((set) => ({
  modalOpen: false,
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
  setModalOpen: (modalOpen: boolean) => set({ modalOpen }),
}));
