---
title: Calling capabilities for Teams users
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of supported calling capabilities for Teams users in Azure Communication Services Calling SDK.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 12/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: has-azure-ad-ps-ref
---
# Calling capabilities supported for Teams users in Calling SDK

The Azure Communication Services Calling SDK enables Teams user devices to drive voice and video communication experiences. This page provides detailed descriptions of Calling features, including platform and browser support information. To get started right away with JavaScript, check out [Calling quickstarts](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md). 

Key features of the Calling SDK:

- **Addressing** - Azure Communication Services is using [Microsoft Entra user identifier](/powershell/module/azuread/get-azureaduser) to address communication endpoints. Clients use Microsoft Entra identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provide clients visibility into who is connected to a call (the roster). And are also used in [Microsoft Graph API](/graph/api/user-get).
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire. 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications data plane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **Notifications** - The Calling SDK provides APIs that allow clients to be notified of an incoming call. In situations where your app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform users of an incoming call. 

## Calling capabilities 

The following list presents the set of features that are currently available in the Azure Communication Services Calling SDK when participating in 1:1 voice-over-IP (VoIP) or group VoIP calls.

| Group of features | Capability                                                                                                          | JavaScript |	Windows | Java (Android) |	Objective-C (iOS)|
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | -------------------- | ----------------- |
| Core Capabilities | Place a one-to-one call to Teams user                                                                               | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Place a one-to-one call to Azure Communication Services user                                                        | ❌        | ❌ | ❌ | ❌ |
|                   | Place a group call with more than two Teams users (up to 350 users)                                                 | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Promote a one-to-one call with two Teams users into a group call with more than two Teams users                     | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Join a group call after it has started                                                                              | ❌        | ❌ | ❌ | ❌ |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Placing a call honors Teams external access configuration                                                           |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Placing a call honors Teams guest access configuration                                                              |   ✔️      | ✔️ | ✔️ | ✔️ |
| Mid call control  | Turn your video on/off                                                                                              | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Mute/Unmute mic                                                                                                     | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Switch between cameras                                                                                              | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Local hold/un-hold                                                                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Indicator of dominant speakers in the call                                                                          | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Choose speaker device for calls                                                                                     | ✔️        | ✔️ | ❌<sup>2</sup> | ❌<sup>2</sup> |
|                   | Choose microphone for calls                                                                                         | ✔️        | ✔️ | ❌<sup>2</sup> | ❌<sup>2</sup> |
|                   | Indicator of participant's state<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*    | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Indicator of call's state <br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Indicate participants being muted                                                                                   | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Indicate participants' reasons for terminating the call                                                             | ✔️        | ✔️ | ✔️ | ✔️ |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        | ✔️<sup>1</sup>  | ✔️<sup>1</sup> | ✔️<sup>1</sup> |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        | ✔️<sup>1</sup> | ❌ | ❌ |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Receive your screen sharing stream                                                                                  | ❌        | ❌ | ❌ | ❌ |
|                   | Share content in "content-only" mode                                                                                | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Receive video stream with content for "content-only" screen sharing experience                                      | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Share content in "standout" mode                                                                                    | ❌        | ❌ | ❌ | ❌ |
|                   | Receive video stream with content for a "standout" screen sharing experience                                        | ❌        | ❌ | ❌ | ❌ |
|                   | Share content in "side-by-side" mode                                                                                | ❌        | ❌ | ❌ | ❌ |
|                   | Receive video stream with content for "side-by-side" screen sharing experience                                      | ❌        | ❌ | ❌ | ❌ |
|                   | Share content in "reporter" mode                                                                                    | ❌        | ❌ | ❌ | ❌ |
|                   | Receive video stream with content for "reporter" screen sharing experience                                          | ❌        | ❌ | ❌ | ❌ |
|                   | Share system audio during screen sharing                                                                            | ✔️        | ❌ | ❌ | ❌ |
| Roster            | List participants                                                                                                   | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Add an Azure Communication Services user                                                                             | ❌        | ❌ | ❌ | ❌ |
|                   | Add a Teams user                                                                                                    | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Adding Teams users honors Teams external access configuration                                                        |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Add a phone number                                                                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Remove a participant                                                                                                | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Admit participants in the lobby into the Teams meeting                                                             |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Be admitted from the lobby into the Teams meeting                                                                   |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Adding Teams users honors information barriers                                                                       |   ✔️      | ✔️ | ✔️ | ✔️ |
| Device Management | Ask for permission to use audio and/or video                                                                        | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get camera list                                                                                                     | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Set camera                                                                                                          | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get selected camera                                                                                                 | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get microphone list                                                                                                 | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Set microphone                                                                                                      | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get selected microphone                                                                                             | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get speakers list                                                                                                   | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Set speaker                                                                                                         | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Get selected speaker                                                                                                | ✔️        | ✔️ | ✔️ | ✔️ |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Set / update scaling mode                                                                                           | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Render remote video stream                                                                                          | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | See together mode video stream                                                                                      | ❌ | ❌ | ❌ | ❌ |
|                   | See Large gallery view                                                                                              | ❌ | ❌ | ❌ | ❌ |
|                   | Receive video stream from Teams media bot                                                                           | ❌ | ❌ | ❌ | ❌ |
|                   | Receive adjusted stream for "content from Camera"                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Add and remove video stream from spotlight                                                                          | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Allow video stream to be selected for spotlight                                                                     | ✔️ | ✔️ | ✔️ | ✔️ |
| Video Effects     | [Background Blur](../../quickstarts/voice-video-calling/get-started-video-effects.md)                               | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Custom background image                                                                                             | ✔️ | ❌ | ❌ | ❌ |
| Recording & transcription | Manage Teams convenient recording                                                                           | ❌ | ❌ | ❌ | ❌ |
|                   | Receive information of call being recorded                                                                          | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Manage Teams transcription                                                                                          | ❌ | ❌ | ❌ | ❌ |
|                   | Receive information of call being transcribed                                                                       | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Manage Teams closed captions                                                                                        | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Support for compliance recording                                                                                    | ✔️ | ✔️ | ✔️ | ✔️ |
| Engagement        | Raise and lower hand                                                                                                | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Indicate other participants' raised and lowered hands                                                               | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Trigger reactions                                                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Indicate other participants' reactions                                                                              | ❌ | ❌ | ❌ | ❌ |
| Integrations      | Control Teams third-party applications                                                                              | ❌ | ❌ | ❌ | ❌ |
|                   | Receive PowerPoint Live stream                                                                                      | ❌ | ❌ | ❌ | ❌ |
|                   | Receive Whiteboard stream                                                                                           | ❌ | ❌ | ❌ | ❌ |
|                   | Interact with a poll                                                                                                | ❌ | ❌ | ❌ | ❌ |
|                   | Interact with a Q&A                                                                                                 | ❌ | ❌ | ❌ | ❌ |
| Advanced call routing   | Start a call and add user operations honor forwarding rules                                              |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Read and configure call forwarding rules                                                                            | ❌ | ❌ | ❌ | ❌ |
|                   | Start a call and add user operations honor simultaneous ringing                                                 |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      | ❌ | ❌ | ❌ |
|                   | Start a call and add user operations honor "Do not disturb" status                                                 |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Placing participant on hold plays music on hold                                                                      |   ❌      | ❌ | ❌ | ❌ |
|                   | Being placed by Teams user on Teams client on hold plays music on hold                                               |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Park a call                                                                                                          |   ❌      | ❌ | ❌ | ❌ |
|                   | Be parked                                                                                                            |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Transfer a call to a user                                                                                           |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Be transferred to a user or call                                                                                     |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Transfer a call to a call                                                                                            |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Transfer a call to Voicemail                                                                                         |   ❌      | ❌ | ❌ | ❌ |
|                   | Be transferred to voicemail                                                                                           |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Merge ongoing calls                                                                                                  |   ❌      | ❌ | ❌ | ❌ |
|                   | Does start a call and add user operations honor shared line configuration                                            |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Start a call on behalf of the Teams user                                                                             |   ❌      | ❌ | ❌ | ❌ |
|                   | Read and configure shared line configuration                                                                         |   ❌      | ❌ | ❌ | ❌ |
|                   | Receive a call from Teams auto attendant                                                                             |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Transfer a call to Teams auto attendant                                                                              |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Receive a call from Teams call queue                                                                                 |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Transfer a call from Teams call queue                                                                                |   ✔️      | ✔️ | ✔️ | ✔️ |
| Teams calling policy | Honor "Make private calls"                                                                                        |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Cloud recording for calling"                                                                          |   No API available | No API available |No API available |No API available |
|                   | Honor setting "Transcription"                                                                                        |   No API available | No API available |No API available |No API available |
|                   | Honor setting "Call forwarding and simultaneous ringing to people in your organization"                              |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Call forwarding and simultaneous ringing to external phone numbers"                                   |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Voicemail is available for routing inbound calls"                                                     |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Inbound calls can be routed to call groups"                                                           |   ✔️      | ✔️ | ✔️ | ✔️ | 
|                   | Honor setting "Delegation for inbound and outbound calls"                                                            |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Prevent toll bypass and send calls through the PSTN"                                                  |   ❌      | ❌ | ❌ | ❌ |
|                   | Honor setting "Music on hold"                                                                                        |   ❌      | ❌ | ❌ | ❌ |
|                   | Honor setting "Busy on busy when in a call"                                                                          |   ❌      | ❌ | ❌ | ❌ |
|                   | Honor setting "Real-time captions in Teams calls"                                                                    |   No API available | No API available |No API available |No API available |
|                   | Honor setting "Spam filtering"                                                                                       |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "SIP devices can be used for calls"                                                                    |   ✔️      | ✔️ | ✔️ | ✔️ |
| DevOps            | [Azure Metrics](../metrics.md)                                                                                       | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Azure Monitor](../analytics/logs/voice-and-video-logs.md)                                                           | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Azure Communication Services Insights](../analytics/insights/voice-and-video-insights.md)                           | ✔️ | ✔️ | ✔️ | ✔️ | 
|                   | [Azure Communication Services Voice and video calling events](../../../event-grid/communication-services-voice-video-events.md) | ❌ | ❌ | ❌ | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ | ❌ | ❌ | ❌ |


1. The Share Screen capability can be achieved using Raw Media, if you want to learn, **how  to add Raw Media**, visit [the quickstart guide](../../quickstarts/voice-video-calling/get-started-raw-media-access.md).
2. The Calling SDK doesn't have an explicit API, you need to use the OS (android & iOS) API to achieve it.

Support for streaming, timeouts, platforms, and browsers is shared with [Communication Services calling SDK overview](../voice-video-calling/calling-sdk-features.md).


## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
