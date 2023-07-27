import { AnimationScope, motion, useAnimate } from "framer-motion";
import { useReadingListModalStore } from "../store/readingListModalStore";
import {
  LightbulbIcon,
  LightbulbOffIcon,
  Moon,
  PanelRightOpen,
  Search,
  Sun,
} from "lucide-react";
import { DarkSide, Expand } from "@theme-toggles/react";
import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";
import Filters from "./filters";

type Props = {
  scope: AnimationScope<any>;
};

export default function Navbar({ scope }: Props) {
  const { toggleModal } = useReadingListModalStore();
  const { theme, toggleTheme } = useThemeStore();
  const [navRef, animate] = useAnimate();
  const { modalOpen } = useReadingListModalStore();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    animate(navRef.current, {
      backgroundColor: theme === "light" ? "#fff" : "#09090b",
      color: theme === "light" ? "#000" : "#fff",
    });
  });
  return (
    <motion.div
      ref={navRef}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 w-full flex flex-row justify-between opacity-100 z-[900] h-20 ${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } shadow-lg px-12`}
    >
      <div className="flex items-center text-5xl font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-12 h-12 mr-4 ${
            theme == "light" ? "stroke-black" : "stroke-white"
          }`}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        {Array.from("Reading List").map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.05,
              duration: 0.3,
              type: "spring",
              stiffness: 200,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className="flex flex-row items-center justify-center">
        {/* <div className="relative flex flex-row items-center justify-center">
          <div className="flex items-center justify-center h-10 px-2 bg-gray-200 border-r rounded-l-full border-r-black">
            <Search className="w-6 h-6 stroke-1" />
          </div>
          <motion.input
            type="search"
            name="search"
            id="search"
            placeholder="Buscar"
            whileFocus={{ width: "300px" }}
            transition={{ duration: 0.2 }}
            className="w-[150px] h-10 p-2 bg-gray-200 rounded-r-full focus:ring-0 focus:border-0"
          />
        </div> */}
      </div>
      <div className="flex items-center justify-end w-1/6 gap-8">
        <button onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="stroke-1 w-9 h-9" />
          ) : (
            <Sun className="stroke-1 w-9 h-9" />
          )}
        </button>
        <Filters />
        <motion.button
          animate={{ rotate: modalOpen ? "180deg" : "360deg" }}
          onClick={toggleModal}
          className="z-[901] top-6 right-6 h-fit w-fit"
        >
          <PanelRightOpen ref={scope} className="stroke-1 w-9 h-9" />
        </motion.button>
      </div>
    </motion.div>
  );
}
