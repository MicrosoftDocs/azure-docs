---
title: Supported features for Microsoft Teams on Azure Virtual Desktop - Azure
description: Supported features for Microsoft Teams on Azure Virtual Desktop.
ms.topic: conceptual
ms.custom: docs_inherited
search.audiencetype: EndUser
author: dougeby
ms.author: avdcontent
ms.date: 06/03/2025
---

# Supported features for Microsoft Teams on Azure Virtual Desktop

> [!IMPORTANT]
> Teams media optimization on iOS/iPadOS is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article lists the features of Microsoft Teams that Azure Virtual Desktop currently supports and the minimum requirements to use each feature.

## Supported features

The following table lists whether Windows App on Windows, macOS or iOS/iPadOS, or the Remote Desktop client for Windows supports specific features for Teams on Azure Virtual Desktop. Other clients aren't supported.

| Feature | Windows | macOS | iOS/iPadOS (preview) |
|--|--|--|--|
| Application window sharing | Yes | No | No |
| Audio/video call | Yes | Yes | Yes |
| Background blur | Yes | Yes | Yes |
| Background images | Yes | Yes | No |
| Call health panel | Yes | Yes | Yes |
| Communication Access Real-time Translation (CART) transcriptions | Yes | Yes | Yes |
| Configure audio devices | Yes | No | No |
| Configure camera devices | Yes | Yes | Yes |
| Diagnostic overlay | Yes | No | No |
| Dynamic e911 | Yes | Yes | Yes |
| Give and take control | Yes | Yes | Yes |
| Live captions | Yes | Yes | Yes |
| Live reactions | Yes | Yes | Yes |
| Manage breakout rooms | Yes | Yes | Yes |
| Mirror my video | Yes | No | No |
| Multiwindow | Yes | Yes | Yes |
| Noise suppression | Yes | Yes | Yes |
| Screen share and video together | Yes | Yes | Yes |
| Screen share | Yes | Yes | Yes |
| Secondary ringer | Yes | Yes | Yes |
| Shared system audio | Yes | No | No |
| Simulcast | Yes | Yes | Yes |

> [!NOTE]
> - Teams optimizations when using Teams as a RemoteApp are only supported with Windows App for Windows (VDI 1.0 only). We don't support Teams optimizations on non-Windows endpoints when using Teams as a RemoteApp.
> 
> - When using Teams optimizations on Windows App on an iPhone, users might experience low audio output volume playing only from the earpiece speakers. Users are recommended to use Bluetooth headphones as a workaround. This doesn't affect iPad devices.
>
> - You can find a more general list of Teams features that aren't supported on any VDI platform in the documentation for Microsoft Teams at [Features not supported in VDI](/microsoftteams/new-teams-vdi-requirements-deploy#features-not-supported-in-vdi).

## Version requirements

The following table lists the minimum required versions for each Teams feature. For optimal user experience on Teams for Azure Virtual Desktop, we recommend using the latest supported versions of each client along with the WebRTC Redirector Service installed on your session hosts. To learn more, see [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

| Supported features | Windows | macOS | iOS/iPadOS (preview) | WebRTC Redirector Service | Teams |
|--|--|--|--|--|
| Application window sharing | 1.2.3770 and later | Not supported | Not supported | 1.31.2211.15001 | Updates within 90 days of the current version |
| Audio/video call | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Background blur | 1.2.3004 and later | 10.7.10 and later | 11.0.0 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Background images | 1.2.3004 and later | 10.7.10 and later | 11.0.0 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| CART transcriptions | 1.2.2322 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Call health panel | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Configure audio devices | 1.2.1755 and later | Not supported | Not supported | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Configure camera devices | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Diagnostic overlay | 1.2.3316 and later | Not supported | Not supported | 1.17.2205.23001 and later | Updates within 90 days of the current version |
| Dynamic e911 | 1.2.2600 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Give and take control | 1.2.2924 and later | 10.7.10 and later | 11.0.0 and later | 1.0.2006.11001 and later (Windows), 1.31.2211.15001 and later (macOS) | Updates within 90 days of the current version |
| Live captions | 1.2.2322 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Live reactions | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Manage breakout rooms | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Mirror my video | 1.2.3770 and later | Not supported | Not supported | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Multiwindow | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.1.2110.16001 and later | Updates within 90 days of the current version |
| Noise suppression* | 1.2.3316 and later | 10.8.1 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Screen share and video together | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Screen share | 1.2.1755 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Secondary ringer | 1.2.3004 and later | 10.7.7 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |
| Shared system audio | 1.2.4058 and later | Not supported | Not supported | 1.0.2006.11001 and later  | Updates within 90 days of the current version |
| Simulcast | 1.2.3667 and later | 10.8.1 and later | 11.0.0 and later | 1.0.2006.11001 and later | Updates within 90 days of the current version |

\* When using [Teams media optimizations](teams-on-avd.md#verify-media-optimizations-loaded), noise suppression is on by default, but confirmation isn't shown in Teams client. This is by design.

## Next steps

Learn more about how to set up Teams for Azure Virtual Desktop at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

Learn about known issues, limitations, and how to log issues at [Troubleshoot Teams on Azure Virtual Desktop](troubleshoot-teams.md).

Learn about the latest version of the Remote Desktop WebRTC Redirector Service at [What's new in the Remote Desktop WebRTC Redirector Service](whats-new-webrtc.md).
