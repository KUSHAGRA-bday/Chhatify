import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../lib/api";
import { LoaderIcon, Search, CheckCircle2, UserPlus2Icon } from "lucide-react";

const FindUserModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const users = await searchUsers(query.trim());
    setResults(users);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-4 right-6 text-xl" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Find User</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? (
              <LoaderIcon className="animate-spin size-5" />
            ) : (
              <span className="btn btn-ghost justify-start px-4 py-2 hover:bg-base-300">
                <Search className="size-5 bg-none" />
              </span>
            )}
          </button>
        </form>
        <div>
          {results.length === 0 && !loading && (
            <p className="text-sm text-gray-400">No users found.</p>
          )}
          <ul>
            {results.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return (
                <li
                  key={user._id}
                  className="flex flex-col gap-2 py-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="size-8 rounded-full"
                    />
                    <span className="font-medium">{user.fullName}</span>
                    {user.email && (
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    )}
                    <button
                      className={`btn mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-ghost"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircle2 className="size-4 mr-2" />
                        </>
                      ) : (
                        <>
                          <UserPlus2Icon className="size-4 mr-2" />
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FindUserModal;
