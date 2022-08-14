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
The following table shows supported client-side capabilities available in Azure Communication Services SDKs:

| Capability | Supported |
| --- | --- |
| Send and receive chat messages                | ✔️ |
| Use typing indicators                         | ✔️ |
| Read receipt                                  | ❌ |
| File sharing                                  | ❌ |
| Reply to chat message                         | ❌ |
| React to chat message                         | ❌ |
| Audio and video calling                       | ✔️ |
| Share screen and see shared screen            | ✔️ |
| Manage Teams convenient recording             | ❌ |
| Manage Teams transcription                    | ❌ |
| Receive closed captions                       | ❌ |
| Add and remove meeting participants           | ❌ |
| Raise and lower hand                          | ❌ |
| See raised and lowered hand                   | ❌ |
| See and set reactions                         | ❌ |
| Control Teams third-party applications        | ❌ |
| Interact with a poll or Q&A                     | ❌ |
| Set and unset spotlight                       | ❌ |
| See PowerPoint Live                           | ❌ |
| See Whiteboard                                | ❌ |
| Participation in breakout rooms               | ❌ |
| Apply background effects                      | ❌ |
| See together mode video stream                | ❌ |

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


## Next steps

- [Authenticate as Teams external user](../../../quickstarts/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).

