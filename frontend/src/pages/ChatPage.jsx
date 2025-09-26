import { ArrowLeft } from "lucide-react";
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
  const { id, group } = useParams(); // id: userId or channelId, group: "group" if group chat
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
          currChannel = client.channel("messaging", id);
        } else {
          const channelId = [authUser._id, id].sort().join("-");
          currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, id],
          });
        }
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("error Inititializing chat", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, id, group]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here ${callUrl}`,
      });
      toast.success("Video call link sent successfully");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <div className="w-full bg-base-300 p-4 sticky ">
        <Link to="/">
          <ArrowLeft className="hover:bg-base-100 size-7" />
        </Link>
      </div>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              {group && (
                <button
                  className="btn btn-sm btn-accent absolute top-4 right-4"
                  onClick={() => setShowEditGroup(true)}
                >
                  Edit Group
                </button>
              )}
              <EditGroupModal
                open={showEditGroup}
                onClose={() => setShowEditGroup(false)}
                channel={channel}
                authUser={authUser}
              />

              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
