---
title: Teams client experience for Teams user
titleSuffix: An Azure Communication Services concept document
description: Teams client experience of Azure Communication Services support for Teams users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Experience for users in Teams client
Teams users calling users in the same organization or joining Teams meeting organized in the same organization will be represented in Teams client as any other Teams user. Teams users calling users in trusted organizations or joining Teams meetings organized in trusted organizations will be represented in Teams clients as Teams user from different organization. Teams users from different organization will be marked as "external" in the participant's lists as Teams clients. As Teams users from trusted organization, their capabilities in the Teams meetings will be limited regardless of the assigned Teams meeting role.

The following image shows Teams user joining Teams meeting in the same organizaiton:
![A diagram that shows how external user on Azure Communication Services connects to Teams meeting.](../media/desktop-client-teams-user-joins-teams-meeting.png)

The following image shows Teams user joining Teams meeting in different organizaiton:
![A diagram that shows how external user on Azure Communication Services connects to Teams meeting.](../media/desktop-client-external-user-joins-teams-meeting.png)

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)
