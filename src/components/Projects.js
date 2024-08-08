import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dinamik olarak `useRouter` kullanan bileşeni yükleme
const DynamicComponentWithNoSSR = dynamic(
  () => import("next/router").then((mod) => mod.useRouter),
  { ssr: false }
);

const initialProjects = [
  {
    name: "Proje Isim 1",
    color: "bg-red-500",
    open: true,
    items: ["Overview", "Notifications", "Analytics", "Reports"],
  },
  {
    name: "Proje Isim 2",
    color: "bg-yellow-500",
    open: false,
    items: ["Overview", "Notifications", "Analytics", "Reports"],
  },
  {
    name: "Proje Isim 3",
    color: "bg-green-500",
    open: false,
    items: ["Overview", "Notifications", "Analytics", "Reports"],
  },
  {
    name: "Proje Isim 4",
    color: "bg-blue-500",
    open: true,
    items: ["Overview", "Notifications", "Analytics", "Reports"],
  },
];

export default function Projects() {
  const [openProjects, setOpenProjects] = useState([]);
  const [projects, setProjects] = useState(initialProjects);
  const [newProjectName, setNewProjectName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let router;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    router = DynamicComponentWithNoSSR();
  }

  const toggleProject = (name) => {
    setOpenProjects((prev) =>
      prev.includes(name)
        ? prev.filter((project) => project !== name)
        : [...prev, name]
    );
  };

  const handleProjectClick = (name) => {
    if (isClient && router) {
      router.push(`/projects/${name}`);
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        name: newProjectName,
        color: "bg-gray-500",
        open: false,
        items: [],
      };
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setIsModalOpen(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative text-gray-900">
      <div className="w-60 bg-white shadow-lg h-screen p-4 text-blue-900">
        <h2 className="text-lg font-bold">Projeler</h2>
        <ul className="mt-4">
          {projects.map((project) => (
            <li key={project.name} className="mt-2">
              <div className="flex justify-between items-center">
                <a
                  href="#"
                  onClick={() => handleProjectClick(project.name)}
                  className="flex-1"
                >
                  {project.name}
                </a>
                <button onClick={() => toggleProject(project.name)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
              </div>
              {openProjects.includes(project.name) && (
                <ul className="ml-4 mt-2">
                  {project.items.map((item, index) => (
                    <li key={index} className="mt-1">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="text-sm font-bold">Proje Oluştur</h3>
          <button
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
            onClick={openModal}
          >
            Ekle
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Yeni Proje Ekle</h2>
            <input
              type="text"
              className="mt-2 p-2 border w-full"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Proje adı"
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white p-2 rounded mr-2"
                onClick={closeModal}
              >
                İptal
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleAddProject}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
