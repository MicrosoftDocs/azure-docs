---
title: Azure Communication Services Rooms overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Rooms.
author: farrukhghaffar
manager: nmurav
services: azure-communication-services

ms.author: FAGHAFFA
ms.date: 06/19/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Rooms overview

Azure Communication Services provides a concept of a room for developers who are building structured conversations such as virtual appointments or virtual events. Rooms currently allow voice and video calling.

Here are the main scenarios where rooms are useful:

- **Rooms enable scheduled communication experience.** Rooms help service platforms deliver meeting-style experiences while still being suitably generic for a wide variety of industry applications. Services can schedule and manage rooms for patients seeking medical advice, financial planners working with clients, and lawyers providing legal services.
- **Rooms enable an invite-only experience.** Rooms allow your services to control which users can join the room for a virtual appointment with doctors or financial consultants. This will allow only a subset of users with assigned Communication Services identities to join a room call.
- **Rooms enable structured communications through roles and permissions.** Rooms allow developers to assign predefined roles to users to exercise a higher degree of control and structure in communication. Ensure only presenters can speak and share content in a large meeting or in a virtual conference.

## When to use rooms

Use rooms when you need any of the following capabilities:
- Control which users can join room calls.
- Need scheduling/coordinates that are enabled and expire at a specified time and date.
- Need structured communication through roles and permissions for users.

 :::image type="content" source="../media/rooms/room-decision-tree.png" alt-text="Diagram showing decision tree to select a Room.":::

| Capability | 1:N Call | 1:N Call <br>with ephemeral ID</br> |  Room call |
| ------ | :------: | :------: | :------: |
| Interactive participants | 350 | 350 | 350 |
| Ephemeral ID to distribute to participants | ❌ | ✔️ <br>(Group ID)</br> | ✔️ <br>(Room ID)</br> |
| Invitee only participation   | ❌ | ❌ | ✔️ |
| All users in communication service resource to join a call   | ❌ | ✔️ | ✔️ |
| Set validity period for a call   | ❌ | ❌ | ✔️ <br> Up to six months </br> |
| Set user roles and permissions for a call   | ❌ | ❌ | ✔️ |
| API to create, remove, update, delete the call   | ❌ | ❌ | ✔️ <br> Rooms API <br> |


## Managing rooms and joining room calls

 **Rooms API/SDK** is used to accomplish actions such as creating a room, adding participants, and setting up schedule etc. Calling SDK is used to initiate the call within a Room from the client side. Most actions available in a one-to-one or group-calls in **Calling SDKs** are also available in room calls. Full list of capabilities offered in Calling SDK is listed in the [Calling SDK Overview](../voice-video-calling/calling-sdk-features.md#detailed-capabilities).

| Capability                                   | Calling SDK | Rooms API/SDK |
|----------------------------------------------|--------|--------|
| Join a room call with voice and video        | ✔️ | ❌ |
| List participants that joined the rooms call | ✔️ | ❌ |
| Create room                                  | ❌ | ✔️ |
| List all participants that are invited to the room | ❌ | ✔️ |
| Add or remove a VoIP participant             |  ❌ | ✔️ |
| Assign roles to room participants            |  ❌ | ✔️ |

The picture below illustrates the concept of managing and joining the rooms.

:::image type="content" source="../media/rooms/rooms-join-call.png" alt-text="Diagram showing Rooms Management.":::

### Rooms API/SDKs

Rooms are created and managed via rooms APIs or SDKs. Use the rooms API/SDKs in your server application for `room` operations:
- Create
- Modify
- Delete
- Set and update the list of participants
- Set and modify the Room validity
- Assign roles and permissions to users. Details below.

### Calling SDKs

Use the [Calling SDKs](../voice-video-calling/calling-sdk-features.md) to join the room call. Room calls can be joined using the Web, iOS or Android Calling SDKs. You can find quick start samples for joining room calls [here](../../quickstarts/rooms/join-rooms-call.md).

Rooms can also be accessed using the [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/docs/rooms--page). The UI Library enables developers to add a call client that is Rooms enabled into their application with only a couple lines of code.

## Predefined participant roles and permissions

Room participants can be assigned one of the following roles: **Presenter**, **Attendee** and **Consumer**. By default, a user is assigned an **Attendee** role, if no other role is assigned.

The tables below provide detailed capabilities mapped to the roles. At a high level, **Presenter** role has full control, **Attendee** capabilities are limited to audio and video, while **Consumer** can only receive audio, video and screen sharing.

| Capability | Role: Presenter | Role: Attendee | Role: Consumer
|---------------------------------------------| :--------: | :--------: | :--------: |
| **Mid call controls** | | |
| - Turn video on/off | ✔️ | ✔️ | ❌ |
| - Mute/Unmute mic | ✔️ | ✔️ | ❌ |
| - Switch between cameras | ✔️ | ✔️ | ❌ |
| - Active speaker | ✔️ | ✔️ | ✔️ |
| - Choose speaker for calls | ✔️ | ✔️ | ✔️ |
| - Choose mic for calls | ✔️ | ✔️ | ❌ |
| - Show participants state (idle, connecting, connected, On-hold, Disconnecting, Disconnected etc.) | ✔️ | ✔️ | ✔️ |
| - Show call state (Early media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected | ✔️ | ✔️ | ✔️ |
| - Show if a participant is muted | ✔️ | ✔️ | ✔️ |
| - Show the reason why a participant left a call | ✔️ | ✔️ | ✔️ |
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
| **Video rendering** | | |
| - Render a video in multiple places (local camera or remote stream) | ✔️ | ✔️ | ✔️ <br>(Only Remote)</br> |
| - Set/Update video scaling mode | ✔️ | ✔️ | ✔️ <br>(Only Remote)</br> |
| - Render remote video stream | ✔️ | ✔️ | ✔️ |

*) Only available on the web calling SDK. Not available on iOS and Android calling SDKs

## Event handling

[Voice and video calling events](../../../event-grid/communication-services-voice-video-events.md) published via [Event Grid](../../../event-grid/event-schema-communication-services.md) are annotated with room call information.

- **CallStarted** is published when a room call starts.
- **CallEnded** is published when a room call ends.
- **CallParticipantAdded** is published when a new participant joins a room call.
- **CallParticipantRemoved** is published when a participant drops from a room call.

## Deprecated Features

Earlier public preview version of Rooms API supported two configurations for Rooms roster control, as follows:

- An "Invite Only" room which only allows invited users to join the Rooms call.
- An "Open Room" which is a less secure. In open rooms configuration, all Azure Communication Services users were allowed to join a call without being explicitly invited through the Room roster.

The "Open Room" concept is now deprecated. Going forward, "Invite Only" rooms will be the only supported Room type.

## Known Limitations

- Azure Communication Services Call Automation capabilities currently do not support Rooms call.

## Next steps:
- Use the [QuickStart to create, manage and join a room](../../quickstarts/rooms/get-started-rooms.md).
- Learn how to [join a room call](../../quickstarts/rooms/join-rooms-call.md).
- Review the [Network requirements for media and signaling](../voice-video-calling/network-requirements.md).
- Analyze your Rooms data, see: [Rooms Logs](../Analytics/logs/rooms-logs.md).
- Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../azure-monitor/logs/log-analytics-tutorial.md).
- Create your own queries in Log Analytics, see: [Get Started Queries](../../../azure-monitor/logs/get-started-queries.md).
