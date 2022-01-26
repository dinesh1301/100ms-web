import { Fragment, useState } from "react";
import {
  ContextMenu,
  ContextMenuItem,
  MessageModal,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HangUpIcon } from "@100mslive/react-icons";
import { Button, Text } from "@100mslive/react-ui";
import { get } from "../../ApiRequests";

export const LeaveRoom = () => {
  const history = useHistory();
  const params = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  const [redirectStarted, setRedirectedStarted] = useState(false);
  const [showLeaveCall, setShowLeaveCall] = useState(false);

  const leaveRoom = () => {
    hmsActions.leave();
    setRedirectedStarted(true);
    get(
      "end-call-screen-url",
      {
        room_id: params.roomId,
        user_type: params.role || undefined,
      },
      { viaOauth: false }
    )
      .then(response => {
        console.log("response from redirect", response);
        // setRedirectedStarted(false);
        // history.push(`${response.data.endcall_url}`);
        window.location = `${response.data.endcall_url}`;
      })
      .catch(err => {
        console.error("Couldn't end the call properly", err);
        // setRedirectedStarted(false);
      });
    // Get redirect url here
    // if (params.role) {
    //   history.push("/leave/" + params.roomId + "/" + params.role);
    // } else {
    //   history.push("/leave/" + params.roomId);
    // }
  };

  return (
    <Fragment>
      <ContextMenu
        classes={{
          trigger: "w-auto h-auto",
          root: "static",
          menu: "w-56 bg-white dark:bg-gray-100",
          menuItem: "hover:bg-transparent-0 dark:hover:bg-transparent-0",
        }}
        onTrigger={value => {
          setShowLeaveCall(true);
        }}
        menuOpen={showMenu}
        key="LeaveAction"
        trigger={
          <Button variant="danger" key="LeaveRoom">
            <HangUpIcon key="hangUp" />
            <Text variant="body" css={{ ml: "$2", "@md": { display: "none" } }}>
              Leave Room
            </Text>
          </Button>
        }
        menuProps={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: 128,
            horizontal: "center",
          },
        }}
      >
        <ContextMenuItem
          label="Leave Room"
          key="leaveRoom"
          classes={{
            menuTitleContainer: "hidden",
            menuItemChildren: "my-1 w-full overflow-hidden",
          }}
        >
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              leaveRoom();
            }}
          >
            Sure?
          </Button>
        </ContextMenuItem>
      </ContextMenu>
    </Fragment>
  );
};
