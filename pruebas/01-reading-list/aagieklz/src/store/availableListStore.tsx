import { create } from "zustand";

interface IAvailableList {
  books: BookData[];
  addBook: (book: BookData) => void;
  removeBook: (book: BookData) => void;
  clearList: () => void;
  setBooks: (books: BookData[]) => void;
}

export const useAvailableList = create<IAvailableList>((set) => ({
  books: [],
  addBook: (book: BookData) =>
    set((state) => ({
      books: state.books.map((b) => b.ISBN).includes(book.ISBN)
        ? state.books
        : [...state.books, book],
    })),
  removeBook: (book: BookData) =>
    set((state) => ({
      books: state.books.filter((b) => b.ISBN !== book.ISBN),
    })),
  clearList: () => set({ books: [] }),
  setBooks: (books: BookData[]) => set({ books }),
}));
