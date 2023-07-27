import Navbar from "./components/navbar";
import * as data from "../books.json";
import Book from "./components/book";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReadingList from "./components/readingList";
import { useAvailableList } from "./store/availableListStore";
import { useZoneRef } from "./store/zoneRefStore";
import { PanelRightOpen } from "lucide-react";
import { useReadingListModalStore } from "./store/readingListModalStore";
import { useThemeStore } from "./store/themeStore";
import { useReadingList } from "./store/readingListStore";

function App() {
  // const [books, setBooks] = useState<BookData[]>([]);
  const { books, setBooks } = useAvailableList();
  const { books: Readingbooks, setBooks: setReadingBooks } = useReadingList();
  const { setGridRef, setZoneRef } = useZoneRef();
  const dragZone = useRef<HTMLDivElement>(null);
  const gridZone = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const { modalOpen } = useReadingListModalStore();
  const [bodyRef, _] = useAnimate();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const books = JSON.parse(
      localStorage.getItem("readingList") || "[]"
    ) as BookData[];
    console.log(books);
    localStorage.getItem("readingList") && setReadingBooks(books);
    setBooks(
      data.library
        .map((book) => book.book)
        .filter((book) => !books.map((b) => b.ISBN).includes(book.ISBN))
    );
  }, [setReadingBooks, setBooks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (Readingbooks.length === 0) {
      return;
    }
    localStorage.setItem("readingList", JSON.stringify(Readingbooks));
  }, [Readingbooks]);

  useEffect(() => {
    setZoneRef(dragZone);
    setGridRef(gridZone);
  }, [dragZone, gridZone, setGridRef, setZoneRef]);

  useEffect(() => {
    if (modalOpen && gridZone.current) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      animate(gridZone.current, {
        width: "75%",
      });
    } else if (!modalOpen && gridZone.current) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      animate(gridZone.current, {
        width: "100%",
      });
    }
  }, [modalOpen]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    animate(bodyRef.current, {
      backgroundColor: theme === "light" ? "#fff" : "#18181b",
      color: theme === "light" ? "#000" : "#fff",
    });
  }, [theme, bodyRef, animate]);

  return (
    <>
      <Navbar scope={scope} />
      <div
        ref={bodyRef}
        className="flex items-start justify-start w-full min-h-screen pt-20 bg-zinc-800"
      >
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
          className={`${
            books.length > 0
              ? "grid w-full gap-6 p-8 bg-transparent opacity-100place-content-center place-items-center xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
              : "flex w-full h-[calc(100vh-5rem)] justify-center items-center"
          }`}
        >
          <AnimatePresence>
            {books.length == 0 ? (
              <div className="text-xl">No hay libros para mostrar</div>
            ) : (
              books
                .sort((a, b) => a.title.localeCompare(b.title))
                .filter((b) => !Readingbooks.includes(b))
                .map((book, i) => (
                  <Book book={book} index={i} key={book.ISBN} />
                ))
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {modalOpen && <ReadingList dragZone={dragZone} />}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
