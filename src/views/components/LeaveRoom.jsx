import { Fragment, useState } from "react";
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  HangUpIcon,
  isMobileDevice,
  MessageModal,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../ApiRequests";

export const LeaveRoom = () => {
  const history = useHistory();
  const params = useParams();
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [showLeaveCall, setShowLeaveCall] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  const [redirectStarted, setRedirectedStarted] = useState(false);

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
        setRedirectedStarted(false);
        // history.push(`${response.data.endcall_url}`);
        window.location = `${response.data.endcall_url}`;
      })
      .catch(err => {
        console.error("Couldn't end the call properly", err);
        setRedirectedStarted(false);
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
      <Button
        size="md"
        shape="rectangle"
        variant="danger"
        iconOnly={isMobileDevice()}
        active={isMobileDevice()}
        key="LeaveRoom"
        onClick={() => {
          setShowLeaveCall(true);
        }}
      >
        <HangUpIcon className={isMobileDevice() ? "" : "mr-2"} key="hangUp" />
        {isMobileDevice() ? "" : "Leave room"}
      </Button>
      {/* <ContextMenu
        classes={{
          trigger: "w-auto h-auto",
          root: "static",
          menu: "w-56 bg-white dark:bg-gray-100",
          menuItem: "hover:bg-transparent-0 dark:hover:bg-transparent-0",
        }}
        onTrigger={value => {
          // if (permissions?.endRoom) {
          //   setShowMenu(value);
          // } else {
          // leaveRoom();
          console.log("onlcick Value", value);
          setShowLeaveCall(true);
          // }
        }}
        menuOpen={false}
        key="LeaveAction"
        trigger={
         
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
      > */}
      {/* {permissions?.endRoom && (
          <ContextMenuItem
            label="End Room"
            key="endRoom"
            classes={{
              menuTitleContainer: "hidden",
              menuItemChildren: "my-1 w-full",
            }}
          >
            <Button
              shape="rectangle"
              variant="standard"
              classes={{ root: "w-full" }}
              onClick={() => {
                setShowEndRoomModal(true);
              }}
            >
              End Room for all
            </Button>
          </ContextMenuItem>
        )}}
        {/* <ContextMenuItem
          label="Leave Room"
          key="leaveRoom"
          classes={{
            menuTitleContainer: "hidden",
            menuItemChildren: "my-1 w-full overflow-hidden",
          }}
        > */}

      <MessageModal
        show={showEndRoomModal}
        onClose={() => {
          setShowEndRoomModal(false);
          setLockRoom(false);
        }}
        title="End Room"
        body="Are you sure you want to end the room?"
        footer={
          <div className="flex">
            <div className="flex items-center">
              <label className="text-base dark:text-white text-gray-100">
                <input
                  type="checkbox"
                  className="mr-1"
                  onChange={() => setLockRoom(prev => !prev)}
                  checked={lockRoom}
                />
                <span>Lock room</span>
              </label>
            </div>
            <Button
              classes={{ root: "mr-3 ml-3" }}
              onClick={() => {
                setShowEndRoomModal(false);
                setLockRoom(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                hmsActions.endRoom(lockRoom, "End Room");
                leaveRoom();
              }}
            >
              End Room
            </Button>
          </div>
        }
      />
      <MessageModal
        show={showLeaveCall}
        onClose={() => {
          setShowLeaveCall(false);
          setLockRoom(false);
        }}
        title="Leave Video Call"
        body="Are you sure, you want to leave the video call?"
        footer={
          <div className="flex">
            {/* <div className="flex items-center">
              <label className="text-base dark:text-white text-gray-100">
                <input
                  type="checkbox"
                  className="mr-1"
                  onChange={() => setLockRoom(prev => !prev)}
                  checked={lockRoom}
                />
                <span>Lock room</span>
              </label>
            </div> */}
            <Button
              disabled={redirectStarted}
              classes={{ root: "mr-3 ml-3" }}
              onClick={() => {
                setShowLeaveCall(false);
                setLockRoom(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={redirectStarted}
              variant="danger"
              onClick={() => {
                // hmsActions.endRoom(lockRoom, "End Room");
                leaveRoom();
              }}
            >
              Leave Room
            </Button>
          </div>
        }
      />
    </Fragment>
  );
};
