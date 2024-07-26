---
title: Tutorial - Integrate Microsoft Teams breakout rooms
titleSuffix: An Azure Communication Services tutorial
description: Use Azure Communication Services SDKs to access BreakoutRooms
author: insravan
ms.author: insravan
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 07/15/2024
ms.custom: template-how-to
---

# BreakoutRooms
In this article, you learn how to implement Microsoft Teams breakout rooms with Azure Communication Services. This capability allows users joining Teams meeting to join and leave breakout rooms. Breakout rooms for users in Microsoft Teams are controlled by the configuration and policy settings in Teams. Additional information is available in [Meeting options in Microsoft Teams]([https://support.microsoft.com/office/meeting-options-in-microsoft-teams-53261366-dbd5-45f9-aae9-a70e6354f88e](https://support.microsoft.com/en-us/office/use-breakout-rooms-in-microsoft-teams-meetings-7de1f48a-da07-466c-a5ab-4ebace28e461))

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Teams meeting organizer needs to have assigned Teams meeting policy that enables breakout rooms.[Teams meeting policy]( https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps)
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

Only Microsoft 365 Users with Organizer, Co-Organizer or Breakout Room manager roles can manage the breakout rooms.

## Support

## Identities

|Identities| Teams meeting	Room | 1:1 call | Group call |
|----------------------------------------------|--------|--------|--------|
|Communication Services user	| ✔️	|   |   |		
|Microsoft 365 user	| ✔️	|  |  |		

## Operations
|Operations| Communication Services user | Microsoft 365 user |
|----------------------------------------------|--------|--------|
|Get assigned breakout room		| ✔️	|   |  		
|Get all breakout rooms	| ✔️	|   |   |
|Join breakout room | ✔️	| ✔️ |
|Manage breakout rooms| | |
|Participate in breakout room chat | | ✔️|

## SDKs
|| Web | Web UI | iOS | Android | Windows |
|-------------|--------|--------|--------|----------|--------|
|Is Supported | ✔️|   |   | | |		

## BreakoutRooms
::: zone pivot="platform-web"
[!INCLUDE [BreakoutRooms Client-side JavaScript](./includes/breakoutRooms/breakoutRooms-web.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
