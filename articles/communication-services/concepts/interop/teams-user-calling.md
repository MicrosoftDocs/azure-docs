---
title: Azure Communication Services Teams identity overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the support for Teams identity in ACS Calling SDK.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 12/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---
# Support for Teams identity in Calling SDK

[!INCLUDE [Communication services support for Teams identity eligibility notice](../../includes/public-preview-include.md)]

The Azure Communication Services Calling SDK enables Teams end-user devices to drive voice and video communication experiences. This page provides detailed descriptions of Calling features, including platform and browser support information. To get started right away, please check out [Calling quickstarts](../../quickstarts/voice-video-calling/getting-started-with-calling.md). 

Key features of the Calling SDK:

- **Addressing** - Azure Communication Services is using [Azure Active Directory user identifier](/powershell/module/azuread/get-azureaduser) to address communication endpoints. Clients use Azure Active Directory identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provides clients visibility into who is connected to a call (the roster). And are also used in [Microsoft Graph API](/graph/api/user-get).
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire. 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications data plane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **PSTN** - The Calling SDK can receive and initiate voice calls with the traditional publically switched telephony system, [using phone numbers you acquire in the Teams Admin Portal](/microsoftteams/pstn-connectivity).
- **Teams Meetings** - The Calling SDK can [join Teams meetings](../../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with the Teams voice and video data plane. 
- **Notifications** - The Calling SDK provides APIs allowing clients to be notified of an incoming call. In situations where your app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end-users of an incoming call. 

## Detailed ACS capabilities 

The following list presents the set of features which are currently available in the Azure Communication Services Calling SDKs.

| Group of features | Capability                                                                                                          | JS  | Windows | Java (Android) | Objective-C (iOS) |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | ------- | -------------- | ----------------- |
| Core Capabilities | Place a one-to-one call between two users                                                                           | ✔️   | ❌       | ❌              | ❌                 |
|                   | Place a group call with more than two users (up to 350 users)                                                       | ✔️   | ❌       | ❌              | ❌                 |
|                   | Promote a one-to-one call with two users into a group call with more than two users                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Join a group call after it has started                                                                              | ✔️   | ❌       | ❌              | ❌                 |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️   | ❌       | ❌              | ❌                 |
|                   | Join Teams meeting                                                                                                                      | ✔️   | ❌       | ❌              | ❌                 |
| Mid call control  | Turn your video on/off                                                                                              | ✔️   | ❌       | ❌              | ❌                 |
|                   | Mute/Unmute mic                                                                                                     | ✔️   | ❌       | ❌              | ❌                 |
|                   | Switch between cameras                                                                                              | ✔️   | ❌       | ❌              | ❌                 |
|                   | Local hold/un-hold                                                                                                  | ✔️   | ❌       | ❌              | ❌                 |
|                   | Active speaker                                                                                                      | ✔️   | ❌       | ❌              | ❌                 |
|                   | Choose speaker for calls                                                                                            | ✔️   | ❌       | ❌              | ❌                 |
|                   | Choose microphone for calls                                                                                         | ✔️   | ❌       | ❌              | ❌                 |
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*         | ✔️   | ❌       | ❌              | ❌                 |
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️   | ❌       | ❌              | ❌                 |
|                   | Show if a participant is muted                                                                                      | ✔️   | ❌       | ❌              | ❌                 |
|                   | Show the reason why a participant left a call                                                                       | ✔️   | ❌       | ❌              | ❌                 |
|                   | Admit participant in the Lobby into the Teams meeting                                                               | ❌   | ❌       | ❌              | ❌                 |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Share a specific application (from the list of running applications)                                                | ✔️   | ❌       | ❌              | ❌                 |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️   | ❌       | ❌              | ❌                 |
|                   | Participant can view remote screen share                                                                            | ✔️   | ❌       | ❌              | ❌                 |
| Roster            | List participants                                                                                                   | ✔️   | ❌       | ❌              | ❌                 |
|                   | Remove a participant                                                                                                | ✔️   | ❌       | ❌              | ❌                 |
| PSTN              | Place a one-to-one call with a PSTN participant                                                                     | ✔️   | ❌       | ❌              | ❌                 |
|                   | Place a group call with PSTN participants                                                                           | ✔️   | ❌       | ❌              | ❌                 |
|                   | Promote a one-to-one call with a PSTN participant into a group call                                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Dial-out from a group call as a PSTN participant                                                                    | ✔️   | ❌       | ❌              | ❌                 |
| General           | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️   | ❌       | ❌              | ❌                 |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get camera list                                                                                                     | ✔️   | ❌       | ❌              | ❌                 |
|                   | Set camera                                                                                                          | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get selected camera                                                                                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get microphone list                                                                                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Set microphone                                                                                                      | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get selected microphone                                                                                             | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get speakers list                                                                                                   | ✔️   | ❌       | ❌              | ❌                 |
|                   | Set speaker                                                                                                         | ✔️   | ❌       | ❌              | ❌                 |
|                   | Get selected speaker                                                                                                | ✔️   | ❌       | ❌              | ❌                 |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️   | ❌       | ❌              | ❌                 |
|                   | Set / update scaling mode                                                                                           | ✔️   | ❌       | ❌              | ❌                 |
|                   | Render remote video stream                                                                                          | ✔️   | ❌       | ❌              | ❌                 |

Support for streaming, timeouts, platforms and browsers is shared with [Communication Services calling SDK overview](./../voice-video-calling/calling-sdk-features.md).

## Detailed Teams capabilities

The following list presents the set of Teams capabilities which are currently available in the Azure Communication Services Calling SDKs.

|Group of features        | Teams capability                                | JS        | Windows | Java (Android) | Objective-C (iOS) |
|-------------------------|-------------------------------------------------|-----------|-------- | -------------- | ----------------- |
| Core Capabilities       | External access                                 |   ✔️      |  ❌    | ❌             | ❌               |
|                         | Guest access                                    |   ✔️      |  ❌    | ❌             | ❌               |
|                         | Automatic people admit in the Lobby             |   ✔️      |  ❌    | ❌             | ❌               |
|                         | Teams meeting role enforcement                  |   ✔️      |  ❌    | ❌             | ❌               |
| Mid call control        |Call forwarding                                  |   ❌      |  ❌    | ❌             | ❌               |
|                         |Simultaneous ringing                             |   ❌      |  ❌    | ❌             | ❌               |
|                         |Music on hold                                    |   ❌      |  ❌    | ❌             | ❌               |
|                         |Call parking                                     |   ❌      |  ❌    | ❌             | ❌               |
|                         |Call transfer                                    |   ✔️      |  ❌    | ❌             | ❌               |
|                         |Merge ongoing calls                              |   ❌      |  ❌    | ❌             | ❌               |
|                         |Voicemail                                        |   ❌      |  ❌    | ❌             | ❌               |
|                         |Call delegation                                  |   ❌      |  ❌    | ❌             | ❌               |
|                         |Teams call recording                             |   ❌      |  ❌    | ❌             | ❌               |
|                         |Teams transcription                              |   ❌      |  ❌    | ❌             | ❌               |
|                         |Teams live captions                              |   ❌      |  ❌    | ❌             | ❌               |
| PSTN                    |Emergency calling                                |   ❌      |   ❌    | ❌             | ❌               |
|                         |Location based routing                           |   ❌      |  ❌    | ❌             | ❌               |
|                         |Branch office survivability                      |   ❌      |  ❌    | ❌             | ❌               |
| Compliance              | Information barrier                             |   ✔️      |  ❌    | ❌             | ❌               |

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
