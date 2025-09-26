import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { logout } from "../lib/api.js";
import { Bell, LogOut, Search, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import ThemeSelector from "./ThemeSelector.jsx";
import { useLocation, useNavigate, Link } from "react-router";
import { useState } from "react";
import FindUserModal from "./FriendSearchBar.jsx";

const Navbar = () => {
  const [showFindUser, setShowFindUser] = useState(false);

  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully!!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top 0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center w-full">
          {/* Find user */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="btn btn-ghost justify-start px-4 py-2 hover:bg-base-300"
              onClick={() => setShowFindUser(true)}
            >
              <Search className="size-5 text-base-content opacity-70" />
            </button>
          </div>
          {/* notifications */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to={"/notifications"}
              className="btn btn-ghost justify-start px-4 py-2 hover:bg-base-300"
            >
              <Bell className="size-5 text-base-content opacity-70" />
            </Link>
          </div>
          {/* theme selector */}
          <ThemeSelector />
          {/* profile */}
          <div className="avatar">
            <Link to="/profile">
              <div className="size-8 rounded-full cursor-pointer">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </Link>
          </div>
          {/* logout */}
          <button
            className="btn btn-ghost justify-start px-4 py-2 hover:bg-base-300 opacity-70"
            onClick={() => {
              logoutMutation();
            }}
          >
            <LogOut />
          </button>
        </div>
      </div>
      <FindUserModal
        open={showFindUser}
        onClose={() => setShowFindUser(false)}
      />
    </nav>
  );
};

export default Navbar;
