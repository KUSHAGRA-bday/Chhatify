import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import toast from "react-hot-toast";
import { Edit3Icon, LoaderIcon } from "lucide-react";

const EditGroupModal = ({ open, onClose, channel }) => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [groupName, setGroupName] = useState(channel.data.name || "");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only show friends not already in the group
  const groupMemberIds = Object.keys(channel.state.members || {});
  const availableFriends = friends.filter(
    (f) => !groupMemberIds.includes(f._id)
  );

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Update group name
      if (groupName && groupName !== channel.data.name) {
        await channel.update({ name: groupName });
      }
      // Add new members
      if (selected.length > 0) {
        await channel.addMembers(selected);
      }
      toast.success("Group updated!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-base-200 bg-opacity-40 flex items-center justify-center z-50 text-primary">
      <div className="bg-base-200 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-4 right-6 text-xl" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 text-primary"><Edit3Icon className="size-6 btn"/></h2>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="mb-4">
          <p className="mb-2 font-semibold">Add Friends:</p>
          {isLoading ? (
            <LoaderIcon className="animate-spin size-6 mx-auto" />
          ) : (
            <div className="max-h-40 overflow-y-auto">
              {availableFriends.length === 0 && (
                <p className="text-sm text-gray-400">No friends to add.</p>
              )}
              {availableFriends.map((user) => (
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
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="size-6 rounded-full"
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Group"}
        </button>
      </div>
    </div>
  );
};

export default EditGroupModal;
