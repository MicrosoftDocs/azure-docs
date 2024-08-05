---
title: Capabilities for Teams external users
titleSuffix: An Azure Communication Services concept document
description: Learn about the calling capabilities of Azure Communication Services support for Teams external users.
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams meeting capabilities for Teams external users

This article describes which capabilities Azure Communication Services SDKs support for Microsoft Teams external users in Teams meetings. For availability by platform, see [Voice and video calling capabilities](../../voice-video-calling/calling-sdk-features.md).


| Group of features | Capability                                                                                                          | Supported |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | 
| Core capabilities | Join Teams meeting via URL                                                                                          | ✔️ |
|                   | Join Teams meeting via meeting ID & passcode                                                                        | ✔️ |
|                   | Join [end-to-end encrypted Teams meeting](/microsoftteams/teams-end-to-end-encryption)                              | ❌ |
|                   | Join channel Teams meeting                                                                                          | ✔️ [1]|
|                   | Join Teams [webinars](/microsoftteams/plan-webinars)                                                                 | ❌ |
|                   | Join Teams [town halls](/microsoftteams/plan-town-halls)                                                            | ❌ |
|                   | Join Teams [live events](/microsoftteams/teams-live-events/what-are-teams-live-events)                             | ❌ |
|                   | Join Teams meeting scheduled in application for [personal use](https://www.microsoft.com/microsoft-teams/teams-for-home) | ❌ |
|                   | Leave meeting                                                                                                       | ✔️ |
|                   | End meeting for everyone                                                                                            | ✔️ |
|                   | Change meeting options                                                                                              | ❌[6] |
|                   | Lock & unlock meeting                                                                                               | ❌[6] |
|                   | Prevent joining locked meeting                                                                                      | ✔️ |
|                   | Honor assigned Teams meeting role                                                                                   | ✔️ |
| Chat              | Send and receive chat messages                                                                                      | ✔️ |
|                   | [Receive inline images](../../../tutorials/chat-interop/meeting-interop-features-inline-image.md)                   | ✔️ |
|                   | Send inline images                                                                                                  | ❌ |
|                   | [Receive file attachments](../../../tutorials/chat-interop/meeting-interop-features-file-attachment.md)             | ✔️ |
|                   | Send file attachments                                                                                               | ❌[6] |
|                   | Receive Giphy                                                                                                       | ✔️ |
|                   | Send messages with high priority                                                                                    | ❌ |
|                   | Receive messages with high priority                                                                                 | ✔️ |
|                   | Receive link to Loop components                                                                                     | ❌ |
|                   | Send and receive emojis                                                                                             | ✔️ |
|                   | Send and receive stickers                                                                                           | ✔️ |
|                   | Send and receive adaptive cards                                                                                     | ❌ |
|                   | Use typing indicators                                                                                               | ✔️ |
|                   | Read receipt                                                                                                        | ❌ |
|                   | Render response to chat message                                                                                     | ✔️ |
|                   | Reply to specific chat message                                                                                      | ❌ |
|                   | React to chat message                                                                                               | ❌ |
|                   | [Data loss prevention (DLP)](/microsoft-365/compliance/dlp-microsoft-teams)                                         | ✔️ [2]|
|                   | [Customer managed keys](/microsoft-365/compliance/customer-key-overview)                                      | ✔️ |
| Mid-call control  | Turn your video on/off                                                                                              | ✔️        |
|                   | Mute/unmute mic                                                                                                     | ✔️        |
|                   | Mute remote participants                                                                                            | ✔️        |
|                   | Switch between cameras                                                                                              | ✔️        |
|                   | Local hold/unhold                                                                                                  | ✔️        |
|                   | Indicator of dominant speakers in the call                                                                          | ✔️        |
|                   | Choose speaker device for calls                                                                                     | ✔️        |
|                   | Choose microphone for calls                                                                                         | ✔️        |
|                   | Indicator of participant's state:<br/>*Idle, Early media, Connecting, Connected, On hold, In lobby, Disconnected*    | ✔️        |
|                   | Indicator of call's state: <br/>*Early media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️        |
|                   | Indicate participants being muted                                                                                   | ✔️        |
|                   | Indicate participants' reasons for terminating the call                                                             | ✔️        |
|                   | Get associated toll and toll-free phone numbers with the meeting                                                    | ✔️        |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️        |
|                   | Share a specific application (from the list of running applications)                                                | ✔️        |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️        |
|                   | Receive your screen sharing stream                                                                                  | ❌        |
|                   | Share content in **Content-only** mode                                                                                | ✔️        |
|                   | Receive video stream with content for **Content-only** screen sharing experience                                      | ✔️        |
|                   | Share content in **Standout** mode                                                                                    | ❌[6]     |
|                   | Receive video stream with content for a **Standout** screen sharing experience                                        | ❌        |
|                   | Share content in **Side-by-side** mode                                                                                | ❌[6]     |
|                   | Receive video stream with content for **Side-by-side** screen sharing experience                                      | ❌        |
|                   | Share content in **Reporter** mode                                                                                    | ❌[6]     |
|                   | Receive video stream with content for **Reporter** screen sharing experience                                          | ❌        |
|                   | [Give or request control over screen sharing](/microsoftteams/meeting-who-present-request-control)                  | ❌        |
| Roster            | List participants                                                                                                   | ✔️        |
|                   | Add an Azure Communication Services user                                                                            | ❌        |
|                   | Add a Teams user                                                                                                    | ✔️        |
|                   | Adding Teams user honors Teams external access configuration                                                        |   ✔️      |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      |
|                   | Add a phone number                                                                                                  | ✔️        |
|                   | Remove a participant                                                                                                | ✔️        |
|                   | Manage breakout rooms                                                                                               | ❌[6] |
|                   | Participation in breakout rooms                                                                                     | ❌ |
|                   | Admit participants in the lobby into the Teams meeting                                                               | ✔️        |
|                   | Be admitted from the lobby into the Teams meeting                                                                   | ✔️        |
|                   | Promote participant to a presenter or attendee                                                                        | ❌        |
|                   | Be promoted to presenter or attendee                                                                                | ✔️        |
|                   | Disable or enable mic for attendees                                                                                 | ❌        |
|                   | Honor disabling or enabling a mic as an attendee                                                                    | ✔️        |
|                   | Disable or enable camera for attendees                                                                              | ❌        |
|                   | Honor disabling or enabling a camera as an attendee | ✔️        |
|                   | Adding Teams user honors information barriers                                                                       |   ✔️      |
|                   | Announce when phone callers join or leave                                                                           | ❌        |
| Teams Copilot     | User can access Teams Copilot                                                                                       | ❌[6]     |
|                   | User's transcript is captured when Copilot is enabled                                                               | ✔️        |
| Device management | Ask for permission to use audio and/or video                                                                       | ✔️        |
|                   | Get camera list                                                                                                     | ✔️        |
|                   | Set camera                                                                                                          | ✔️        |
|                   | Get selected camera                                                                                                 | ✔️        |
|                   | Get microphone list                                                                                                 | ✔️        |
|                   | Set microphone                                                                                                      | ✔️        |
|                   | Get selected microphone                                                                                             | ✔️        |
|                   | Get speakers list                                                                                                   | ✔️        |
|                   | Set speaker                                                                                                         | ✔️        |
|                   | Get selected speaker                                                                                                | ✔️        |
| Video rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️        |
|                   | Set/update scaling mode                                                                                           | ✔️        |
|                   | Render remote video stream                                                                                          | ✔️        |
|                   | See **Together** mode video stream                                                                                      | ❌ |
|                   | See **Large gallery** view                                                                                              | ❌ |
|                   | Receive video stream from Teams media bot                                                                           | ❌ |
|                   | Receive adjusted stream for **Content from camera**                                                                   | ❌ |
|                   | Add and remove video stream from spotlight                                                                          | ✔️ |
|                   | Allow video stream to be selected for spotlight                                                                     | ✔️ |
|                   | Apply background blur                                                                                               | ✔️[3] |
|                   | Apply background replacement                                                                                        | ✔️[3] |
|                   | Receive Teams default images for background replacement                                                             | ❌[6]| 
|                   | Receive [Teams Premium custom images for background replacement](/microsoftteams/custom-meeting-backgrounds)        | ❌[6] |
|                   | Apply [Watermark](/microsoftteams/watermark-meeting-content-video) over received video and screen sharing           | ❌ |
| Recording & transcription | Manage Teams cloud recording                                                                                | ❌[6] |
|                   | Receive information of call being cloud recorded                                                                    | ✔️ |
|                   | Manage Teams transcription                                                                                          | ❌[6] |
|                   | Receive information of call being transcribed                                                                       |   ✔️      |
|                   | Manage Teams closed captions                                                                                        | ✔️ |
|                   | Support for compliance recording                                                                                    |   ✔️      |
|                   | [Azure Communication Services recording](../../voice-video-calling/call-recording.md)                               |   ❌      |
| Engagement        | Raise and lower hand                                                                                                | ✔️ |
|                   | Indicate other participants' raised and lowered hands                                                               | ✔️ |
|                   | Trigger reactions                                                                                                   | ✔️ |
|                   | Indicate other participants' reactions                                                                              | ✔️ |
| Integrations      | Control Teams third-party applications                                                                              | ❌ |
|                   | Receive [PowerPoint Live stream](https://support.microsoft.com/office/present-from-powerpoint-live-in-microsoft-teams-28b20e74-7165-499c-9bd4-0ad975d448ad)       | ✔️ |
|                   | Receive [Excel Live stream](https://support.microsoft.com/office/excel-live-in-microsoft-teams-meetings-a5790e42-7f75-4859-8674-cc3d07c86ede) | ❌[6] |
|                   | Receive [Whiteboard stream](https://support.microsoft.com/office/whiteboard-in-microsoft-teams-d69a2709-cb9a-4b3d-b878-67b9bbf4e7bf)                              | ❌[6] |
|                   | Receive [collaborative annotations](https://support.microsoft.com/office/use-annotation-while-sharing-your-screen-in-microsoft-teams-876ba527-7112-437e-b410-5aec7363c473)            | ❌[6] |
|                   | Interact with a poll                                                                                                | ❌ |
|                   | Interact with a Q&A                                                                                                 | ❌ |
|                   | Interact with Meeting notes                                                                                       | ❌[6] |
|                   | Manage Speaker Coach                                                                                                 | ❌[6] |
| | [Include participant in Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ✔️ |
|                   | Support [Teams eCDN](/microsoftteams/streaming-ecdn-enterprise-content-delivery-network)                            | ❌ |
|                   | Receive [Teams meeting theme details](/microsoftteams/meeting-themes)                                               | ❌ |
| Accessibility     | Receive [Teams closed captions](https://support.microsoft.com/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260)      | ✔️ |
|                   | Change spoken language of [Teams closed captions](https://support.microsoft.com/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260)      | ✔️ |
|                   | Communication access real-time translation (CART)                                                                   | ❌ |
| Larger meetings   | Support [Teams green room](https://support.microsoft.com/office/green-room-for-teams-meetings-5b744652-789f-42da-ad56-78a68e8460d5) | ✔️[4] |
|                   | Support [Hide attendee names](/microsoftteams/hide-attendee-names) meeting option      | ❌[5] |
|                   | Support [Manage what attendees see](https://support.microsoft.com/en-us/office/manage-what-attendees-see-in-teams-meetings-19bfd690-8122-49f4-bc04-c2c5f69b4e16) | ❌ |
|                   | Support [RTMP-in](https://support.microsoft.com/office/use-rtmp-in-in-microsoft-teams-789d6090-8511-4e2e-add6-52a9f551be7f) | ❌ |
|                   | Support [RTMP-out](https://support.microsoft.com/office/broadcast-audio-and-video-from-teams-with-rtmp-11d5707b-88bf-411c-aff1-f8d85cab58a0) | ✔️ |
| Translation       | Receive [Teams Premium translated closed captions](https://support.microsoft.com/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260) | ✔️ |
|                   | Change spoken and caption's language for [Teams Premium closed captions](https://support.microsoft.com/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260) | ✔️ |
|                   | [Language interpretation](https://support.microsoft.com/office/use-language-interpretation-in-microsoft-teams-meetings-b9fdde0f-1896-48ba-8540-efc99f5f4b2e)   | ❌ |
| Advanced call routing   | Does meeting dial-out honor forwarding rules                                                                   |   ✔️      |
|                   | Read and configure call forwarding rules                                                                             |   ❌      |
|                   | Does meeting dial-out honor simultaneous ringing                                                                     |   ✔️      |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      |
|                   | Does meeting dial-out honor shared line configuration                                                                |   ✔️      |
|                   | Dial-out from meeting on behalf of the Teams user                                                                    |   ❌      |
|                   | Read and configure shared line configuration                                                                        |   ❌      |
| Teams meeting policy | Honor setting **Let anonymous people join a meeting**                                                              |   ✔️      |
|                   | Honor setting **Mode for IP audio**                                                                                   | ❌ |
|                   | Honor setting **Mode for IP video**                                                                                   | ❌ |
|                   | Honor setting **IP video**                                                                                            | ❌ |
|                   | Honor setting **Local broadcasting**                                                                                  | ❌ |
|                   | Honor setting **Media bit rate (Kbps)**                                                                                | ❌ |
|                   | Honor setting **Network configuration lookup**                                                                        | ❌ |
|                   | Honor setting **Transcription**                                                                                       | No API available |
|                   | Honor setting **Cloud recording**                                                                                     | No API available |
|                   | Honor setting **Meetings automatically expire**                                                                       | ✔️ |
|                   | Honor setting **Default expiration time**                                                                             | ✔️ |
|                   | Honor setting **Store recordings outside of your country or region**                                                  | ✔️ |
|                   | Honor setting **Screen sharing mode**                                                                                 | No API available |
|                   | Honor setting **Participants can give or request control**                                                            | No API available |
|                   | Honor setting **External participants can give or request control**                                                   | No API available |
|                   | Honor setting **PowerPoint Live**                                                                                     | No API available |
|                   | Honor setting **Whiteboard**                                                                                          | No API available |
|                   | Honor setting **Shared notes**                                                                                        | No API available |
|                   | Honor setting **Select video filters**                                                                                | ❌ |
|                   | Honor setting **Let anonymous people start a meeting**                                                                |   ✔️      | 
|                   | Honor setting **Who can present in meetings**                                                                         |   ❌      |
|                   | Honor setting **Automatically admit people**                                                                          |   ✔️      |
|                   | Honor setting **Dial-in users can bypass the lobby**                                                                  |   ✔️      |
|                   | Honor setting **Meet now in private meetings**                                                                        |   ✔️      |
|                   | Honor setting **Live captions**                                                                                       |   No API available |
|                   | Honor setting **Chat in meetings**                                                                                    |   ✔️      |
|                   | Honor setting **Teams Q&A**                                                                                           |   No API available |
|                   | Honor setting **Meeting reactions**                                                                                   |   No API available |
| DevOps            | [Azure Metrics](../../metrics.md)                                                                                   | ✔️ |
|                   | [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                   | ✔️ |
|                   | [Communication Services Insights](../../analytics/insights/voice-and-video-insights.md)                                                | ✔️ |
|                   | [Communication Services voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ |
|                   | [Teams Real-Time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ |

> [!NOTE]
> When Teams external users leave the meeting, or the meeting ends, they can no longer exchange new chat messages. They also can't access messages sent and received during the meeting.

1. Communication Services users can join a channel Teams meeting with audio and video, but they won't be able to send or receive any chat messages.
1. Communication Services provides developer tools to integrate Teams DLP compatible with Teams. For more information, see [Implement data loss prevention](../../../how-tos/chat-sdk/data-loss-prevention.md).
1. This feature isn't available in mobile browsers.
1. The Communication Services calling SDK doesn't receive a signal that a user is admitted and waiting for the meeting to start. The UI library doesn't support chat while waiting for the meeting to start.
1. The Communication Services chat SDK shows the real identity of attendees.
1. Functionality isn't available for users who aren't part of the organization.

## Server capabilities

The following table shows supported server-side capabilities available in Communication Services.

|Capability | Supported |
| --- | --- |
| [Manage Communication Services call recording](../../voice-video-calling/call-recording.md)                                                        | ❌ |
| [Azure Metrics](../../metrics.md)                                                                                               | ✔️ |
| [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                                  | ✔️ |
| [Communication Services Insights](../../analytics/insights/voice-and-video-insights.md)                                                            | ✔️ |
| [Communication Services voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |

## Teams capabilities

The following table shows supported Teams capabilities.

|Capability | Supported |
| --- | --- |
| [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)              | ✔️ |
| [Teams Real-Time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality) | ❌ |
| [Teams meeting attendance report](https://support.microsoft.com/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ✔️ |

## Related content

- [Authenticate as a Teams external user](../../../quickstarts/identity/access-tokens.md)
- [Join Teams meeting audio and video as a Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as a Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as a Teams user](../../teams-endpoint.md)
