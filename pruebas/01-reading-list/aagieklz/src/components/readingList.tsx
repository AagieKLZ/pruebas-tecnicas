import React from "react";
import { useReadingList } from "../store/readingListStore";
import ReadingBook from "./readingBook";
import { AnimatePresence } from "framer-motion";

type Props = {
  dragZone: React.RefObject<HTMLDivElement>;
};

export default function ReadingList({ dragZone }: Props) {
  const { books } = useReadingList();
  return (
    <div
      ref={dragZone}
      className="fixed top-0 right-0 z-20 flex flex-col items-center w-1/4 h-screen gap-4 py-8 overflow-y-auto border-l bg-gray-50"
    >
      <AnimatePresence>
        {books.map((book) => (
          <ReadingBook key={book.ISBN} book={book} />
        ))}
      </AnimatePresence>
    </div>
  );
}
