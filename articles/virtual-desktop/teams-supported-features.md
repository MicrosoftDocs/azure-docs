---
title: Supported features for Microsoft Teams on Azure Virtual Desktop - Azure
description: Supported features for Microsoft Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 11/01/2022
ms.author: helohr
manager: femila
---

# Supported features for Microsoft Teams on Azure Virtual Desktop

This article lists the features of Microsoft Teams that Azure Virtual Desktop currently supports and the minimum requirements to use each feature.

## Supported features

The following table lists whether the Windows Desktop client or macOS client supports specific features for Teams on Azure Virtual Desktop.

|Feature|Windows Desktop client|macOS client|
|---|---|---|
|Audio/video call|Yes|Yes|
|Screen share|Yes|Yes|
|Configure camera devices|Yes|Yes|
|Configure audio devices|Yes|No|
|Live captions|Yes|Yes|
|Communication Access Real-time Translation (CART) transcriptions|Yes|Yes|
|Give and take control |Yes|No|
|Multiwindow|Yes|Yes|
|Background blur|Yes|Yes|
|Background images|Yes|Yes|
|Screen share and video together|Yes|Yes|
|Secondary ringer|Yes|No|
|Dynamic e911|Yes|Yes|
|Diagnostic overlay|Yes|No|
|Noise suppression|Yes|No|

## Minimum requirements

The following table lists the minimum required versions for each Teams feature. For optimal user experience on Teams for Azure Virtual Desktop, we recommend using the latest supported versions of each client and the WebRTC service, which you can find in the following list:

- [Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [macOS](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew)
- [Teams WebRTC Service](https://aka.ms/msrdcwebrtcsvc/msi)
- [Teams desktop app](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm)

|Supported features|Windows Desktop client version |macOS client version|WebRTC Service version|Teams version|
|---|---|---|---|---|
|Audio/video call|1.2.1755 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Screen share|1.2.1755 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Configure camera devices|1.2.1755 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Configure audio devices|1.2.1755 and later|Not supported|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Live captions|1.2.2322 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|CART transcriptions|1.2.2322 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Give and take control |1.2.2924 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Multiwindow|1.2.1755 and later|10.7.7 and later|1.0.2006.11001 and later|1.5.00.11865 and later|
|Background blur|1.2.3004 and later|10.7.10 and later|1.0.2006.11001 and later|1.5.00.11865 and later|
|Background images|1.2.3004 and later|10.7.10 and later|1.0.2006.11001 and later|1.5.00.11865 and later|
|Screen share and video together|1.2.1755 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Secondary ringer|1.2.3004 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Dynamic e911|1.2.2600 and later|10.7.7 and later|1.0.2006.11001 and later|Updates within 90 days of the current version|
|Diagnostic overlay|1.2.3316 and later|Not supported|1.17.2205.23001 and later|Updates within 90 days of the current version|
|Noise suppression|1.2.3316 and later|Not supported|1.0.2006.11001 and later|Updates within 90 days of the current version|

## Next steps

Learn more about how to set up Teams for Azure Virtual Desktop at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

Learn about known issues, limitations, and how to log issues at [Troubleshoot Teams on Azure Virtual Desktop](troubleshoot-teams.md).

Learn about the latest version of the Remote Desktop WebRTC Redirector Service at [What's new in the Remote Desktop WebRTC Redirector Service](whats-new-webrtc.md).