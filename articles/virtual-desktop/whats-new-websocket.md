---
title: What's new in WebSocket Service for Azure Virtual Desktop?
description: New features and product updates the WebSocket Service for Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 10/07/2022
ms.author: helohr
manager: femila
ms.custom: references_regions
---

# What's new in the WebSocket Service

This article provides information about the latest updates to the WebSocket Service for Teams for Azure Virtual Desktop.

## Latest versions of the WebSocket Service

The following table lists the latest versions of the WebSocket Service:

|Version        |Release date  |
|---------------|--------------|
|1.17.2205.23001|06/20/2022    |
|1.4.2111.18001 |12/02/2021    |
|1.1.2110.16001 |10/15/2021    |
|1.0.2106.14001 |07/29/2021    |

## Updates for version 1.17.2205.23001

- Fixed an issue that made the WebRTC redirector service disconnect from Teams on Azure Virtual Desktop.
- Added keyboard shortcut detection for Shift+Ctrl+; that lets users turn on a diagnostic overlay during calls on Teams for Azure Virtual Desktop. This feature is supported in version 1.2.3313 or later of the Windows Desktop client. 
- Added further stability and reliability improvements to the service.

## Updates for version 1.4.2111.18001

- Fixed a mute notification problem.
- Multiple z-ordering fixes in Teams on Azure Virtual Desktop and Teams on Microsoft 365.
- Removed timeout that prevented the WebRTC redirector service from starting when the user connects.
- Fixed setup problems that prevented side-by-side installation from working.

## Updates for version 1.1.2110.16001

- Fixed an issue that caused the screen to turn black while screen sharing. If you've been experiencing this issue, confirm that this update will resolve it by resizing the Teams window. If screen sharing starts working again after resizing, the update will resolve this issue.
- You can now control the meeting, ringtone, and notification volume from the host VM. You can only use this feature with version 1.2.2459 or later of [the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew).
- The installer will now make sure that Teams is closed before installing updates.
- Fixed an issue that prevented users from returning to full screen mode after leaving the call window.

## Next steps

Learn more about how to set up Teams for Azure Virtual Desktop at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

Learn about known issues, limitations, and how to log issues at [Troubleshoot Teams for Azure Virtual Desktop](troubleshoot-teams.md).