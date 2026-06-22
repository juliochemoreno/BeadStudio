import { useEffect } from "react";
import { useStore } from "./store";
import Editor from "./components/Editor";
import Landing from "./components/Landing";

export default function App() {
  const theme = useStore((s) => s.theme);
  const view = useStore((s) => s.view);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return view === "editor" ? <Editor /> : <Landing />;
}
