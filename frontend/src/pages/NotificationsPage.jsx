import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { acceptFriendRequest } from "../lib/api";
import { declineFriendRequest } from "../lib/api";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";
import {
  UserCheck2Icon,
  Check,
  CircleX,
  BellIcon,
  Clock2Icon,
  MessageSquare,
} from "lucide-react";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: acceptingfriendReq } =
    useMutation({
      mutationFn: acceptFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      },
    });
  const { mutate: declineRequestMutation, isPending: decliningfriendreq } =
    useMutation({
      mutationFn: declineFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      },
    });
  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheck2Icon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>
                {/* accept the incoming req */}
                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm p-3">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm p-3">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="flex gap-1">
                            <button
                              className="btn btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={acceptingfriendReq}
                            >
                              <Check className="size-5" />
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                declineRequestMutation(request._id)
                              }
                              disabled={decliningfriendreq}
                            >
                              <CircleX className="size-5" />
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Accepted request notifications */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <Clock2Icon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
