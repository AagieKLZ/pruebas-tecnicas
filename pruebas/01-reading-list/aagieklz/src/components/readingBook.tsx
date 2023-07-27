import { motion, useAnimate, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import { useReadingList } from "../store/readingListStore";
import { useAvailableList } from "../store/availableListStore";
import { useRaisedShadow } from "../hooks/use-raised-shadow";
import { useZoneRef } from "../store/zoneRefStore";
import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";

type Props = {
  book: BookData;
};

export default function ReadingBook({ book }: Props) {
  const { zoneRef } = useZoneRef();
  const { removeBook } = useReadingList();
  const { addBook } = useAvailableList();
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const { theme } = useThemeStore();
  const [bookRef, animate] = useAnimate();
  useEffect(() => {
    if (bookRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      animate(bookRef.current, {
        backgroundColor: theme === "light" ? "#fff" : "#020617",
        color: theme === "light" ? "#000" : "#fff",
      });
    }
  }, [theme, bookRef, animate]);
  return (
    <motion.div
      drag="x"
      dragSnapToOrigin
      initial={{ opacity: 0, x: -200 }}
      onDragEnd={(e) => {
        const parent = zoneRef.current;
        const rect = parent?.getBoundingClientRect();
        console.log(rect);
        if (rect) {
          const { x } = rect;
          const { clientX } = e as PointerEvent;
          if (clientX < x) {
            addBook(book);
            removeBook(book);
          }
        }
      }}
      animate={{
        opacity: 1,
        x: 0,
        scaleZ: -10,
        transition: {
          delay: 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        },
      }}
      exit={{
        opacity: 0,
        x: -600,
        transition: { duration: 0.3, type: "tween" },
      }}
      style={{ boxShadow, y }}
      whileDrag={{ scale: 0.5, zIndex: 1000 }}
      className={`z-50 flex items-center justify-between w-5/6 select-none text-secondary ${
        theme === "light" ? "bg-gray-50 text-black" : "bg-black text-white"
      } rounded-lg md:h-28 h-36 drop-shadow-lg`}
    >
      <div className="w-20 rounded-l-lg min-w-fit">
        <img
          className="w-20 rounded-l-lg h-28"
          src={book.cover}
          alt={`${book.title} cover`}
        />
      </div>
      <div className="px-4 text-lg font-semibold text-right max-w-1/2">
        <div>{book.title}</div>
        <div className="font-light">{book.author.name}</div>
      </div>
      <button
        onClick={() => {
          removeBook(book);
          addBook(book);
        }}
        className="flex items-center justify-center h-full px-4 my-auto border-l rounded-r-lg border-l-gray-400 w-fit"
      >
        <X className="w-6 h-6" />
      </button>
    </motion.div>
  );
}
