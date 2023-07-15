import Navbar from "./components/navbar";
import * as data from "../books.json";
import Book from "./components/book";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReadingList from "./components/readingList";
import { useAvailableList } from "./store/availableListStore";
import { useZoneRef } from "./store/zoneRefStore";

/**
 * TODO - Add Dragging State (Global)
 * TODO - Add Side Bar that shows when dragging but can be hidden as desired (Global)
 * TODO - Add Side Bar Component - Shows "no items" when empty and shows book component when not empty as scrollable cards
 * TODO - Theme (Dark Mode) - https://toggles.dev/
 * TODO - Side Bar Card Scroll
 * TODO - Fix grid layout
 * TODO - Scrapping
 * TODO - Add Search
 * TODO - Add Filter
 * TODO - Add Sort
 *
 *
 */

function App() {
  // const [books, setBooks] = useState<BookData[]>([]);
  const { books, setBooks } = useAvailableList();
  const { zoneRef, gridRef, setGridRef, setZoneRef } = useZoneRef();
  const dragZone = useRef<HTMLDivElement>(null);
  const gridZone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBooks(data.library.map((book) => book.book));
  }, []);

  useEffect(() => {
    setZoneRef(dragZone);
    setGridRef(gridZone);
  }, [dragZone, gridZone]);

  return (
    <>
      <Navbar />
      <div className="relative z-40 flex items-start justify-start w-full min-h-screen pt-6">
        <AnimatePresence>
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            ref={gridZone}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 1,
            }}
            className="grid w-3/4 grid-flow-col-dense gap-6 p-8 bg-transparent opacity-100 max-w-3/4"
          >
            {books
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((book, i) => (
                <Book book={book} index={i} key={book.ISBN} />
              ))}
          </motion.div>
        </AnimatePresence>
        <ReadingList dragZone={dragZone} />
      </div>
    </>
  );
}

export default App;
