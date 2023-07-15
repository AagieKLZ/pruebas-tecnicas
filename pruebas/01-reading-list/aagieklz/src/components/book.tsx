import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useReadingList } from "../store/readingListStore";
import { useAvailableList } from "../store/availableListStore";
import { useZoneRef } from "../store/zoneRefStore";
import ReadingBook from "./readingBook";

type Props = {
  book: BookData;
  index: number;
};

export default function Book({ book, index }: Props) {
  const { zoneRef: zone, gridRef: grid } = useZoneRef();
  const [scope, animate] = useAnimate();
  const [inverted, setInverted] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const { addBook, removeBook } = useReadingList();
  const { addBook: addAvailableBook, removeBook: rmAvailableBook } =
    useAvailableList();

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      onDragEnd={(e) => {
        const parent = bookRef.current?.parentElement;
        const rect = (
          parent == zone.current ? grid : zone
        ).current?.getBoundingClientRect();

        if (rect) {
          const { x, y } = rect;
          const { clientX, clientY } = e as PointerEvent;
          if (clientX > x && clientX < x + rect.width + 100) {
            if (clientY > y && clientY < y + rect.height + 100) {
              addBook(book);
              rmAvailableBook(book);
            }
          } else {
            removeBook(book);
            addAvailableBook(book);
          }
        }
      }}
      whileDrag={{ scale: 0.5, zIndex: 1000 }}
      ref={bookRef}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 500 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.05 * (index + 1),
          duration: 0.4,
          type: "tween",
        },
      }}
      layout
      className="w-[400px] h-[600px] select-none text-lg shadow-lg z-40 flex flex-col bg-gray-50 justify-between items-center p-4 rounded-xl"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onPointerDown={startDrag}
        className="h-[500px] flex justify-center items-center relative"
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          if (!inverted) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            animate(scope.current, {
              width: ["100%", "0%", "100%"],
              scaleX: [1, 0, -1],
              opacity: [1, 0, 0.15],
              transition: {
                duration: 0.1,
              },
            });
          } else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            animate(scope.current, {
              width: ["100%", "0%", "100%"],
              scaleX: [-1, 0, 1],
              opacity: [0.35, 0, 1],
              transition: {
                duration: 0.1,
              },
            });
          }
          setInverted(!inverted);
        }}
      >
        <AnimatePresence>
          {inverted && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-40 h-[500px] justify-center flex items-center text-center tracking-wide px-4 text-xl font-semibold"
            >
              {book.synopsis}
            </motion.div>
          )}
        </AnimatePresence>

        <img
          src={book.cover}
          alt={book.title}
          className="object-cover h-full bg-white opacity-100"
          ref={scope}
        />
      </motion.div>
      <div className="text-xl font-semibold text-center">{book.title}</div>
      <div className="font-light">{book.author.name}</div>
    </motion.div>
  );
}
