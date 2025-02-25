---
title: Azure Communication Services Rooms overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Rooms.
author: farrukhghaffar
manager: cassidyfein
services: azure-communication-services

ms.author: FAGHAFFA
ms.date: 07/10/2024
ms.topic: conceptual
ms.service: azure-communication-services
---
# Virtual Rooms overview

Virtual Rooms empower developers with essential security and control capabilities to build well-structured communication experiences such as virtual appointments and group communications. Developers can use virtual rooms to conduct voice, video, and PSTN calls. Security and controls in rooms can be classified as follows.

- User access security and controls are applied to call participants, controlling who can join a call and which actions they can take during the call. For example, during a patient's virtual appointment with a doctor, only the authorized hospital staff and patients can join the call. Limiting participants preserves the patient privacy and the participants don't exceed their assigned roles and privileges to disrupt the ongoing call.

- Room-level security and controls are applied at the call level to control when the call can be conducted and which capabilities are available during the call. For example, students are only authorized to join a classroom call during the allocated time but a PSTN caller can't join the same classroom call.

## High level capabilities supported in Virtual Rooms

| Capability | Supported in Rooms call | 
| ------ | :------: |
| Voice (VoIP) | ✔️ |
| Video | ✔️ |
| Client initiated dial-out to a PSTN number | ✔️ |
| Server initiated dial-out to a PSTN number | ✔️ |
| Server-side call management (Call Automation)*  | ✔️ |
| PSTN Dial-in | ❌ |
| Async Messaging (Chat) | ❌ |
| Interoperability with Microsoft Teams | ❌ |

