import React, { useState, forwardRef } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@100mslive/react-icons";
import {
  Dialog,
  Button,
  Text,
  Label,
  Checkbox,
  Box,
  Flex,
  Dropdown,
  textEllipsis,
  Tooltip,
} from "@100mslive/react-ui";
import { useDropdownSelection } from "./hooks/useDropdownSelection";

const PeerName = forwardRef(({ children, maxWidth, ...rest }, ref) => (
  <Text
    {...rest}
    ref={ref}
    as="strong"
    variant="body2"
    css={{
      ...textEllipsis(maxWidth),
      display: "inline-block",
      fontWeight: "$semiBold",
      c: "inherit",
    }}
  >
    {children}
  </Text>
));

export const RoleChangeModal = ({ peerId, onOpenChange }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer?.roleName);
  const [requestPermission, setRequestPermission] = useState(true);
  const hmsActions = useHMSActions();
  const [open, setOpen] = useState(false);
  const selectionBg = useDropdownSelection();
  const [peerNameRef, setPeerNameRef] = useState();
  if (!peer) {
    return null;
  }

  const peerNameMaxWidth = 200;
  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content css={{ width: "min(400px,80%)", p: "$10" }}>
          <Dialog.Title css={{ p: 0 }} asChild>
            <Text as="h6" variant="h6">
              Change Role
            </Text>
          </Dialog.Title>
          <Dialog.Description asChild>
            <Text
              variant="body2"
              css={{
                mt: "$4",
                mb: "$8",
                c: "$textMedEmp",
                display: "flex",
                flexWrap: "wrap",
                columnGap: "4px",
              }}
            >
              Change the role of
              {peerNameRef && peerNameRef.clientWidth === peerNameMaxWidth ? (
                <Tooltip title={peer.name} side="top">
                  <PeerName ref={setPeerNameRef} maxWidth={peerNameMaxWidth}>
                    {peer.name}
                  </PeerName>
                </Tooltip>
              ) : (
                <PeerName ref={setPeerNameRef} maxWidth={peerNameMaxWidth}>
                  {peer.name}
                </PeerName>
              )}
              to
            </Text>
          </Dialog.Description>
          <Flex
            align="center"
            css={{
              w: "100%",
              mb: "$10",
            }}
          >
            <Box
              css={{
                position: "relative",
                flex: "1 1 0",
                minWidth: 0,
                "[data-radix-popper-content-wrapper]": {
                  w: "100%",
                  minWidth: "0 !important",
                  transform: "translateY($space$17) !important",
                  zIndex: 11,
                },
              }}
            >
              <Dropdown.Root
                open={open}
                onOpenChange={setOpen}
                css={{ width: "100%" }}
              >
                <Dropdown.Trigger
                  data-testid="open_role_selection_dropdown"
                  asChild
                  css={{
                    border: "1px solid $borderLight",
                    bg: "$surfaceLight",
                    r: "$1",
                    p: "$6 $9",
                    zIndex: 10,
                  }}
                >
                  <Flex
                    align="center"
                    justify="between"
                    css={{ width: "100%" }}
                  >
                    <Text>{selectedRole}</Text>
                    {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </Flex>
                </Dropdown.Trigger>
                <Dropdown.Content
                  align="start"
                  sideOffset={8}
                  css={{ w: "100%" }}
                  portalled={false}
                >
                  {roles.map(role => {
                    return (
                      <Dropdown.Item
                        data-testid={role}
                        key={role}
                        onSelect={() => setRole(role)}
                        css={{
                          px: "$9",
                          bg: role === selectedRole ? selectionBg : undefined,
                        }}
                      >
                        {role}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Content>
              </Dropdown.Root>
            </Box>
          </Flex>
          {!peer.isLocal && (
            <Flex justify="between" css={{ w: "100%", mb: "$10" }}>
              <Label
                htmlFor="requestRoleChangePermission"
                css={{ cursor: "pointer" }}
              >
                Request Permission
              </Label>
              <Checkbox.Root
                checked={requestPermission}
                onCheckedChange={value => setRequestPermission(value)}
                id="requestRoleChangePermission"
                data-testid="force_role_change_checkbox"
              >
                <Checkbox.Indicator>
                  <CheckIcon width={16} height={16} />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </Flex>
          )}
          <Flex
            justify="center"
            align="center"
            css={{ width: "100%", gap: "$md" }}
          >
            <Box css={{ width: "50%" }}>
              <Dialog.Close css={{ width: "100%" }} asChild>
                <Button
                  variant="standard"
                  outlined
                  css={{ width: "100%" }}
                  data-testid="cancel_button"
                >
                  Cancel
                </Button>
              </Dialog.Close>
            </Box>
            <Box css={{ width: "50%" }}>
              <Button
                data-testid="change_button"
                variant="primary"
                css={{ width: "100%" }}
                onClick={async () => {
                  await hmsActions.changeRole(
                    peerId,
                    selectedRole,
                    peer.isLocal ? true : !requestPermission
                  );
                  onOpenChange(false);
                }}
              >
                Change
              </Button>
            </Box>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};