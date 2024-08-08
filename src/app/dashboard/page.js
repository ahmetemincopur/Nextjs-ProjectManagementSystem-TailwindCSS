"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Boards from "../../components/Boards";
import Projects from "../../components/Projects";

export default function Dashboard() {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [router]);

  const handleProjectMenuToggle = () => {
    setIsProjectMenuOpen(!isProjectMenuOpen);
  };

  if (!mounted) return null;

  return (
    <div className="h-screen">
      <Header />
      <div className="h-[90%]">
        <div className="flex flex-1 overflow-hidden h-full bg-red-500">
          <Sidebar onProjectMenuToggle={handleProjectMenuToggle} />
          {isProjectMenuOpen && <Projects />}
          <div className="flex-1 bg-blue-100 p-6 overflow-y-auto h-full">
            <DndProvider backend={HTML5Backend} className="h-full">
              <Boards />
            </DndProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
