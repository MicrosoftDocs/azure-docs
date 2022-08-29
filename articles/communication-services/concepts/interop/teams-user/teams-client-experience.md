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

# Experience for users in Teams client interacting with Teams users
Teams users calling users in the same organization or joining Teams meetings organized in the same organization will be represented in Teams client as any other Teams user. Teams users calling users in trusted organizations or joining Teams meetings organized in trusted organizations will be represented in Teams clients as Teams users from different organizations. Teams users from the other organizations will be marked as "external" in the participant's lists as Teams clients. As Teams users from a trusted organization, their capabilities in the Teams meetings will be limited regardless of the assigned Teams meeting role.

## Joining meetings within the organization
The following image illustrates the experience of a Teams user using Teams client interacting with another Teams user from the same organization using Azure Communication Services SDK who joined Teams meeting.
![A diagram that shows how a Teams user on Azure Communication Services connects to a Teams meeting organized by the same organization.](../media/desktop-client-teams-user-joins-teams-meeting.png)

## Joining meetings outside of the organization
The following image illustrates the experience of a Teams user using Teams client interacting with another Teams user from a different organization using Azure Communication Services SDK who joined Teams meeting.
![A diagram that shows how Teams user on Azure Communication Services connects to Teams meetings organized by a different organization.](../media/desktop-client-external-user-joins-teams-meeting.png)

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)
