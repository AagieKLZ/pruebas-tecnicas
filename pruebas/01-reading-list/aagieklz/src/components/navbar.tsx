import { motion, useScroll } from "framer-motion";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="fixed inset-0 w-full flex flex-col opacity-100 z-[900] h-4">
      {/* <nav className="w-full bg-green-800 h-16 drop-shadow-lg z-[999]"></nav> */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="bg-purple-300 h-4 transform-gpu origin-left top-0 left-0 w-full z-[1000]"
      ></motion.div>
    </div>
  );
}
