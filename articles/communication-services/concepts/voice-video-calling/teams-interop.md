---
title: Teams meeting interoperability 
titleSuffix: An Azure Communication Services concept document
description: Join Teams meetings
author: chpalm
manager: mikben
services: azure-communication-services

ms.author: mikben
ms.date: 10/10/2020
ms.topic: overview
ms.service: azure-communication-services
---

## Joining Teams meetings

Azure Communication Services supports anonymous meeting interoperability with Microsoft Teams. Meetings in Microsoft Teams provide audio, video, and screen sharing. They're one of the key ways to collaborate in Teams.

Interoperability allows you to create custom Azure applications that connect users to Teams meetings, even users who do not have Azure Active Directory identities or Teams licenses.

This capability is ideal for bringing together employees (familiar using Teams) and external users (using a custom application experience) together in a single communication space. This is a typical experience:

1. Employees use Teams to schedule a meeting
2. Your service application using the Microsoft Graph APIs to access meeting details
3. Meeting details are shared with external users through your custom application
4. External users leverage the custom application and Azure Communication Services Calling SDK to join the Teams meeting

A high-level architecture:
![Architecture for Teams interop](..//media/call-flows/teams-interop.png)

While certain Teams meeting features such as raised hand, together mode and breakout rooms are only be available for Teams users, your custom application will have access to the meeting's core audio, video, and screen sharing capabilities.

When the Azure Communication user joins the Teams meeting, the display name provided through the Calling SDK will be shown to Teams users. However the Azure Communication user is otherwise treated as anonymous user in Teams. Your custom application should consider user authentication and other security measures protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](https://docs.microsoft.com/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
