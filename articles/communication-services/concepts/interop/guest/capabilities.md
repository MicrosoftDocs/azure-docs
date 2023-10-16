---
title: Capabilities for Teams external user
titleSuffix: An Azure Communication Services concept document
description: Calling capabilities of Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams meeting capabilities for Teams external users

In this article, you will learn which capabilities are supported for Teams external users using Azure Communication Services SDKs in Teams meetings. You can find per platform availability in [voice and video calling capabilities](../../voice-video-calling/calling-sdk-features.md).


| Group of features | Capability                                                                                                          | Supported |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | 
| Core Capabilities | Join Teams meeting                                                                                                  | ✔️        |
|                   | Leave meeting                                                                                                       | ✔️ |
|                   | End meeting for everyone                                                                                            | ✔️ |
|                   | Change meeting options                                                                                              | ❌ |
|                   | Lock & unlock meeting                                                                                               | ❌ |
|                   | Prevent joining locked meeting                                                                                      | ✔️        |
|                   | Honor assigned Teams meeting role                                                                                   |   ✔️      |
| Chat              | Send and receive chat messages                                                                                      | ✔️ |
|                   | [Receive inline images](../../../tutorials/chat-interop/meeting-interop-features-inline-image.md)                                                                    | ✔️ |
|                   | Send inline images                                                                                                        | ❌ |
|                   | [Receive file attachments](../../../tutorials/chat-interop/meeting-interop-features-file-attachment.md)                                                                                                           | ✔️ |
|                   | Send file attachments                                                                                                        | ❌ |
|                   | Send and receive Giphy                                                                                              | ❌ |
|                   | Send messages with high priority                                                                                    | ❌ |
|                   | Receive messages with high priority                                                                                 | ✔️ |
|                   | Send and receive Loop components                                                                                    | ❌ |
|                   | Send and receive Emojis                                                                                             | ❌ |
|                   | Send and receive Stickers                                                                                           | ❌ |
|                   | Send and receive Teams messaging extensions                                                                         | ❌ |
|                   | Use typing indicators                                                                                               | ✔️ |
|                   | Read receipt                                                                                                        | ❌ |
|                   | Reply to specific chat message                                                                                      | ❌ |
|                   | React to chat message                                                                                               | ❌ |
|                   | [Data Loss Prevention (DLP)](/microsoft-365/compliance/dlp-microsoft-teams)                                         | ✔️*|
|                   | [Customer Managed Keys (CMK)](/microsoft-365/compliance/customer-key-overview)                                      | ✔️ |
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
|                   | Get associated toll and toll-free phone numbers with the meeting                                                    | ✔️        |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️        |
|                   | Receive your screen sharing stream                                                                                  | ❌        |
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
|                   | Adding Teams user honors Teams external access configuration                                                        |   ✔️      |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      |
|                   | Add a phone number                                                                                                  | ✔️        |
|                   | Remove a participant                                                                                                | ✔️        |
|                   | Manage breakout rooms                                                                                               | ❌ |
|                   | Participation in breakout rooms                                                                                     | ❌ |
|                   | Admit participants in the lobby into the Teams meeting                                                               | ✔️        |
|                   | Be admitted from the lobby into the Teams meeting                                                                   | ✔️        |
|                   | Promote participant to a presenter or attendee                                                                        | ❌        |
|                   | Be promoted to presenter or attendee                                                                                | ✔️        |
|                   | Disable or enable mic for attendees                                                                                 | ❌        |
|                   | Honor disabling or enabling a mic as an attendee | ✔️        |
|                   | Disable or enable camera for attendees                                                                              | ❌        |
|                   | Honor disabling or enabling a camera as an attendee | ✔️        |
|                   | Adding Teams user honors information barriers                                                                       |   ✔️      |
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
|                   | See together mode video stream                                                                                      | ❌ |
|                   | See Large gallery view                                                                                              | ❌ |
|                   | Receive video stream from Teams media bot                                                                           | ❌ |
|                   | Receive adjusted stream for "content from Camera"                                                                   | ❌ |
|                   | Add and remove video stream from spotlight                                                                          | ✔️ |
|                   | Allow video stream to be selected for spotlight                                                                     | ✔️ |
|                   | Apply Teams background effects                                                                                      | ❌ |
| Recording & transcription | Manage Teams convenient recording                                                                           | ❌ |
|                   | Receive information of call being recorded                                                                          |   ✔️      |
|                   | Manage Teams transcription                                                                                          | ❌ |
|                   | Receive information of call being transcribed                                                                       |   ✔️      |
|                   | Manage Teams closed captions                                                                                        | ❌ |
|                   | Support for compliance recording                                                                                    |   ✔️      |
|                   | [Azure Communication Services recording](../../voice-video-calling/call-recording.md)                               |   ❌      |
| Engagement        | Raise and lower hand                                                                                                | ✔️ |
|                   | Indicate other participants' raised and lowered hands                                                               | ✔️ |
|                   | Trigger reactions                                                                                                   | ❌ |
|                   | Indicate other participants' reactions                                                                              | ❌ |
| Integrations      | Control Teams third-party applications                                                                              | ❌ |
|                   | Receive PowerPoint Live stream                                                                                      | ❌ |
|                   | Receive Whiteboard stream                                                                                           | ❌ |
|                   | Interact with a poll                                                                                                | ❌ |
|                   | Interact with a Q&A                                                                                                 | ❌ |
|                   | Interact with a OneNote                                                                                             | ❌ |
|                   | Manage SpeakerCoach                                                                                                 | ❌ |
| | [Include participant in Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ✔️ |
| Accessibility     | Receive closed captions                                                                                             | ❌ |
|                   | Communication access real-time translation (CART)                                                                   | ❌ |
|                   | Language interpretation                                                                                             | ❌ |
| Advanced call routing   | Does meeting dial-out honor forwarding rules                                                                   |   ✔️      |
|                   | Read and configure call forwarding rules                                                                             |   ❌      |
|                   | Does meeting dial-out honor simultaneous ringing                                                                     |   ✔️      |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      |
|                   | Does meeting dial-out honor shared line configuration                                                                |   ✔️      |
|                   | Dial-out from meeting on behalf of the Teams user                                                                    |   ❌      |
|                   | Read and configure shared line configuration                                                                        |   ❌      |
| Teams meeting policy | Honor setting "Let anonymous people join a meeting"                                                              |   ✔️      |
|                   | Honor setting "Mode for IP audio"                                                                                   | ❌ |
|                   | Honor setting "Mode for IP video"                                                                                   | ❌ |
|                   | Honor setting "IP video"                                                                                            | ❌ |
|                   | Honor setting "Local broadcasting"                                                                                  | ❌ |
|                   | Honor setting "Media bit rate (Kbs)"                                                                                | ❌ |
|                   | Honor setting "Network configuration lookup"                                                                        | ❌ |
|                   | Honor setting "Transcription"                                                                                       | No API available |
|                   | Honor setting "Cloud recording"                                                                                     | No API available |
|                   | Honor setting "Meetings automatically expire"                                                                       | ✔️ |
|                   | Honor setting "Default expiration time"                                                                             | ✔️ |
|                   | Honor setting "Store recordings outside of your country or region"                                                  | ✔️ |
|                   | Honor setting "Screen sharing mode"                                                                                 | No API available |
|                   | Honor setting "Participants can give or request control"                                                            | No API available |
|                   | Honor setting "External participants can give or request control"                                                   | No API available |
|                   | Honor setting "PowerPoint Live"                                                                                     | No API available |
|                   | Honor setting "Whiteboard"                                                                                          | No API available |
|                   | Honor setting "Shared notes"                                                                                        | No API available |
|                   | Honor setting "Select video filters"                                                                                | ❌ |
|                   | Honor setting "Let anonymous people start a meeting"                                                                |   ✔️      | 
|                   | Honor setting "Who can present in meetings"                                                                         |   ❌      |
|                   | Honor setting "Automatically admit people"                                                                          |   ✔️      |
|                   | Honor setting "Dial-in users can bypass the lobby"                                                                  |   ✔️      |
|                   | Honor setting "Meet now in private meetings"                                                                        |   ✔️      |
|                   | Honor setting "Live captions"                                                                                       |   No API available |
|                   | Honor setting "Chat in meetings"                                                                                    |   ✔️      |
|                   | Honor setting "Teams Q&A"                                                                                           |   No API available |
|                   | Honor setting "Meeting reactions"                                                                                   |   No API available |
| DevOps            | [Azure Metrics](../../metrics.md)                                                                                   | ✔️ |
|                   | [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                   | ✔️ |
|                   | [Azure Communication Services Insights](../../analytics/insights/voice-and-video-insights.md)                                                | ✔️ |
|                   | [Azure Communication Services Voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ |
|                   | [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ |

When Teams external users leave the meeting, or the meeting ends, they can no longer send or receive new chat messages and no longer have access to messages sent and received during the meeting. 

*Azure Communication Services provides developers tools to integrate Microsoft Teams Data Loss Prevention that is compatible with Microsoft Teams. For more information, go to [how to implement Data Loss Prevention (DLP)](../../../how-tos/chat-sdk/data-loss-prevention.md)


## Server capabilities

The following table shows supported server-side capabilities available in Azure Communication Services:

|Capability | Supported |
| --- | --- |
| [Manage ACS call recording](../../voice-video-calling/call-recording.md)                                                        | ❌ |
| [Azure Metrics](../../metrics.md)                                                                                               | ✔️ |
| [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                                  | ✔️ |
| [Azure Communication Services Insights](../../analytics/insights/voice-and-video-insights.md)                                                            | ✔️ |
| [Azure Communication Services Voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |


## Teams capabilities

The following table shows supported Teams capabilities:

|Capability | Supported |
| --- | --- |
| [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)              | ✔️ |
| [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality) | ❌ |
| [Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ✔️ |

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/identity/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
