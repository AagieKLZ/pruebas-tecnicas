import { RefreshCcw, Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import * as data from "../../books.json";
import { useZoneRef } from "../store/zoneRefStore";
import { useThemeStore } from "../store/themeStore";
import { useAvailableList } from "../store/availableListStore";
import { useReadingList } from "../store/readingListStore";
import { AnimatePresence, motion } from "framer-motion";
// import React from "react";

// type Props = {}

const categories = new Set(data.library.map((book) => book.book.genre));
const minPages = Math.min(...data.library.map((book) => book.book.pages));
const maxPages = Math.max(...data.library.map((book) => book.book.pages));

export default function Filters() {
  const [open, setOpen] = useState(false);
  const [genre, setGenre] = useState("");
  const [pages, setPages] = useState(maxPages);
  const { gridRef, zoneRef } = useZoneRef();
  const { theme } = useThemeStore();
  const { setBooks } = useAvailableList();
  const { books } = useReadingList();

  useEffect(() => {
    gridRef.current?.addEventListener("click", () => setOpen(false));
    zoneRef.current?.addEventListener("click", () => setOpen(false));
  }, [gridRef, zoneRef]);

  const updateBooks = (selectedGenre: string, numPages: number) => {
    if (selectedGenre === "Todos") {
      console.log("Todos");
      setBooks(
        data.library
          .map((books) => books.book)
          .filter((book) => {
            return (
              book.pages <= numPages &&
              !books.map((b) => b.ISBN).includes(book.ISBN)
            );
          })
      );
      return;
    }
    setBooks(
      data.library
        .map((books) => books.book)
        .filter((book) => {
          return (
            book.genre === selectedGenre &&
            book.pages <= numPages &&
            !books.map((b) => b.ISBN).includes(book.ISBN)
          );
        })
    );
  };

  return (
    <div className="relative h-fit">
      <button
        onClick={() => setOpen((i) => !i)}
        className="relative p-2 cursor-pointer"
      >
        <Sliders className="w-6 h-6" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`absolute p-6 rounded-lg pt-14 h-fit ${
              theme == "light" ? "bg-gray-50" : "bg-zinc-800"
            } right-6 w-80 top-16 drop-shadow-xl`}
          >
            <button
              className="absolute p-2 rounded-full top-6 right-6 bg-zinc-900"
              onClick={() => {
                updateBooks("Todos", maxPages);
                setGenre("Todos");
                setPages(maxPages);
              }}
            >
              <RefreshCcw className="w-5 h-5 stroke-2 stroke-white" />
            </button>
            <div className="flex flex-col gap-2">
              <label>Selecciona un género</label>
              <select
                className="p-2 text-black bg-gray-200 rounded-lg shadow-lg"
                value={genre}
                onChange={(e) => {
                  console.log(e.currentTarget.value);
                  setGenre(e.currentTarget.value);
                  updateBooks(e.currentTarget.value, pages);
                }}
              >
                <option
                  value={"Todos"}
                  className="flex flex-row justify-between w-full px-2"
                >
                  Todos
                </option>
                {Array.from(categories).map((genre, i) => (
                  <option
                    key={i}
                    value={genre}
                    className="flex flex-row justify-between w-full px-2"
                  >
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <div className="flex justify-between w-full">
                <label>Máximo de páginas</label>
                <div
                  className={`px-2 bg-gray-200 rounded-full ${
                    theme == "light" ? "text-black" : "text-black"
                  }`}
                >
                  {pages}
                </div>
              </div>
              <input
                type="range"
                className="w-full accent-black"
                value={pages}
                min={minPages}
                max={maxPages}
                onChange={(e) => {
                  setPages(e.currentTarget.valueAsNumber);
                  updateBooks(genre, e.currentTarget.valueAsNumber);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
