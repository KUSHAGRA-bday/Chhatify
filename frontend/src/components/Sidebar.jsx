import { Bell, Home, UserRound, Menu } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Sidebar = () => {
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const [groupChannels, setGroupChannels] = useState([]);

  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!tokenData?.token || !authUser) return;
      const client = StreamChat.getInstance(STREAM_API_KEY);
      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );
      const channels = await client.queryChannels({
        type: "messaging",
        members: { $in: [authUser._id] },
      });
      // Only show group channels (more than 2 members)
      setGroupChannels(channels.filter((ch) => ch.data.member_count > 2));
    };
    fetchChannels();
  }, [tokenData, authUser]);

  return (
    <>
      {/* Mobile/Tablet Toggle Button */}
      {!open && (
        <button
          className="lg:hidden fixed top-2 left-2 z-50 bg-base-200 p-2 rounded-md shadow"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-base-200 border-r border-base-300 flex flex-col relative min-h-screen top-0
          ${open ? "block" : "hidden"} 
          lg:flex
          fixed lg:static z-40 transition-transform duration-300
        `}
        style={{
          left: open ? 0 : "-16rem", // slide in/out for mobile
        }}
      >
        {/* Close button for mobile/tablet */}
        <button
          className="lg:hidden absolute top-4 right-4 z-50 bg-base-300 p-1 rounded"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        <Link to="/" onClick={() => setOpen(false)}>
          <div className="p-2 flex gap-2 border-b border-base-300">
            <p className="tracking-wider font-bold text-3xl font-serif bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">
              Chhatify
            </p>
          </div>
        </Link>
        <nav className="flex flex-col mt-4 gap-1 flex-grow">
          <Link
            to="/"
            className={`btn btn-ghost justify-start px-4 py-2 hover:bg-base-300 ${
              currentPath === "/" ? "bg-base-300 font-semibold" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <Home className="size-5 text-base-content opacity-70" />
            Home
          </Link>
          <Link
            to="/friends"
            className={`btn btn-ghost justify-start px-4 py-2 hover:bg-base-300 ${
              currentPath === "/friends" ? "bg-base-300 font-semibold" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-5 text-base-content opacity-70" />
            Friends
          </Link>
          <Link
            to="/notifications"
            className={`btn btn-ghost justify-start px-4 py-2 hover:bg-base-300 ${
              currentPath === "/notifications"
                ? "bg-base-300 font-semibold"
                : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <Bell className="size-5 text-base-content opacity-70" />
            Notifications
          </Link>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Group Chats</h3>
            <div className="flex flex-col gap-2">
              {groupChannels.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/chat/group/${ch.id}`}
                  className="btn btn-ghost justify-start px-4 py-2 hover:bg-base-300"
                >
                  <span className="font-semibold">{ch.data.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User profile section */}
        <Link to="/profile" onClick={() => setOpen(false)}>
          <div className="p-4 border-t border-base-300 mt-auto cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser?.profilePic} alt="Profile" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content opacity-70">
                  {authUser?.fullName}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </aside>
      {/* Overlay for mobile/tablet when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
