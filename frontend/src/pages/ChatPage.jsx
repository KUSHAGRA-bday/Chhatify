import { ArrowLeft, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";
import EditGroupModal from "../components/EditGroupModal.jsx";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const [showEditGroup, setShowEditGroup] = useState(false);
  const { id, group } = useParams(); // id: userId or channelId
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
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

        let currChannel;
        if (group) {
          // ✅ For groups we just watch the existing channel
          currChannel = client.channel("messaging", id);
        } else {
          // 1-to-1 chat uses sorted ID
          const channelId = [authUser._id, id].sort().join("-");
          currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, id],
          });
        }

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error Initializing chat", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, id, group]);

  const handleVideoCall = () => {
    if (!channel) return;
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    channel.sendMessage({
      text: `I've started a video call. Join me here ${callUrl}`,
    });
    toast.success("Video call link sent successfully");
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] flex flex-col bg-base-200">
      {/* TOP BAR */}
      <div className="flex items-center justify-between bg-base-300 px-4 py-3 sticky top-0 z-20">
        <Link to="/">
          <ArrowLeft className="size-7 hover:bg-base-100 rounded-full p-1 transition" />
        </Link>

        {group && (
          <button
            className="btn btn-sm btn-accent"
            onClick={() => setShowEditGroup(true)}
          >
            <Edit3 className="size-5" /> Edit Group
          </button>
        )}
      </div>

      {/* CHAT WINDOW */}
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="relative flex-1">
            <CallButton handleVideoCall={handleVideoCall} />

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>

            <Thread />
          </div>
        </Channel>
      </Chat>

      {group && (
        <EditGroupModal
          open={showEditGroup}
          onClose={() => setShowEditGroup(false)}
          channel={channel}
        />
      )}
    </div>
  );
};

export default ChatPage;
