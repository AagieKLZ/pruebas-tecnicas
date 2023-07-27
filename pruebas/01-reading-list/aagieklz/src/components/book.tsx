import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReadingList } from "../store/readingListStore";
import { useAvailableList } from "../store/availableListStore";
import { useZoneRef } from "../store/zoneRefStore";
import { useDraggingStore } from "../store/draggingStore";
import { useReadingListModalStore } from "../store/readingListModalStore";
import { useThemeStore } from "../store/themeStore";
import { Plus } from "lucide-react";

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
  const { setIsDragging } = useDraggingStore();
  const [wasOpen, setWasOpen] = useState(false);
  const { modalOpen, toggleModal } = useReadingListModalStore();

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }
  const { theme } = useThemeStore();

  useEffect(() => {
    if (bookRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      animate(bookRef.current, {
        backgroundColor: theme === "light" ? "#fff" : "#09090b",
        color: theme === "light" ? "#000" : "#fff",
      });
    }
  }, [theme, bookRef, animate]);

  return (
    <motion.div
      drag
      dragSnapToOrigin
      onDragStart={() => {
        setIsDragging(true);
        setWasOpen(modalOpen);
        if (!modalOpen) {
          toggleModal();
        }
      }}
      onDragEnd={(e) => {
        setIsDragging(false);

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
            if (!wasOpen) {
              toggleModal();
            }
          }
        }
      }}
      whileDrag={{ scale: 0.5, zIndex: 1000 }}
      ref={bookRef}
      // whileHover={{ scale: 1.05 }}
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
      className={`w-[400px] h-[600px] relative text-secondary select-none text-lg shadow-lg z-40 flex flex-col justify-between items-center p-4 rounded-xl`}
    >
      <motion.button
        onClick={() => {
          addBook(book);
          rmAvailableBook(book);
          if (!modalOpen) {
            toggleModal();
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute z-50 p-2 bg-blue-500 rounded-full -top-2 -right-2 drop-shadow-lg h-fit"
      >
        <Plus className="w-6 h-6 stroke-white" />
      </motion.button>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onPointerDown={startDrag}
        className="h-[500px] cursor-pointer flex justify-center items-center relative"
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
