import React, { useEffect, useContext, useState, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { ConferenceHeader } from "../views/headerView";
import { ConferenceFooter } from "../views/footerView";
import { ConferenceMainView } from "../views/mainView";
import {
  Button,
  MessageModal,
  selectIsConnectedToRoom,
  selectRoleChangeRequest,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import FullPageProgress from "../views/components/FullPageSpinner";
import { useQuery } from "../hooks";

export const Conference = () => {
  const history = useHistory();
  const { roomId, role } = useParams();
  const query = useQuery();
  const username = query.get("username");
  const context = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const toggleChat = useCallback(() => {
    setIsChatOpen(open => !open);
  }, []);
  const isConnectedToRoom = useHMSStore(selectIsConnectedToRoom);
  const roleChangeRequest = useHMSStore(selectRoleChangeRequest);
  const hmsActions = useHMSActions();

  const onParticipantListOpen = useCallback(value => {
    setIsParticipantListOpen(value);
  }, []);

  const { loginInfo, setLoginInfo } = context;

  // useEffect(() => {
  //   if (username) {
  //     setLoginInfo({ username });
  //   }
  // }, [username]);

  useEffect(() => {
    if (!roomId) {
      history.push(`/`);
    }
    if (!loginInfo.token) {
      // redirect to join if token not present
      if (role)
        history.push(
          `/preview/${loginInfo.roomId || roomId || ""}/${role}?username=${
            username || "anonymous"
          }`
        );
      else
        history.push(
          `/preview/${loginInfo.roomId || roomId || ""}?username=${
            username || "anonymous"
          }`
        );
    }

    return () => {
      // This is needed to handle mac touchpad swipe gesture
      hmsActions.leave();
    };
    // eslint-disable-next-line
  }, [username]);

  if (!isConnectedToRoom) {
    return <FullPageProgress />;
  }

  return (
    <div className="w-full h-full flex flex-col dark:bg-black">
      <div className="h-14 md:h-16">
        <ConferenceHeader onParticipantListOpen={onParticipantListOpen} />
      </div>
      <div className="w-full flex flex-1 flex-col md:flex-row">
        <ConferenceMainView
          isChatOpen={isChatOpen}
          isParticipantListOpen={isParticipantListOpen}
          toggleChat={toggleChat}
        />
      </div>
      <div className="dark:bg-black" style={{ height: "10%" }}>
        <ConferenceFooter isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
      <MessageModal
        show={!!roleChangeRequest}
        onClose={() => hmsActions.rejectChangeRole(roleChangeRequest)}
        title="Role Change Request"
        body={`Role change requested by ${roleChangeRequest?.requestedBy?.name}.
              Changing role to ${roleChangeRequest?.role?.name}.`}
        footer={
          <div className="flex space-x-1">
            <Button
              onClick={() => hmsActions.acceptChangeRole(roleChangeRequest)}
            >
              Accept
            </Button>
          </div>
        }
      />
    </div>
  );
};
