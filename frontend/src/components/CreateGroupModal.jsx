import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { LoaderIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CreateGroupModal = ({ open, onClose }) => {
  const { authUser } = useAuthUser();
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName || selected.length < 2) {
      toast.error("Select at least 2 friends and enter a group name.");
      return;
    }
    setLoading(true);
    try {
      const client = StreamChat.getInstance(STREAM_API_KEY);
      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );
      const members = [authUser._id, ...selected];
      const channel = client.channel("messaging", {
        name: groupName,
        members,
      });
      await channel.create();
      toast.success("Group created!");
      onClose();
      // Optionally, redirect to group chat here
      // navigate(`/chat/group/${channel.id}`);
    } catch (err) {
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-4 right-6 text-xl" onClick={onClose}>✕</button>
        <h2 className="text-lg font-bold mb-4">Create Group Chat</h2>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="mb-4">
          <p className="mb-2 font-semibold">Select Friends:</p>
          {isLoading ? (
            <LoaderIcon className="animate-spin size-6 mx-auto" />
          ) : (
            <div className="max-h-40 overflow-y-auto">
              {friends.map((user) => (
                <label key={user._id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(user._id)}
                    onChange={() => {
                      setSelected((prev) =>
                        prev.includes(user._id)
                          ? prev.filter((id) => id !== user._id)
                          : [...prev, user._id]
                      );
                    }}
                  />
                  <img src={user.profilePic} alt={user.fullName} className="size-6 rounded-full" />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={handleCreateGroup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;