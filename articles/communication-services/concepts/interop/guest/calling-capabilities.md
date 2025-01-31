---
title: Capabilities for Microsoft Teams users in Azure Communication Services calls
titleSuffix: An Azure Communication Services concept document
description: Experience for Microsoft Teams users joining an Azure Communication Services call
author: jamescadd
ms.author: jacadd
ms.date: 4/15/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other
---

# Capabilities for Microsoft Teams users in Azure Communication Services calls

Azure Communication Services is interoperable with Microsoft Teams. This is especially helpful for business-to-consumer use cases, where an external customer in a custom, branded Azure-powered app or website communicates with an employee using Microsoft Teams. This ability enables the external customer to enjoy a custom experience, and the employee to have all their communication needs satisfied in a single hub: Teams.

Azure Communication Services can interoperate with Teams in three ways:

- Azure clients can place or add an individual Teams user to a 1:1 and group calls. This ability is ideal for customer service situations where your application is connecting Teams-hosted subject matter experts to a call to help agents improve their first call resolution rates. This article describes the scenario.

- Azure clients can directly call a Teams Voice App, such as Auto Attendant and Call Queues. Azure Communication Services enables you to connect customers from your website or application to Teams Voice Apps to handle requests and later handoff to Teams agents as configured in Teams admin center. For more information, see [Join your calling app to a Teams call queue](../../../quickstarts/voice-video-calling/get-started-teams-call-queue.md).

- Azure clients can join Teams meetings. For more information, see [Teams meeting capabilities for Teams external users](./meeting-capabilities.md).

