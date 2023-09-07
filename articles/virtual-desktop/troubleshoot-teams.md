---
title: Troubleshoot Microsoft Teams on Azure Virtual Desktop - Azure
description: Known issues and troubleshooting instructions for Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 03/07/2023
ms.author: helohr
manager: femila
---

# Troubleshoot Microsoft Teams for Azure Virtual Desktop

This article describes known issues and limitations for Teams on Azure Virtual Desktop, as well as how to log issues and contact support.

## Known issues and limitations

Using Teams in a virtualized environment is different from using Teams in a non-virtualized environment. For more information about the limitations of Teams in virtualized environments, check out [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi#known-issues-and-limitations).

### Client deployment, installation, and setup

- With per-machine installation, Teams on VDI isn't automatically updated the same way non-VDI Teams clients are. To update the client, you'll need to update the VM image by installing a new MSI.
- Media optimization for Teams is only supported for the Remote Desktop client on machines running Windows 10 or later or macOS 10.14 or later.
- Use of explicit HTTP proxies defined on the client endpoint device should work, but isn't supported.
- Zoom in/zoom out of chat windows isn't supported.

### Calls and meetings

- Due to WebRTC limitations, incoming and outgoing video stream resolution is limited to 720p.
- The Teams app doesn't support HID buttons or LED controls with other devices.
- This feature doesn't support uploading custom background images.
- This feature doesn’t support taking screenshots for incoming videos from the virtual machine (VM). As a workaround, we recommend you minimize the session desktop window and screenshot from the client machine instead.
- This feature doesn't support content sharing for redirected videos during screen sharing and application window sharing.
- The following issues occur during application window sharing:
  - You currently can't select minimized windows. In order to select windows, you'll need to maximize them first.
  - If you've opened a window overlapping the window you're currently sharing during a meeting, the contents of the shared window that are covered by the overlapping window won't update for meeting users.
  - If you're sharing admin windows for programs like Windows Task Manager, meeting participants may see a black area where the presenter toolbar or call monitor is located.
- Switching tenants can result in call-related issues such as screen sharing not rendering correctly. You can mitigate these issues by restarting your Teams client. 

For Teams known issues that aren't related to virtualized environments, see [Support Teams in your organization](/microsoftteams/known-issues).

## Collect Teams logs

If you encounter issues with the Teams desktop app in your Azure Virtual Desktop environment, collect client logs under **%appdata%\Microsoft\Teams\logs.txt** on the host VM.

If you encounter issues with calls and meetings, you can start collecting Teams diagnostic logs with the key combination **Ctrl** + **Alt** + **Shift** + **1**. Logs will be written to **%userprofile%\Downloads\MSTeams Diagnostics Log DATE_TIME.txt** on the host VM.

## Contact Microsoft Teams support

To contact Microsoft Teams support, go to the [Microsoft 365 admin center](/microsoft-365/admin/contact-support-for-business-products).

## Next steps

Learn more about how to set up Teams on Azure Virtual Desktop at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

Learn more about the WebRTC Redirector Service for Teams on Azure Virtual Desktop at [What's new in the WebRTC Redirector Service](whats-new-webrtc.md).
