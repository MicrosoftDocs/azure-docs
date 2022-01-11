---
title: Azure Communication Services Rooms overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Rooms.
author: nmurav
manager: antval
services: azure-communication-services

ms.author: nmurav
ms.date: 11/24/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Rooms overview

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication services provide a concept of rooms for developers who are building structured conversations. Rooms support only voice and video calling in Private Preview.
Here are main scenarios where Rooms are useful:

- **Service-managed communication.** Rooms help service platforms deliver meeting-style experiences while still being suitably generic for a wide variety of industry applications. Services can create and manage rooms for patients seeking medical advice, financial planners working with clients, and lawyers providing legal services. 
- **Ability to have Invite-only experiences.** Rooms allow your services to control which users can join the rooms. Board members can discuss sensitive topics confidentially.


## When to use Rooms
Not every solution needs a Room. Some scenarios, like building basic one-to-one or one-to-few ad-hoc interactions, can be created using the Calling or Chat SDKs without the need for rooms.

Use rooms when you need:
- Control who can access a calling session on server side
- Need coordinates that can be expired at a specific moment of time
- Have a call to which only invited users can join

 :::image type="content" source="../media/rooms/decision-tree.png" alt-text="Diagram showing decision tree to select a Room.":::

Note while you can use either group CallID or rooms if you just need an ephemeral coordinate. We recommend using rooms API for all new solutions you are building.

| Capability  | 1:N Call | 1:N Call <br>with ephemeral ID</br> |  Room call | 
| ------ | :------: | :------: | :------: |
| Interactive participants  | 350 | 350 | 350 |
| Ephemeral ID to distribute to participants  | No  | Yes (Group ID) | Yes (Room ID) |
| Invitee only participation   | No  | No | Yes <br>(Mandatory in private preview)</br> |
| API to create. remove, update, delete the call   | No  | No | Rooms API |
| Set validity period for a call   | No  | No | Yes <br> Up to six months </br> |


## Managing the Rooms

Rooms are managed via Rooms SDK or Rooms API. In the initial release, the rooms allows only have voice and video calls within the Room. 

Use the **Rooms API/SDK** in your server application for Room:
- Creation 
- Modification
- Deletion
- Defining and updating the set of participants
- Setting and modifying the Room validity (up to six months).

Use the  **JS Calling SDKs** (with other Calling SDKs and chat support on the roadmap) to join the room. 


The picture below illustrates the concept of managing and joining the rooms.

 :::image type="content" source="../media/rooms/rooms-management.png" alt-text="Diagram showing Rooms Management.":::
 
 ## Runtime operations
 
 Most actions available in regular one-to-one or group calls in JS Calling SDK are also available in rooms. You cannot promote the existing one-to-one or group call to a room call or Invite an ad hoc user to join a Room (you need to add the user using the Rooms API)
Full list of capabilities that are available in JS SDK are listed in the [Calling SDK Overview](../voice-video-calling/calling-sdk-features.md#detailed-capabilities).

| Capability | JS Calling SDK | Rooms API/SDK |
|----------------------------------------------| :--------: | :---------: |
| Join a Room call with voice and video | ✔️ | ❌ |
| List participants that joined the Rooms call | ✔️ | ❌ |
| List all participants that are invited to the Room call | ❌ | ✔️ |
| Add or remove a VoIP participant  | ❌ | ✔️ |
| Add or remove a new PSTN participant  | ❌ | ❌ |

## Next steps:
-	Use the [QuickStart to create, manage and join a room.](../../quickstarts/rooms/get-started-rooms.md)
-	Review the [Network requirements for media and signaling](../voice-video-calling/network-requirements.md)



