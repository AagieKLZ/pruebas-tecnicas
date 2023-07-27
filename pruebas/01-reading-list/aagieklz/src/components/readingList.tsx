import React from "react";
import { useReadingList } from "../store/readingListStore";
import ReadingBook from "./readingBook";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "../store/themeStore";

type Props = {
  dragZone: React.RefObject<HTMLDivElement>;
};

export default function ReadingList({ dragZone }: Props) {
  const { books } = useReadingList();
  const { theme } = useThemeStore();
  return (
    <motion.div
      ref={dragZone}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className={`fixed top-0 right-0 z-20 flex flex-col items-center w-1/4 h-screen gap-4 pt-28 pb-8 overflow-y-auto ${
        theme === "light"
          ? "bg-gray-50 text-black border-l border-l-white"
          : "bg-zinc-900 text-white border-l border-l-black"
      }}`}
    >
      <div className="text-2xl font-semibold">Tu Lista</div>
      <AnimatePresence>
        {books.length > 0 ? (
          books.map((book) => <ReadingBook key={book.ISBN} book={book} />)
        ) : (
          <div>Todavía no has añadido ningún libro</div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
