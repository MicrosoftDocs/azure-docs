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
ms.subservice: calling
---
# Calling capabilities supported for Teams users in Calling SDK

The Azure Communication Services Calling SDK for JavaScript enables Teams user devices to drive voice and video communication experiences. This page provides detailed descriptions of Calling features, including platform and browser support information. To get started right away, check out [Calling quickstarts](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md). 

Key features of the Calling SDK:

- **Addressing** - Azure Communication Services is using [Azure Active Directory user identifier](/powershell/module/azuread/get-azureaduser) to address communication endpoints. Clients use Azure Active Directory identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provide clients visibility into who is connected to a call (the roster). And are also used in [Microsoft Graph API](/graph/api/user-get).
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire. 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications data plane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **PSTN** - The Calling SDK can receive and initiate voice calls with the traditional publicly switched telephony system [using phone numbers you acquire in the Teams Admin Portal](/microsoftteams/pstn-connectivity).
- **Teams Meetings** - The Calling SDK can [join Teams meetings](../../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with the Teams voice and video data plane. 
- **Notifications** - The Calling SDK provides APIs that allow clients to be notified of an incoming call. In situations where your app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform users of an incoming call. 

## Calling capabilities 

The following list presents the set of features that are currently available in the Azure Communication Services Calling SDK for JavaScript when participating in 1:1 voice-over-IP (VoIP) or group VoIP calls.

| Group of features | Capability                                                                                                          | JavaScript |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | 
| Core Capabilities | Place a one-to-one call to Teams user                                                                               | ✔️        |
|                   | Place a one-to-one call to Azure Communication Services user                                                        | ❌        |
|                   | Place a group call with more than two Teams users (up to 350 users)                                                 | ✔️        |
|                   | Promote a one-to-one call with two Teams users into a group call with more than two Teams users                     | ✔️        |
|                   | Join a group call after it has started                                                                              | ❌        |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️        |
|                   | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️        |
|                   | Placing a call honors Teams external access configuration                                                           |   ✔️      |
|                   | Placing a call honors Teams guest access configuration                                                              |   ✔️      |
| Mid call control  | Turn your video on/off                                                                                              | ✔️        |
|                   | Mute/Unmute mic                                                                                                     | ✔️        |
|                   | Switch between cameras                                                                                              | ✔️        |
|                   | Local hold/un-hold                                                                                                  | ✔️        |
|                   | Indicator of dominant speakers in the call                                                                          | ✔️        |
|                   | Choose speaker device for calls                                                                                     | ✔️        |
|                   | Choose microphone for calls                                                                                         | ✔️        |
|                   | Indicator of participant's state<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*    | ✔️        |
|                   | Indicator of call's state <br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️        |
|                   | Indicate participants being muted                                                                                   | ✔️        |
|                   | Indicate participants' reasons for terminating the call                                                             | ✔️        |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️        |
|                   | Share content in "content-only" mode                                                                                | ✔️        |
|                   | Receive video stream with content for "content-only" screen sharing experience                                      | ✔️        |
|                   | Share content in "standout" mode                                                                                    | ❌        |
|                   | Receive video stream with content for a "standout" screen sharing experience                                          | ❌        |
|                   | Share content in "side-by-side" mode                                                                                | ❌        |
|                   | Receive video stream with content for "side-by-side" screen sharing experience                                      | ❌        |
|                   | Share content in "reporter" mode                                                                                    | ❌        |
|                   | Receive video stream with content for "reporter" screen sharing experience                                          | ❌        |
| Roster            | List participants                                                                                                   | ✔️        |
|                   | Add an Azure Communication Services user                                                                             | ❌        |
|                   | Add a Teams user                                                                                                    | ✔️        |
|                   | Adding Teams users honors Teams external access configuration                                                        |   ✔️      |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      |
|                   | Add a phone number                                                                                                  | ✔️        |
|                   | Remove a participant                                                                                                | ✔️        |
|                   | Adding Teams users honors information barriers                                                                       |   ✔️      |
| Device Management | Ask for permission to use audio and/or video                                                                        | ✔️        |
|                   | Get camera list                                                                                                     | ✔️        |
|                   | Set camera                                                                                                          | ✔️        |
|                   | Get selected camera                                                                                                 | ✔️        |
|                   | Get microphone list                                                                                                 | ✔️        |
|                   | Set microphone                                                                                                      | ✔️        |
|                   | Get selected microphone                                                                                             | ✔️        |
|                   | Get speakers list                                                                                                   | ✔️        |
|                   | Set speaker                                                                                                         | ✔️        |
|                   | Get selected speaker                                                                                                | ✔️        |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️        |
|                   | Set / update scaling mode                                                                                           | ✔️        |
|                   | Render remote video stream                                                                                          | ✔️        |

Support for streaming, timeouts, platforms, and browsers is shared with [Communication Services calling SDK overview](./../voice-video-calling/calling-sdk-features.md).

## Detailed Teams capabilities

The following list presents the set of Teams capabilities, which are currently available in the Azure Communication Services Calling SDK for JavaScript.

|Group of features        | Teams capability                                                                     | JS        |
|-------------------------|--------------------------------------------------------------------------------------|------------|
| Core Capabilities       | Placing a call honors Teams external access configuration                            |   ✔️      |
|                         | Placing a call honors Teams guest access configuration                               |   ✔️      |
|                         | Joining Teams meeting honors configuration for automatic people admit in the Lobby   |   ✔️      |
|                         | Actions available in the Teams meeting are defined by assigned role                  |   ✔️      |
| Mid call control        | Receive forwarded call                                                               |   ✔️      |
|                         | Receive simultaneous ringing                                                         |   ✔️      |
|                         | Play music on hold                                                                   |   ❌      |
|                         | Park a call                                                                          |   ❌      |
|                         | Transfer a call to a person                                                          |   ✔️      |
|                         | Transfer a call to a call                                                            |   ✔️      |
|                         | Transfer a call to Voicemail                                                         |   ❌      |
|                         | Merge ongoing calls                                                                  |   ❌      |
|                         | Place a call on behalf of the user                                                       |   ❌      |
|                         | Start call recording                                                                 |   ❌      |
|                         | Start call transcription                                                             |   ❌      |
|                         | Start live captions                                                                  |   ❌      |
|                         | Receive information of call being recorded                                           |   ✔️      |
| PSTN                    | Make an Emergency call                                                               |   ✔️      |
|                         | Place a call honors location-based routing                                           |   ❌      |
|                         | Support for survivable branch appliance                                              |   ❌      |
| Phone system            | Receive a call from Teams auto attendant                                             |   ✔️      |
|                         | Transfer a call to Teams auto attendant                                              |   ✔️      |
|                         | Receive a call from Teams call queue (only conference mode)                          |   ✔️      |
|                         | Transfer a call from Teams call queue (only conference mode)                         |   ✔️      |
| Compliance              | Place a call honors information barriers                                             |   ✔️      |
|                         | Support for compliance recording                                                     |   ✔️      |
| Meeting                 | [Include participant in Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ❌ |


## Teams meeting options

Teams meeting organizers can configure the Teams meeting options to adjust the experience for participants. The following options are supported in Azure Communication Services for Teams users:

|Option name|Description| Supported |
| --- | --- | --- |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | Teams user can bypass the lobby, if Teams meeting organizer set value to include "people in my organization" for single tenant meetings and "people in trusted organizations" for cross-tenant meetings. Otherwise, Teams users have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Always let callers bypass the lobby](/microsoftteams/meeting-policies-participants-and-guests#allow-dial-in-users-to-bypass-the-lobby)| Participants joining through phone can bypass lobby | Not applicable |
| Announce when callers join or leave| Participants hear announcement sounds when phone participants join and leave the meeting | ✔️ |
| [Choose co-organizers](https://support.microsoft.com/office/add-co-organizers-to-a-meeting-in-teams-0de2c31c-8207-47ff-ae2a-fc1792d466e2)|  Teams user can be selected as co-organizer. It affects the availability of actions in Teams meetings. | ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | Controls who in the Teams meeting can share screen.  | ❌ |
|[Manage what attendees see](https://support.microsoft.com/office/spotlight-someone-s-video-in-a-teams-meeting-58be74a4-efac-4e89-a212-8d198182081e)|Teams organizer, co-organizer and presenter can spotlight videos for everyone. Azure Communication Services does not receive the spotlight signals. |❌|
|[Allow mic for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local audio |✔️|
|[Allow camera for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local video |✔️|
|[Record automatically](/graph/api/resources/onlinemeeting)|Records meeting when anyone starts the meeting. The user in the lobby does not start a recording.|✔️|
|Allow meeting chat|If enabled, Teams users can use the chat associated with the Teams meeting.|✔️|
|[Allow reactions](/microsoftteams/meeting-policies-in-teams-general#meeting-reactions)|If enabled, Teams users can use reactions in the Teams meeting. Azure Communication Services doesn't support reactions. |❌|
|[RTMP-IN](/microsoftteams/stream-teams-meetings)|If enabled, organizers can stream meetings and webinars to external endpoints by providing a Real-Time Messaging Protocol (RTMP) URL and key to the built-in Custom Streaming app in Teams. |Not applicable|
|[Provide CART Captions](https://support.microsoft.com/office/use-cart-captions-in-a-microsoft-teams-meeting-human-generated-captions-2dd889e8-32a8-4582-98b8-6c96cf14eb47)|Communication access real-time translation (CART) is a service in which a trained CART captioner listens to the speech and instantaneously translates all speech to text. As a meeting organizer, you can set up and offer CART captioning to your audience instead of the Microsoft Teams built-in live captions that are automatically generated.|❌|
|                   | See together mode video stream                                                                                      | ❌ |
|                   | See Large gallery view                                                                                              | ❌ |
|                   | Receive video stream from Teams media bot                                                                           | ❌ |
|                   | Receive adjusted stream for "content from Camera"                                                                   | ❌ |
|                   | Add and remove video stream from spotlight                                                                          | ❌ |
|                   | Allow video stream to be selected for spotlight                                                                     | ❌ |
|                   | Apply Teams background effects                                                                                      | ❌ |
| Recording & transcription | Manage Teams convenient recording                                                                           | ❌ |
|                   | Receive information of call being recorded                                                                          |   ✔️      |
|                   | Manage Teams transcription                                                                                          | ❌ |
|                   | Receive information of call being transcribed                                                                       |   ✔️      |
|                   | Manage Teams closed captions                                                                                        | ❌ |
|                   | Support for compliance recording                                                                                    |   ✔️      |
| Engagement        | Raise and lower hand                                                                                                | ❌ |
|                   | Indicate other participants' raised and lowered hands | ❌ |
|                   | Trigger reactions                                                                                                   | ❌ |
|                   | Indicate other participants' reactions                                                                              | ❌ |
| Integrations      | Control Teams third-party applications                                                                              | ❌ |
|                   | Receive PowerPoint Live stream                                                                                      | ❌ |
|                   | Receive Whiteboard stream                                                                                           | ❌ |
|                   | Interact with a poll                                                                                                | ❌ |
|                   | Interact with a Q&A                                                                                                 | ❌ |
| Accessibility     | Receive closed captions                                                                                             | ❌ |
| Advanced call routing   | Does start a call and add user operations honor forwarding rules                                              |   ✔️      |
|                   | Read and configure call forwarding rules                                                                             |   ❌      |
|                   | Does start a call and add user operations honor simultaneous ringing                                                 |   ✔️      |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      |
|                   | Placing participant on hold plays music on hold                                                                      |   ❌      |
|                   | Being placed by Teams user on Teams client on hold plays music on hold                                               |   ✔️      |
|                   | Park a call                                                                                                          |   ❌      |
|                   | Be parked                                                                                                            |   ✔️      |
|                   | Transfer a call to a user                                                                                           |   ✔️      |
|                   | Be transferred to a user or call                                                                                     |   ✔️      |
|                   | Transfer a call to a call                                                                                            |   ✔️      |
|                   | Transfer a call to Voicemail                                                                                         |   ❌      |
|                   | Be transferred to voicemail                                                                                           |   ✔️      |
|                   | Merge ongoing calls                                                                                                  |   ❌      |
|                   | Does start a call and add user operations honor shared line configuration                                            |   ✔️      |
|                   | Start a call on behalf of the Teams user                                                                             |   ❌      |
|                   | Read and configure shared line configuration                                                                         |   ❌      |
|                   | Receive a call from Teams auto attendant                                                                             |   ✔️      |
|                   | Transfer a call to Teams auto attendant                                                                              |   ✔️      |
|                   | Receive a call from Teams call queue                                                                                 |   ✔️      |
|                   | Transfer a call from Teams call queue                                                                                |   ✔️      |
| Teams calling policy | Honor "Make private calls"                                                                                        |   ✔️      |
|                   | Honor setting "Cloud recording for calling"                                                                          |   No API available |
|                   | Honor setting "Transcription"                                                                                        |   No API available |
|                   | Honor setting "Call forwarding and simultaneous ringing to people in your organization"                              |   ✔️      |
|                   | Honor setting "Call forwarding and simultaneous ringing to external phone numbers"                                   |   ✔️      |
|                   | Honor setting "Voicemail is available for routing inbound calls"                                                     |   ✔️      |
|                   | Honor setting "Inbound calls can be routed to call groups"                                                           |   ✔️      |
|                   | Honor setting "Delegation for inbound and outbound calls"                                                            |   ✔️      |
|                   | Honor setting "Prevent toll bypass and send calls through the PSTN"                                                  |   ❌      |
|                   | Honor setting "Music on hold"                                                                                        |   ❌      |
|                   | Honor setting "Busy on busy when in a call"                                                                          |   ❌      |
|                   | Honor setting "Web PSTN calling"                                                                                     |   ❌      |
|                   | Honor setting "Real-time captions in Teams calls"                                                                    |   No API available |
|                   | Honor setting "Automatically answer incoming meeting invites"                                                        |   ❌      |
|                   | Honor setting "Spam filtering"                                                                                       |   ✔️      |
|                   | Honor setting "SIP devices can be used for calls"                                                                    |   ✔️      |
| DevOps            | [Azure Metrics](../metrics.md)                                                                                   | ✔️ |
|                   | [Azure Monitor](../logging-and-diagnostics.md)                                                                   | ✔️ |
|                   | [Azure Communication Services Insights](../analytics/insights.md)                                                | ✔️ |
|                   | [Azure Communication Services Voice and video calling events](../../../event-grid/communication-services-voice-video-events.md) | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ |
|                   | [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ |

Support for streaming, timeouts, platforms, and browsers is shared with [Communication Services calling SDK overview](../voice-video-calling/calling-sdk-features.md).


## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
