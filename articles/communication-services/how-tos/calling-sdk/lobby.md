---
title: Teams meeting lobby
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to admit or reject users from Teams meeting lobby.
author: tinaharter
ms.author: tinaharter
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 06/15/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Manage Teams meeting lobby
::: zone pivot="platform-android"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end
In this article, you will learn how to implement the Teams meetings lobby capability by using Azure Communication Service calling SDKs. This capability allows users to admit and reject participants from Teams meeting lobby, receive the join lobby notification and get the lobby participants list.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

User ends up in the lobby depending on Microsoft Teams configuration. The controls are described here:
[Learn more about Teams configuration ](../../concepts/interop/guest/teams-administration.md)

Microsoft 365 or Azure Communication Services users can admit or reject users from lobby, if they're connected to Teams meeting and have Organizer, Co-organizer, or Presenter meeting role.
[Learn more about meeting roles](https://support.microsoft.com/office/roles-in-a-teams-meeting-c16fa7d0-1666-4dde-8686-0a0bfe16e019)

To update or check current meeting join & lobby policies in Teams admin center:
[Learn more about Teams policies](/microsoftteams/settings-policies-reference#automatically-admit-people)

**The following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Co-Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|--------|
| admit | ✔️ | ✔️ | ✔️ |  |
| reject | ✔️ | ✔️ | ✔️ |  |
| admitAll | ✔️ | ✔️ | ✔️ |  |
| getParticipants | ✔️ | ✔️ | ✔️ | ✔️ |
| lobbyParticipantsUpdated | ✔️ | ✔️ | ✔️ | ✔️ |

::: zone pivot="platform-web"
[!INCLUDE [Lobby Client-side JavaScript](./includes/lobby/lobby-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Lobby Client-side Android](./includes/lobby/lobby-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record Calls Client-side iOS](./includes/lobby/lobby-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Lobby Client-side Windows](./includes/lobby/lobby-windows.md)]
::: zone-end


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage Teams calls](../cte-calling-sdk/manage-calls.md)
- [Learn how to join Teams meeting](./teams-interoperability.md)
- [Learn how to manage video](./manage-video.md)
