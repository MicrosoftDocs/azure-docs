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

# Capabilities for Teams external users

In this article, you will learn which capabilities are supported for Teams external users using Azure Communication Services SDKs.

## Client capabilities
The following table shows supported client-side capabilities available in Azure Communication Services SDKs. You can find per platform availability in [voice and video calling capabilities](../../voice-video-calling/calling-sdk-features.md).

| Category | Capability | Supported |
| --- | --- | --- |
|Chat | Send and receive chat messages                | ✔️ |
| | Send and receive Giphy                        | ❌ |
| | Send messages with high priority              | ❌ |
| | Recieve messages with high priority           | ✔️ |
| | Send and receive Loop components              | ❌ |
| | Send and receive Emojis                       | ❌ |
| | Send and receive Stickers                     | ❌ |
| | Send and receive Stickers                     | ❌ |
| | Send and receive Teams messaging extensions   | ❌ |
| | Use typing indicators                         | ✔️ |
| | Read receipt                                  | ❌ |
| | File sharing                                  | ❌ |
| | Reply to chat message                         | ❌ |
| | React to chat message                         | ❌ |
|Calling - core | Audio send and receive          | ✔️ |
| | Send and receive video                        | ✔️ |
| | Share screen and see shared screen            | ✔️ |
| | Manage Teams convenient recording             | ❌ |
| | Manage Teams transcription                    | ❌ |
| | Manage breakout rooms                         | ❌ |
| | Participation in breakout rooms               | ❌ |
| | Leave meeting                                 | ✔️ |
| | End meeting                                   | ❌ |
| | Change meeting options                        | ❌ |
| | Lock meeting                                  | ❌ |
| Calling - participants| See roster              | ✔️ |
| | Add and remove meeting participants           | ❌ |
| | Dial out to phone number                      | ❌ |
| | Disable mic or camera of others               | ❌ |
| | Make a participant and attendee or presenter  | ❌ |
| | Admit or reject participants in the lobby     | ❌ |
| Calling - engagement | Raise and lower hand     | ❌ |
| | See raised and lowered hand | ❌ |
| | See and set reactions                         | ❌ |
| Calling - video streams | Send and receive video | ✔️ |
| | See together mode video stream                | ❌ |
| | See Large gallery view                        | ❌ |
| | See Video stream from Teams media bot         | ❌ |
| | See adjusted content from Camera              | ❌ |
| | Set and unset spotlight                       | ❌ |
| | Apply background effects                      | ❌ |
| Calling - integrations | Control Teams third-party applications | ❌ |
| | See PowerPoint Live stream                    | ❌ |
| | See Whiteboard stream                         | ❌ |
| | Interact with a poll                          | ❌ |
| | Interact with a Q&A                           | ❌ |
| | Interact with a OneNote                       | ❌ |
| | Manage SpeakerCoach                           | ❌ |
| Accessibility | Receive closed captions         | ❌ |
| | Communication access real-time translation (CART) | ❌ |
| | Language interpretation                       | ❌ |

When Teams external users leave the meeting, or the meeting ends, they can no longer send or receive new chat messages and no longer have access to messages sent and received during the meeting. 

## Server capabilities

The following table shows supported server-side capabilities available in Azure Communication Services:

|Capability | Supported |
| --- | --- |
| [Manage ACS call recording](../../voice-video-calling/call-recording.md)                                                        | ❌ |
| [Azure Metrics](../../metrics.md)                                                                                               | ✔️ |
| [Azure Monitor](../../logging-and-diagnostics.md)                                                                                  | ✔️ |
| [Azure Communication Services Insights](../../analytics/insights.md)                                                            | ✔️ |
| [Azure Communication Services Voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |


## Teams capabilities

The following table shows supported Teams capabilities:

|Capability | Supported |
| --- | --- |
| [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)              | ✔️ |
| [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality) | ❌ |
| [Teams meeting attendance report](/office/view-and-download-meeting-attendance-reports-in-teams-ae7cf170-530c-47d3-84c1-3aedac74d310) | ✔️ |

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
