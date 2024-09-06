---
title: Tutorial - Integrate Microsoft Teams breakout rooms
titleSuffix: An Azure Communication Services tutorial
description: Use Azure Communication Services SDKs to access BreakoutRooms.
author: sravanthivelidandla
ms.author: insravan
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 07/15/2024
ms.custom: template-how-to
---

# BreakoutRooms
In this article, you learn how to implement Microsoft Teams breakout rooms with Azure Communication Services. This capability allows Azure Communication Services users in Teams meetings to participate in breakout rooms. Teams administrators control availability of breakout rooms in Teams meeting with Teams meeting policy. You can find additional information about breakout rooms in [Teams documentation](https://support.microsoft.com/office/use-breakout-rooms-in-microsoft-teams-meetings-7de1f48a-da07-466c-a5ab-4ebace28e461).

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Teams meeting organizer needs to assign Teams meeting policy that enables breakout rooms.[Teams meeting policy](/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps&preserve-view=true)
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

Only Microsoft 365 Users with Organizer, Co-Organizer, or Breakout Room manager roles can manage the breakout rooms.

## Support
The following tables define support of breakout rooms in Azure Communication Services.
### Identities and call types
The following tables show support of breakout rooms for specific call type and identity. 

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	| ✔️	          |      |          |            |	                      |	                         |
|Microsoft 365 user	          | ✔️	          |      |          |            |                        |                          |



### Operations
The following tables show support of individual APIs in calling SDK to individual identity types. 

|Operations                   | Communication Services user | Microsoft 365 user |
|-----------------------------|------------------------------|-------------------|
|Get assigned breakout room		| ✔️	| ✔️  |  		
|Get all breakout rooms	      | 	| ✔️[1]  | 
|Join breakout room           | ✔️	| ✔️ |
|Manage breakout rooms        |      |    |
|Participate in breakout room chat |    | ✔️[2] |
|Get breakout room settings|✔️ | ✔️ |

[1] Only Microsoft 365 user with role organizer, co-organizer, or breakout room manager.

[2] Microsoft 365 users can use Graph API to participate in breakout room chat. The thread ID of the chat is provided in the assigned breakout room object.

### SDKs
The following tables show support of breakout rooms feature in individual Azure Communication Services SDKs.

|             | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|-------------|-----|--------|--------|--------|----------|--------|---------|
|Is Supported | ✔️  |        |        |        |          |        |         |		

## Breakout rooms

[!INCLUDE [BreakoutRooms Client-side JavaScript](./includes/breakoutrooms/breakoutrooms-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
