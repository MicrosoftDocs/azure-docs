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

# Rooms Overview

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication services provide a concept of rooms for developers who are building structured conversations. Rooms support only voice and video calling in Private Preview.
Here are main scenarios where Rooms are useful:

- **Service-managed communication.** Rooms helps service platforms deliver meeting-style experiences while still being suitably generic for a wide variety of industry applications. Services can create and manage Rooms for patients seeking medical advice, financial planners working with clients, and lawyers providing legal services. 
- **Ability to have Invite-only experiences.** Rooms allow your services to control which users can join the Rooms. Board members can discuss sensitive topics confidentially.
- **Pre-built roles and permissions (coming soon).** Roles can drive customization of end-user experience and capabilities, such as restricting attendee ability to add additional users, turning on video, or muting others.

## When to use Rooms
Not every solution, you are building with Azure Communication Services needs a Room. Some scenarios, like building basic one-to-one or one-to-few ad-hoc interactions, can be created using the Calling or Chat SDKs without the need for Rooms.

Use Rooms when you need:
- Contol who can access a calling session on server side
- Need coordinates that can be expired at a specific moment of time
- Have a call to which only invited users can join

 :::image type="content" source="../media/rooms/decision-tree.png" alt-text="Diagram showing decision tree to select a Room.":::

Note while you can use either Group CallID or Rooms if you just need an ephemeral coordinates. We recommend using Rooms API if you plan to add more modalities in the future to a room. While there is only calling supported now, we are looking into adding more modalities moving forward. 

| Capability  | 1:N Call | 1:N Call <br>with ephemeral ID</br> |  Room call | 
| ------ | :------: | :------: | :------: |
| Interactive participants  | 350 | 350 | 350 |
| Ephemeral ID to distribute to participants  | No  | Yes (Group ID) | Yes (Room ID) |
| Invitee only participation   | No  | No | Yes <br>(Mandatory in private preview)</br> |
| API to create. remove, update, delete the call   | No  | No | Rooms API |
| Set validity period for a call   | No  | No | Yes <br> Up to six months </br> |


# Mananging the Rooms

Rooms are managed via Rooms SDK or Rooms API. In the initial release the Rooms allows only have voice and video calls withing the Room. 
Use the Rooms API in your server application for Room creation, modification, deletion, defining and updating the set of participants, setting and modifying the Room validity (up to six months). 
Use the  JS Calling SDKs (with other Calling SDKs and chat support on the roadmap) to join the Room. 


The picture below illustrates the concept of managing and joining the rooms.

 :::image type="content" source="../media/rooms/rooms-manangement.png" alt-text="Diagram showing Rooms Manangement.":::
 
 ## Runtime operations
 
 Most actions available in regular one-to-one or group calls in JS Calling SDK are also available in Rooms. You cannot promote the existing one-to-one or group call to a Rooms call or Invite an ad hoc user to join a Room (you need to add the user using the Rooms API)
Full list of capabilities that are available in JS SDK are listed in the [Calling SDK Overview](https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#detailed-capabilities).

| Capability | JS Calling SDK | Rooms API/SDK |
|----------------------------------------------| :--------: | :---------: |
| Join a Room call with voice and video | ✔️ | ❌ |
| List participants that joined the Rooms call | ✔️ | ❌ |
| List all participants that are invited to the Room call | ❌ | ✔️ |
| Add or remove a VoIP participant  | ❌ | ✔️ |
| Add or remove a new PSTN participant  | ❌ | Coming soon |

Next actions:
-	Use the Rooms QuickStart to create and manage a room. TBC
-	Use the JS Calling SDKs to join the Rooms. TBC
-	Review the [Network requirements for media and signaling](https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/network-requirements)



