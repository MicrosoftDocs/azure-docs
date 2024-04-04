---
title: Teams meeting capabilities for Teams users
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of supported Teams meeting capabilities for Teams users in Azure Communication Services Calling SDK.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 12/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Teams meeting support for Teams user in Calling SDK

The Azure Communication Services Calling SDK enables Microsoft 365 users to join and participate in voice and video meeting experiences. This page provides detailed descriptions of Teams meeting features. To get started right away, check out [Calling quickstarts](../../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md). 


The following list of capabilities is allowed when Microsoft 365 users participate in Teams meeting:

| Group of features | Capability                                                                                                          | JavaScript |	Windows | Java (Android) |	Objective-C (iOS)|
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | --- | --- | --- |
| Core Capabilities | Join Teams meeting                                                                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Leave meeting                                                                                                       | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | End meeting for everyone                                                                                            | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Change meeting options                                                                                              | ❌ | ❌ | ❌ | ❌ |
|                   | Lock & unlock meeting                                                                                               | ❌ | ❌ | ❌ | ❌ |
|                   | Prevent joining locked meeting                                                                                      | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Honor assigned Teams meeting role                                                                                   |   ✔️      | ✔️ | ✔️ | ✔️ |
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
|                   | Get associated toll and toll-free phone numbers with the meeting                                                    | ✔️        | ❌ | ❌ | ❌ |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        | ✔️<sup>1</sup>  | ✔️<sup>1</sup>  | ✔️<sup>1</sup>  |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        | ✔️<sup>1</sup>  | ❌ | ❌ |
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
|                   | Adding Teams user honors Teams external access configuration                                                        |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Add a phone number                                                                                                  | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Remove a participant                                                                                                | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Manage breakout rooms                                                                                               | ❌ | ❌ | ❌ | ❌ |
|                   | Participation in breakout rooms                                                                                     | ❌ | ❌ | ❌ | ❌ |
|                   | Admit participants in the lobby into the Teams meeting                                                               | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Be admitted from the lobby into the Teams meeting                                                                   | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Promote participant to a presenter or attendee                                                                        | ❌ | ❌ | ❌ | ❌ |
|                   | Be promoted to presenter or attendee                                                                                | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Disable or enable mic for attendees                                                                                 | ❌        | ❌ | ❌ | ❌ |
|                   | Honor disabling or enabling a mic as an attendee                                                                    | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Disable or enable camera for attendees                                                                              | ❌        | ❌ | ❌ | ❌ |
|                   | Honor disabling or enabling a camera as an attendee                                                                 | ✔️        | ✔️ | ✔️ | ✔️ |
|                   | Adding Teams user honors information barriers                                                                       |   ✔️      | ✔️ | ✔️ | ✔️ |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️        | ✔️ | ✔️ | ✔️ |
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
| Video Effects     | [Background Blur](../../../quickstarts/voice-video-calling/get-started-video-effects.md)                               | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Custom background image                                                                                             | ✔️ | ❌ | ❌ | ❌ |
| Recording & transcription | Manage Teams convenient recording                                                                           | ❌ | ❌ | ❌ | ❌ |
|                   | Receive information of call being recorded                                                                          |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Manage Teams transcription                                                                                          | ❌ | ❌ | ❌ | ❌ |
|                   | Receive information of call being transcribed                                                                       |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Support for compliance recording                                                                                    |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | [Azure Communication Services recording](../../voice-video-calling/call-recording.md)                               |   ❌      | ❌ | ❌ | ❌ |
| Engagement        | Raise and lower hand                                                                                                | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Indicate other participants' raised and lowered hands                                                               | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Trigger reactions                                                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Indicate other participants' reactions                                                                              | ❌ | ❌ | ❌ | ❌ |
| Integrations      | Control Teams third-party applications                                                                              | ❌ | ❌ | ❌ | ❌ |
|                   | Receive PowerPoint Live stream                                                                                      | ❌ | ❌ | ❌ | ❌ |
|                   | Receive Whiteboard stream                                                                                           | ❌ | ❌ | ❌ | ❌ |
|                   | Interact with a poll                                                                                                | ❌ | ❌ | ❌ | ❌ |
|                   | Interact with a Q&A                                                                                                 | ❌ | ❌ | ❌ | ❌ |
|                   | Interact with a OneNote                                                                                             | ❌ | ❌ | ❌ | ❌ |
|                   | Manage SpeakerCoach                                                                                                 | ❌ | ❌ | ❌ | ❌ |
| | [Include participant in Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ❌ | ❌ | ❌ | ❌ |
| Accessibility     | Receive closed captions                                                                                             | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Communication access real-time translation (CART)                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Language interpretation                                                                                             | ❌ | ❌ | ❌ | ❌ |
| Advanced call routing   | Does meeting dial-out honor forwarding rules                                                                   |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Read and configure call forwarding rules                                                                             |   ❌      | ❌ | ❌ | ❌ |
|                   | Does meeting dial-out honor simultaneous ringing                                                                     |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      | ❌ | ❌ | ❌ |
|                   | Does meeting dial-out honor shared line configuration                                                                |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Dial-out from meeting on behalf of the Teams user                                                                    |   ❌      | ❌ | ❌ | ❌ |
|                   | Read and configure shared line configuration                                                                        |   ❌      | ❌ | ❌ | ❌ |
| Teams meeting policy | Honor setting "Let anonymous people join a meeting"                                                              |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Mode for IP audio"                                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Mode for IP video"                                                                                   | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "IP video"                                                                                            | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Local broadcasting"                                                                                  | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Media bit rate (kBps)"                                                                                | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Network configuration lookup"                                                                        | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Transcription"                                                                                       | No API available | No API available | No API available | No API available |
|                   | Honor setting "Cloud recording"                                                                                     | No API available | No API available | No API available | No API available |
|                   | Honor setting "Meetings automatically expire"                                                                       | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Default expiration time"                                                                             | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Store recordings outside of your country or region"                                                  | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Screen sharing mode"                                                                                 | No API available | No API available | No API available | No API available |
|                   | Honor setting "Participants can give or request control"                                                            | No API available | No API available | No API available | No API available |
|                   | Honor setting "External participants can give or request control"                                                   | No API available | No API available | No API available | No API available |
|                   | Honor setting "PowerPoint Live"                                                                                     | No API available | No API available | No API available | No API available |
|                   | Honor setting "Whiteboard"                                                                                          | No API available | No API available | No API available | No API available |
|                   | Honor setting "Shared notes"                                                                                        | No API available | No API available | No API available | No API available |
|                   | Honor setting "Select video filters"                                                                                | ❌ | ❌ | ❌ | ❌ |
|                   | Honor setting "Let anonymous people start a meeting"                                                                |   ✔️      |  ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Who can present in meetings"                                                                         |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Automatically admit people"                                                                          |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Dial-in users can bypass the lobby"                                                                  |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Meet now in private meetings"                                                                        |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Live captions"                                                                                       |   No API available | No API available | No API available | No API available |
|                   | Honor setting "Chat in meetings"                                                                                    |   ✔️      | ✔️ | ✔️ | ✔️ |
|                   | Honor setting "Teams Q&A"                                                                                           |   No API available | No API available | No API available | No API available |
|                   | Honor setting "Meeting reactions"                                                                                   |   No API available | No API available | No API available | No API available |
| DevOps            | [Azure Metrics](../../metrics.md)                                                                                   | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                  | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Azure Communication Services Insights](../../analytics/insights/voice-and-video-insights.md)                                                | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Azure Communication Services Voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ | ❌ | ❌ | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ | ❌ | ❌ | ❌ |

