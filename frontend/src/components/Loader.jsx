import { LoaderIcon } from "lucide-react";
import useThemeStore from "../store/useThemeStore";

const Loader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex justify-center items-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};

export default Loader;
