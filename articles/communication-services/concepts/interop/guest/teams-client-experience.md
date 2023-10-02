---
title: Teams client experience for Teams external user
titleSuffix: An Azure Communication Services concept document
description: Teams client experience of Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Experience for users in Teams client
Teams external user joining Teams meeting with Azure Communication Services SDKs will be represented in Teams client as any other Teams anonymous user. Teams external users will be marked as "external" in the participant's lists as Teams clients. As Teams anonymous users, their capabilities in the Teams meeting will be limited regardless of the assigned Teams meeting role.


![A diagram that shows how external user on Azure Communication Services connects to Teams meeting.](../media/desktop-client-external-user-joins-teams-meeting.png)

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/identity/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
