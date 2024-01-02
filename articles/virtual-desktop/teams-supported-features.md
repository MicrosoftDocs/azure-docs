---
title: Supported features for Microsoft Teams on Azure Virtual Desktop - Azure
description: Supported features for Microsoft Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 07/26/2023
ms.author: helohr
manager: femila
---

# Supported features for Microsoft Teams on Azure Virtual Desktop

This article lists the features of Microsoft Teams that Azure Virtual Desktop currently supports and the minimum requirements to use each feature.

## Supported features

The following table lists whether the Windows Desktop client, Azure Virtual Desktop Store app or macOS client supports specific features for Teams on Azure Virtual Desktop. Other clients aren't supported.

| Feature | Windows Desktop client and Azure Virtual Desktop app | macOS client |
|--|--|--|
| Application window sharing | Yes | No |
| Audio/video call | Yes | Yes |
| Background blur | Yes | Yes |
| Background images | Yes | Yes |
| Call health panel | Yes | Yes |
| Communication Access Real-time Translation (CART) transcriptions | Yes | Yes |
| Configure audio devices | Yes | No |
| Configure camera devices | Yes | Yes |
| Diagnostic overlay | Yes | No |
| Dynamic e911 | Yes | Yes |
| Give and take control | Yes | Yes |
| Live captions | Yes | Yes |
| Live reactions | Yes | Yes |
| Manage breakout rooms | Yes | Yes |
| Mirror my video | Yes | No |
| Multiwindow | Yes | Yes |
| Noise suppression | Yes | Yes |
| Screen share and video together | Yes | Yes |
| Screen share | Yes | Yes |
| Secondary ringer | Yes | Yes |
| Shared system audio | Yes | No |
| Simulcast | Yes | Yes |

## Version requirements

The following table lists the minimum required versions for each Teams feature. For optimal user experience on Teams for Azure Virtual Desktop, we recommend using the latest supported versions of each client along with the WebRTC Redirector Service installed on your session hosts, which you can find in the following list:

- [Windows Desktop client](whats-new-client-windows.md)
- [Azure Virtual Desktop app](whats-new-client-windows-azure-virtual-desktop-app.md)
- [macOS client](whats-new-client-macos.md)
- [Teams WebRTC Redirector Service](https://aka.ms/msrdcwebrtcsvc/msi)
- [Teams desktop app](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm)

| Supported features | Windows Desktop client and Azure Virtual Desktop Store app version | macOS client version | WebRTC Redirector Service version | Teams version |
|--|--|--|--|--|
| Application window sharing | 1.2.3770 and later | Not supported | 1.31.2211.15001 | Updates within 90 days of the current version |
| Audio/video call | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Background blur | 1.2.3004 and later | 10.7.10 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Background images | 1.2.3004 and later | 10.7.10 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| CART transcriptions | 1.2.2322 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Call health panel | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Configure audio devices | 1.2.1755 and later | Not supported | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Configure camera devices | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Diagnostic overlay | 1.2.3316 and later | Not supported | 1.17.2205.23001 and later | Updates within 90 days of the current version |
| Dynamic e911 | 1.2.2600 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Give and take control | 1.2.2924 and later | 10.7.10 and later | 1.0.2006.11001 and later (Windows), 1.31.2211.15001 and later (macOS) | Updates within 90 days of the current version |
| Live captions | 1.2.2322 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Live reactions | 1.2.1755 and later | 10.7.7 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Manage breakout rooms | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Mirror my video | 1.2.3770 and later | Not supported | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Multiwindow | 1.2.1755 and later | 10.7.7 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Noise suppression* | 1.2.3316 and later | 10.8.1 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Screen share and video together | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Screen share | 1.2.1755 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Secondary ringer | 1.2.3004 and later | 10.7.7 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Shared system audio | 1.2.4058 and later | Not supported | 1.0.2006.11001 and later  | Updates within 90 days of the current version |
| Simulcast | 1.2.3667 and later | 10.8.1 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |

\* When using [Teams media optimizations](teams-on-avd.md#verify-media-optimizations-loaded), noise suppression is on by default, but confirmation isn't shown in Teams client. This is by design.

## Next steps

Learn more about how to set up Teams for Azure Virtual Desktop at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

Learn about known issues, limitations, and how to log issues at [Troubleshoot Teams on Azure Virtual Desktop](troubleshoot-teams.md).

Learn about the latest version of the Remote Desktop WebRTC Redirector Service at [What's new in the Remote Desktop WebRTC Redirector Service](whats-new-webrtc.md).