\* Some exceptions apply. The full list of supported [Call Automation capabilities](#how-to-conduct-calls-in-virtual-rooms) are listed in this document.

## When to use Virtual Rooms

Following table shows when to use Virtual Rooms.

| Condition | Use Rooms | 
| ------ | ------ |
| When it is important to control who is allowed to join a call (invite-only experience). | ✔️ |
| When it is important to control when the call is started and ended. | ✔️ |
| When user roles and permissions are needed to conduct well-managed communications. | ✔️ |
| When solution requires Teams interoperability.* | ❌ |

\* If the solution requires interoperability between Teams and Azure Communication Services, use [Teams interoperability calls](../interop/calling-chat.md)

## How to conduct calls in Virtual Rooms

At a high level, to conduct calls in a Virtual Rooms you need to create and manage rooms. The following table describes how to enable participants to join calls and execute in-call operations from the Calling SDK on client-side and server-side. 

| Capability                                   | ACS SDK | Client vs Server SDK | Description |
|----------------------------------------------|--------|--------|--------|
| Create and manage Virtual Rooms        |  [Virtual Rooms SDK](../../quickstarts/rooms/join-rooms-call.md) | Server | The Virtual Rooms SDK enables developers to create and manage Virtual Rooms, add/remove users, assign/update user roles, set/update Virtual Rooms schedules. Developers can also set security limits such as to restrict PSTN dial-out from Rooms.|
| Join a Virtual Rooms call with voice, video, or PSTN and execute the client-initiated in-call operations  |  [Calling SDK](../voice-video-calling/calling-sdk-features.md#detailed-capabilities) | Client | The Calling client SDK enables users to join a Virtual Rooms call and execute client-side operations as permitted by their assigned user roles. Security in a Virtual Rooms call is ensured through enforcement of roster, schedule, user roles, and control limits set through creation and management of Virtual Rooms. Using The client Calling SDK, developers empower call participants to execute in-call operations like mute/unmute, share screen, turn video on/off and dial-out to a PSTN participant, and so on. |
| Server-side management of in-call operations |  [Call Automation SDK](../../how-tos/call-automation/actions-for-call-control.md) | Server | The Call Automation SDK enables developers to execute in-call operations from the server-side. In-call operations include server-initiated dial-out to a PSTN number, call recording, sending/receiving DTMF, sending announcements to specific users, and so on. Because running server-side in-call operations are independent from users and are controlled by developers, these actions aren't controlled by user-roles. |

<b>Developers use Virtual Rooms SDK, Calling client SDK, and Call Automation SDK to secure their calls and to trigger in-call client-side/server-side operations. </b>

| Capability                                   | Rooms Server SDK| Calling Client SDK | Call Automation Server SDK |
|----------------------------------------------|--------|--------|----------|
| Virtual Rooms management - Create/Get/Update/List/Delete Virtual Rooms     | ✔️ | ❌ |  ❌ |
| Virtual Rooms roster management - Add/Update/Remove user to a Virtual Room| ✔️ | ❌ |  ❌ |
| Virtual Rooms call participants permissions management - Assign/Update user roles     | ✔️ | ❌ |  ❌ |
| Virtual Rooms schedule management - Set/Update Virtual Rooms allowed schedule   | ✔️ | ❌ |  ❌ |
| Virtual Rooms security-controls management - Set/Update flag to allow PSTN dial-out from specific Virtual Rooms   | ✔️ | ❌ |  ❌ |
| Get list of users invited to join a Virtual Room | ✔️ | ❌ |  ❌ |
| A user initiates a Virtual Rooms call or joins an in-progress call | ❌ | ✔️ |  ❌ |
| Dial-out to a PSTN user  | ❌ | ✔️ | ✔️ |
| Add/Remove VoIP participants to an in-progress call | ❌ | ✔️ |  ✔️ |
| Get list of participants who joined the in-progress call | ❌ | ✔️ |  ✔️ |
| Start/Stop call captions and change captions language | ❌ | ✔️ |  ❌ |
| Manage call recording | ❌ | ❌ |  ✔️ |
| Send/Receive DTMF to/from PSTN participants | ❌ | ❌ | ✔️ |
| Play audio prompts to participants  | ❌ | ❌ | ✔️ |

[Calling client SDK](../voice-video-calling/calling-sdk-features.md#detailed-capabilities) provides the full list of client-side in-call operations and explains how to use them.

## Managing Virtual Rooms calls from the server-side using Call Automation Server SDK

Call Automation SDK empowers developers to manage Virtual Rooms calls from the server-side and execute in-call operations. Call Automation capabilities are being progressively enabled in Virtual Rooms calls. The following table shows the current status of these capabilities. Developers manage and control Call Automation capabilities from the server-side, which operate at a higher level than a call participant's privileges. So Call Automation capabilities aren't controlled through user roles and permissions.

| Call Automation capability | Supported in Rooms call | 
| ------ | :------: |
| Dial-out to PSTN participant | ✔️ |
| Send/Read DTMF to/from PSTN participant | ✔️ |
| Send announcements to specific call participants | ✔️ |
| Add/Remove a VoIP participant from an ongoing call | ✔️ |
| End call for all users | ✔️ |
| Call transcriptions* | ✔️ |
| Audio media streaming* | ✔️ |

\* Currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This illustration shows the concepts for managing and joining the rooms.

:::image type="content" source="../media/rooms/rooms-join-call.png" alt-text="Diagram showing Rooms Management.":::

### Server initiated PSTN Dialout using Call Automation Server SDK

Developers can activate/deactivate the ability to dial-out to a PSTN participant by setting the Room-specific pstnDialoutEnabled flag. Once the developer sets pstnDialoutEnabled=TRUE for a Room, developers can dial-out to a PSTN participant from the server-side using Call Automation, without needing any client-side participation.

For example, a patient might request interpretation service for their upcoming virtual appointment with their doctor. In most cases, the phone number to the interpretation service is determined dynamically through a backend process. This server-side PSTN dial-out capability allows developers to determine the target phone number, initiate the call and add it to patient's virtual appointment call, without requiring any client-side actions.

Follow these steps to add a PSTN number to a room call using Call Automation SDK:
1. Create a room with pstnDialoutEnabled flag set to `True`
1. Participants start a room call
1. Use Call Automation SDK to connect to a room call using a room ID 
1. Use Call Automation SDK to dial-out to a PSTN number
1. PSTN user accepts and joins a room call

## Managing Virtual Rooms calls from client-side Calling SDKs

Use the [Calling SDKs](../voice-video-calling/calling-sdk-features.md) to join the room call. Room calls can be joined using the Web, iOS, or Android Calling SDKs. You can find quick start samples for joining room calls [here](../../quickstarts/rooms/join-rooms-call.md).

Rooms can also be accessed using the [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/docs/rooms--page). The UI Library enables developers to add a call client that is Rooms-enabled into their application with only a couple lines of code.

### Client initiated PSTN Dial-out using Calling client SDK

Developers can allow/disallow the ability for call participants to dial-out to a PSTN participant, by setting the Room specific pstnDialoutEnabled flag. Once the developer sets pstnDialoutEnabled=TRUE for a Room, the call participants with the Presenter role can dial-out to a PSTN participant from their calling client. The following steps are used to add a PSTN number to a room call using Calling Client SDK.
1. Create a room with pstnDialoutEnabled flag set to True
1. Participants start a room call
1. A participant with Presenter role adds PSTN number into a call
1. PSTN user accepts and joins a room call

### Virtual Rooms API/SDKs

Rooms are created and managed via rooms APIs or SDKs. Use the rooms API/SDKs in your server application for `room` operations:
- Create
- Modify
- Delete
- Set and update the list of participants
- Set and modify the Room validity
- Assign roles and permissions to users

|Virtual Rooms SDK | Version | State|
|-------------------| :-----------------------: | :-----------------------------: |
| Virtual Rooms SDKs | 2024-04-15 | Generally Available - Fully supported |
| Virtual Rooms SDKs | 2023-06-14 | Generally Available - Fully supported |
| Virtual Rooms SDKs | 2023-10-30 | Public Preview - Fully supported |
| Virtual Rooms SDKs | 2023-03-31 | Public Preview - retired |
| Virtual Rooms SDKs | 2022-02-01 | Public Preview - retired |
| Virtual Rooms SDKs | 2021-04-07 | Public Preview - retired |

## Predefined participant roles and permissions in Virtual Rooms calls
<a name="predefined-participant-roles-and-permissions"></a>

Room participants can be assigned one of the following roles: **Presenter**, **Attendee**, and **Consumer**.

The following table provides detailed capabilities mapped to the roles. At a high level, **Presenter** role has full control, **Attendee** capabilities are limited to audio and video, while **Consumer** can only receive audio, video, and screen sharing.

<b>Note:</b> A PSTN call participant is not a part of Room roster, so a user role is not assigned to them. They capabilities are limited to mute/unmute themselves on the local device.

| Capability | Role: Presenter | Role: Attendee | Role: Consumer
|---------------------------------------------| :--------: | :--------: | :--------: |
| **Mid call controls** | | |
| - Turn video on/off | ✔️ | ✔️ | ❌ |
| - Mute/Unmute mic | ✔️ | ✔️ | ❌ |
| - Mute remote user | ✔️ | ❌ | ❌ |
| - Switch between cameras | ✔️ | ✔️ | ❌ |
| - Active speaker | ✔️ | ✔️ | ✔️ |
| - Choose speaker for calls | ✔️ | ✔️ | ✔️ |
| - Choose mic for calls | ✔️ | ✔️ | ❌ |
| - Show participants state (idle, connecting, connected, On-hold, Disconnecting, Disconnected etc.) | ✔️ | ✔️ | ✔️ |
| - Show call state (Early media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected | ✔️ | ✔️ | ✔️ |
| - Show if a participant is muted | ✔️ | ✔️ | ✔️ |
| - Show the reason why a participant left a call | ✔️ | ✔️ | ✔️ |
| - Start call captions | ✔️ | ✔️ | ✔️ |
| - Change captions language | ✔️ | ✔️ | ❌ |
| - Invite to join a Virtual Room participant to a call | ✔️ | ❌ | ❌ |
| **Screen sharing** | | |
| - Share screen | ✔️ *  | ❌ | ❌ |
| - Share an application | ✔️ * | ❌ | ❌ |
| - Share a browser tab | ✔️ * | ❌ | ❌ |
| - Participants can view shared screen | ✔️ | ✔️ | ✔️ |
| **Roster management** | | |
| - Remove a participant | ✔️ | ❌ | ❌ |
| **Device management** | | |
| - Ask for permission to use audio and/or video | ✔️ | ✔️ | ❌ |
| - Get camera list | ✔️ | ✔️ | ❌ |
| - Set camera | ✔️ | ✔️ | ❌ |
| - Get selected camera | ✔️ | ✔️ | ❌ |
| - Get mic list | ✔️ * | ✔️ * | ❌ |
| - Set mic | ✔️ * | ✔️ * | ❌ |
| - Get selected mic | ✔️ * | ✔️ * | ❌ |
| - Get speakers list | ✔️ * | ✔️ * | ✔️ * |
| - Set speaker | ✔️ * | ✔️ * | ✔️ * |
| - Get selected speaker | ✔️ | ✔️ | ✔️ |
| **Video rendering** | | | |
| - Render a video in multiple places (local camera or remote stream) | ✔️ | ✔️ | ✔️ <br>(Only Remote)</br> |
| - Set/Update video scaling mode | ✔️ | ✔️ | ✔️ <br>(Only Remote)</br> |
| - Render remote video stream | ✔️ | ✔️ | ✔️ |
| **Dial-out to PSTN participants from the client-side** | | |
| - Dial-out to PSTN participants from Virtual Rooms calls | ✔️ | ❌ | ❌ |

\* Only available on the web calling SDK. Not available on iOS and Android calling SDKs

\*\* Currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Event handling

[Voice and video calling events](../../../event-grid/communication-services-voice-video-events.md) published via [Event Grid](../../../event-grid/event-schema-communication-services.md) are annotated with room call information.

- **CallStarted** is published when a room call starts.
- **CallEnded** is published when a room call ends.
- **CallParticipantAdded** is published when a new participant joins a room call.
- **CallParticipantRemoved** is published when a participant drops from a room call.

## Deprecated Features

An earlier public preview version of Rooms API supported two configurations for Rooms roster control, as follows:

- An *Invite Only* room that only allowed invited users to join the Rooms call.
- An *Open Room* that was less secure. In open rooms configuration, all Azure Communication Services users were able to join a call without being explicitly invited through the Room roster.

The *Open Room* concept is now deprecated. Going forward, *Invite Only* rooms are the only supported Room type.

## Known Limitations

- Azure Communication Services Call Automation capabilities currently don't support Rooms call.

## Next steps:
- Use the [QuickStart to create, manage, and join a room](../../quickstarts/rooms/get-started-rooms.md).
- Learn how to [join a room call](../../quickstarts/rooms/join-rooms-call.md).
- Learn how to [manage a room call](../../quickstarts/rooms/manage-rooms-call.md).
- Review the [Network requirements for media and signaling](../voice-video-calling/network-requirements.md).
- Analyze your Rooms data, see: [Rooms Logs](../Analytics/logs/rooms-logs.md).
- Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries in Log Analytics, see: [Get Started Queries](/azure/azure-monitor/logs/get-started-queries).