This page details capabilities for Teams (or Microsoft 365) users in a call with Communication Services users (scenario #1). Your service can orchestrate and manage these calls, including adding Teams users to these calls, using Call automation SDK. Read more about it [Add Teams users in Call Automation workflows](../../call-automation/call-automation-teams-interop.md).

[!INCLUDE [Teams Phone license](../../../includes/teams-phone-license-include.md)]

M365/Teams user can take calls with Communication Services users via Teams client or [a custom client](../../teams-endpoint.md) built using the Azure Communication Services Calling JavaScript SDK. To learn about features available for Communication Services user, refer to [voice and video capabilities](../../voice-video-calling/calling-sdk-features.md) document.

Azure Communication Services Calling SDK also provides [Media quality statistics](../../voice-video-calling/media-quality-sdk.md) 
and [improve and manage call quality](). For more information, see the [Calling SDK overview](../../voice-video-calling/calling-sdk-features.md).

| **Group of features** | **Capability** | **M365 user on a custom client** | **M365 user on a Teams client** |
| --- | --- | --- | --- |
| Core capabilities | Place a one-to-one call to Teams user  | ✔️   | ✔️   |
| | Answer an incoming 1:1 or group call from Communication Services  | ✔️   | ✔️   |
| | Reject an incoming 1:1 or group call from Communication Services  | ✔️   | ✔️   |
|  Roster  | Add another Teams user to group call (From your tenant or another federated tenant) | ✔️  | ✔️   |
| | Promote a one-to-one call into a group call by adding Azure Communication Services user | ✔️ | N/A |
| | Add an Azure Communication Services user to group call   | ✔️  | N/A |
| | Add PSTN user to one-on-one or group call | ✔️  | ✔️  |
| | Remove a participant from group call | ✔️   | ✔️   |
| | Placing a call honors Teams external access configuration/federation | ✔️  | ✔️   |
| | Adding Teams users honors Teams external access configuration/federation | ✔️   | ✔️   |
| | List participants | ✔️   | ✔️   |
| Mid call control | Turn your video on/off  | ✔️ | ✔️  |
| | Turn off incoming video | ✔️   | ✔️  |
| | Mute/Unmute mic   | ✔️ | ✔️  |
| | Mute another participant | ✔️ <sup>1</sup>   | ✔️  |
| | Receive mute notifications | ✔️ <sup>1</sup>  | ✔️  |
| | Switch between cameras  | ✔️ | ✔️  |
| | Place participant on local hold/un-hold  | ✔️ | ✔️  |
| | Indicator of dominant speakers in the call  | ✔️ | ✔️  |
| | Choose speaker device for calls   | ✔️ | ✔️  |
| | Choose microphone for calls  | ✔️ | ✔️  |
| | Indicator of participant's state Idle, Early media, Connected, On hold, Disconnected  | ✔️ | ✔️  |
| | Indicator of call's state Ringing, Connected, On Hold   | ✔️ | ✔️  |
| | Indicate participants being muted | ✔️ | ✔️  |
| | Indicate participants' reasons for terminating the call  | ✔️ | ❌ |
| Screen sharing | Share the entire screen from within the application  | ✔️  | ✔️ |
| | Share a specific application (from the list of running applications)   | ✔️   | ✔️  |
| | Share a web browser tab from the list of open tabs | ✔️   |  ✔️ |
| | Share system audio during screen sharing | ✔️   | ✔️  |
| | Participant can view remote screen share | ✔️   | ✔️ |
| Device Management (MVP)  | Ask for permission to use audio and/or video  | ✔️ | ✔️  |
| | Get camera list | ✔️ | ✔️  |
| | Set camera  | ✔️ | ✔️  |
| | Get selected camera  | ✔️ | ✔️  |
| | Get microphone list | ✔️ | ✔️  |
| | Set microphone  | ✔️ | ✔️  |
| | Get selected microphone  | ✔️ | ✔️  |
| | Get speakers list | ✔️ | ✔️  |
| | Set speaker  | ✔️ | ✔️  |
| | Get selected speaker  | ✔️ | ✔️  |
| Video Rendering   | Render single video in many places (local camera or remote stream)  | ✔️   | ✔️ |
| | Set / update scaling mode | ✔️   | ✔️ |
| | Render remote video stream   | ✔️   | ✔️ |
| | See together mode video stream | ✔️<sup>1</sup> | ✔️ |
| | See Large gallery view  | ❌ | ✔️ |
| | Receive video stream from Teams media bot  | ❌ | ✔️ |
| | Receive adjusted stream for "content from Camera"  | ❌ | ✔️ |
| | Add and remove video stream from spotlight | ✔️<sup>1</sup> | ✔️ |
| | Allow video stream to be selected for spotlight | ✔️<sup>1</sup> | ✔️ |
| Video Effects  | [Background Blur](../../../quickstarts/voice-video-calling/get-started-video-effects.md) | ✔️ | ✔️ |
| | Custom background image | ✔️ | ✔️ |
| Engagement | Raise and lower hand | ✔️<sup>1</sup> | ✔️  |
| | Indicate other participants' raised and lowered hands  | ✔️<sup>1</sup> | ✔️  |
| | Trigger reactions | ✔️<sup>1</sup>   | ✔️  |
| | Indicate other participants' reactions | ✔️<sup>1</sup>   | ✔️  |
| Recording  | 	Be notified of the call being recorded   	 | ✔️	 | ✔️ |
| |   Teams compliance recording  | ✔️  | ✔️ |
| | Manage Teams recording (start & stop)	 |  ❌   | ✔️  |
| | Manage Teams transcription (start & stop)   | ❌   | ✔️  |
| |	Receive information of call being transcribed	  | ✔️  | ✔️ |
| | Manage Teams closed captions (start & stop)	  | ✔️  | ✔️ |
| | ACS recording, transcription, and closed captions  | ❌ | N/A |
| Copilot  | Teams Copilot availability | N/A | ❌  |
| Advanced call routing   | Start a call honors forwarding rules  | ✔️<sup>2</sup> | ✔️<sup>2</sup> |
| | Add a user to a call honors forwarding rules  | ❌ | ❌ |
| | Read and configure call forwarding rules | ❌ | ❌ |
| | Start a call and add user operations honor simultaneous ringing | ✔️<sup>2</sup> | ✔️<sup>2</sup> |
| | Read and configure simultaneous ringing |  ❌ | ❌ |
| | Start a call and add user operations honor "Do not disturb" status |  ❌ | ✔️ |
| | [Busy on busy during calls](/MicrosoftTeams/inbound-call-routing#configure-busy-options)  |  ❌ | ✔️ |
| | Placing participant on hold plays music on hold  | ✔️ | ✔️ |
| | Being placed on hold by Teams user on Teams client plays music on hold  | ✔️ | ✔️ |
| | Park a call |  ❌ | ❌ |
| | Be parked |  ❌  | N/A |
| | Transfer a call to a user |  ✔️<sup>2</sup> | ✔️<sup>2</sup> |
| | Be transferred to a user or call   | ✔️ | ✔️ |
| | Transfer a call to a call  | ✔️<sup>2</sup>  | ✔️<sup>2</sup> |
| | Transfer a call to Voicemail  | ✔️<sup>2</sup>  | ✔️<sup>2</sup> |
| | Be transferred to voicemail | ✔️ | ✔️ |
| | Merge ongoing calls |  ❌ | ✔️ |
| | Does start a call and add user operations honor shared line configuration | ✔️ | ✔️ |
| | Start a call on behalf of the Teams user  |  ❌ | ❌ |
| | Read and configure shared line configuration   |  ❌ | ❌ |
| | Receive a call from Teams auto attendant  | ✔️ | ✔️ |
| | Transfer a call to Teams auto attendant | ✔️ | ✔️ |
| | Receive a call from Teams call queue | ✔️ | ✔️ |
| | Transfer a call from Teams call queue   | ✔️ | ✔️ |

> [!NOTE]
> All features are avialable in Azure Public cloud only, not supported in Government cloud.

1. Feature only available in group calls; not applicable in 1 to 1 calls.
2. Feature only available in 1 to 1 calls; not applicable in group calls.
3. The Share Screen capability can be achieved using Raw Media APIs. For more information, see [Add raw media access to your app](../../../quickstarts/voice-video-calling/get-started-raw-media-access.md).