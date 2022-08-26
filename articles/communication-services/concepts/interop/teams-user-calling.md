---
title: Azure Communication Services Teams identity overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the support for Teams identity in Azure Communication Services Calling SDK.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 12/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---
# Support for Teams identity in Calling SDK

The Azure Communication Services Calling SDK for JavaScript enables Teams user devices to drive voice and video communication experiences. This page provides detailed descriptions of Calling features, including platform and browser support information. To get started right away, check out [Calling quickstarts](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md). 

Key features of the Calling SDK:

- **Addressing** - Azure Communication Services is using [Azure Active Directory user identifier](/powershell/module/azuread/get-azureaduser) to address communication endpoints. Clients use Azure Active Directory identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provide clients visibility into who is connected to a call (the roster). And are also used in [Microsoft Graph API](/graph/api/user-get).
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire. 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications data plane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **PSTN** - The Calling SDK can receive and initiate voice calls with the traditional publicly switched telephony system [using phone numbers you acquire in the Teams Admin Portal](/microsoftteams/pstn-connectivity).
- **Teams Meetings** - The Calling SDK can [join Teams meetings](../../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with the Teams voice and video data plane. 
- **Notifications** - The Calling SDK provides APIs that allow clients to be notified of an incoming call. In situations where your app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform users of an incoming call. 

## Detailed Azure Communication Services capabilities 

The following list presents the set of features that are currently available in the Azure Communication Services Calling SDK for JavaScript.

| Group of features | Capability                                                                                                          | JavaScript |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | 
| Core Capabilities | Place a one-to-one call between two users                                                                           | ✔️        |
|                   | Place a group call with more than two users (up to 350 users)                                                       | ✔️        |
|                   | Promote a one-to-one call with two users into a group call with more than two users                                 | ✔️        |
|                   | Join a group call after it has started                                                                              | ✔️        |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️        |
|                   | Join Teams meeting                                                                                                  | ✔️        |
| Mid call control  | Turn your video on/off                                                                                              | ✔️        |
|                   | Mute/Unmute mic                                                                                                     | ✔️        |
|                   | Switch between cameras                                                                                              | ✔️        |
|                   | Local hold/un-hold                                                                                                  | ✔️        |
|                   | Active speaker                                                                                                      | ✔️        |
|                   | Choose speaker for calls                                                                                            | ✔️        |
|                   | Choose microphone for calls                                                                                         | ✔️        |
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*         | ✔️        |
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️        |
|                   | Show if a participant is muted                                                                                      | ✔️        |
|                   | Show the reason why a participant left a call                                                                       | ✔️        |
|                   | Admit participant in the lobby into the Teams meeting                                                               | ❌        |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️        |
|                   | Participant can view remote screen share                                                                            | ✔️        |
| Roster            | List participants                                                                                                   | ✔️        |
|                   | Remove a participant                                                                                                | ✔️        |
| PSTN              | Place a one-to-one call with a PSTN participant                                                                     | ✔️        |
|                   | Place a group call with PSTN participants                                                                           | ✔️        |
|                   | Promote a one-to-one call with a PSTN participant into a group call                                                 | ✔️        |
|                   | Dial-out from a group call as a PSTN participant                                                                    | ✔️        |
|                   | Support for early media                                                                                            | ❌        |
| General           | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️        |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️        |
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
| Meeting                 | [Include participant in Teams meeting attendance report](/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ❌ |


## Teams meeting options

Teams meeting organizers can configure the Teams meeting options to adjust the experience for participants. The following options are supported in Azure Communication Services for Teams users:

|Option name|Description| Supported |
| --- | --- | --- |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | Teams user can bypass the lobby, if Teams meeting organizer set value to include "people in my organization" for single tenant meetings and "people in trusted organizations" for cross-tenant meetings. Otherwise, Teams users have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Always let callers bypass the lobby](/microsoftteams/meeting-policies-participants-and-guests#allow-dial-in-users-to-bypass-the-lobby)| Participants joining through phone can bypass lobby | Not applicable |
| Announce when callers join or leave| Participants hear announcement sounds when phone participants join and leave the meeting | ✔️ |
| [Choose co-organizers](/office/add-co-organizers-to-a-meeting-in-teams-0de2c31c-8207-47ff-ae2a-fc1792d466e2)|  Teams user can be selected as co-organizer. It affects the availability of actions in Teams meetings. | ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | Controls who in the Teams meeting can share screen.  | ❌ |
|[Manage what attendees see](/office/spotlight-someone-s-video-in-a-teams-meeting-58be74a4-efac-4e89-a212-8d198182081e)|Teams organizer, co-organizer and presenter can spotlight videos for everyone. Azure Communication Services does not receive the spotlight signals. |❌|
|[Allow mic for attendees](/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local audio |✔️|
|[Allow camera for attendees](/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local video |✔️|
|[Record automatically](/graph/api/resources/onlinemeeting)|Records meeting when anyone starts the meeting. The user in the lobby does not start a recording.|✔️|
|Allow meeting chat|If enabled, Teams users can use the chat associated with the Teams meeting.|✔️|
|[Allow reactions](/microsoftteams/meeting-policies-in-teams-general#meeting-reactions)|If enabled, Teams users can use reactions in the Teams meeting. Azure Communication Sevices don't support reactions. |❌|
|[RTMP-IN](/microsoftteams/stream-teams-meetings)|If enabled, organizers can stream meetings and webinars to external endpoints by providing a Real-Time Messaging Protocol (RTMP) URL and key to the built-in Custom Streaming app in Teams. |Not applicable|
|[Provide CART Captions](/office/use-cart-captions-in-a-microsoft-teams-meeting-human-generated-captions-2dd889e8-32a8-4582-98b8-6c96cf14eb47)|Communication access real-time translation (CART) is a service in which a trained CART captioner listens to the speech and instantaneously translates all speech to text. As a meeting organizer, you can set up and offer CART captioning to your audience instead of the Microsoft Teams built-in live captions that are automatically generated.|❌|


## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