1. The Share Screen capability can be achieved using Raw Media, if you want to learn, **how  to add Raw Media**, visit [the quickstart guide](../../../quickstarts/voice-video-calling/get-started-raw-media-access.md).
2. The Calling SDK doesn't have an explicit API, you need to use the OS (android & iOS) API to achieve it.

## Teams meeting options

Teams meeting organizers can configure the Teams meeting options to adjust the experience for participants. The following options are supported in Azure Communication Services for Teams users:

|Option name|Description| Supported |
| --- | --- | --- |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | Teams user can bypass the lobby, if Teams meeting organizer set value to include "people in my organization" for single tenant meetings and "people in trusted organizations" for cross-tenant meetings. Otherwise, Teams users have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Always let callers bypass the lobby](/microsoftteams/meeting-policies-participants-and-guests#allow-dial-in-users-to-bypass-the-lobby)| Participants joining through phone can bypass lobby | Not applicable |
| Announce when callers join or leave| Participants hear announcement sounds when phone participants join and leave the meeting | ✔️ |
| [Choose co-organizers](https://support.microsoft.com/office/add-co-organizers-to-a-meeting-in-teams-0de2c31c-8207-47ff-ae2a-fc1792d466e2)|  Teams user can be selected as co-organizer. It affects the availability of actions in Teams meetings. | ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | Controls who in the Teams meeting can share screen.  | ✔️ |
|[Manage what attendees see](https://support.microsoft.com/office/spotlight-someone-s-video-in-a-teams-meeting-58be74a4-efac-4e89-a212-8d198182081e)|Teams organizer, co-organizer and presenter can spotlight videos for everyone. Azure Communication Services does not receive the spotlight signals. |❌|
|[Allow mic for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local audio |✔️|
|[Allow camera for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If Teams user is attendee, then this option controls whether Teams user can send local video |✔️|
|[Record automatically](/graph/api/resources/onlinemeeting)|Records meeting when anyone starts the meeting. The user in the lobby does not start a recording.|✔️|
|Allow meeting chat|If enabled, Teams users can use the chat associated with the Teams meeting.|✔️|
|[Allow reactions](/microsoftteams/meeting-policies-in-teams-general#meeting-reactions)|If enabled, Teams users can use reactions in the Teams meeting. Azure Communication Services doesn't support reactions. |❌|
|[RTMP-IN](/microsoftteams/stream-teams-meetings)|If enabled, organizers can stream meetings and webinars to external endpoints by providing a Real-Time Messaging Protocol (RTMP) URL and key to the built-in Custom Streaming app in Teams. |Not applicable|
|[Provide CART Captions](https://support.microsoft.com/office/use-cart-captions-in-a-microsoft-teams-meeting-human-generated-captions-2dd889e8-32a8-4582-98b8-6c96cf14eb47)|Communication access real-time translation (CART) is a service in which a trained CART captioner listens to the speech and instantaneously translates all speech to text. As a meeting organizer, you can set up and offer CART captioning to your audience instead of the Microsoft Teams built-in live captions that are automatically generated.|❌|


## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../../call-flows.md)
- Learn about [call types](../../voice-video-calling/about-call-types.md)
