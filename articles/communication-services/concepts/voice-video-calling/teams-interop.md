---
title: Teams meeting interoperability 
titleSuffix: An Azure Communication Services concept document
description: Join Teams meetings
author: chpalm
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 10/10/2020
ms.topic: overview
ms.service: azure-communication-services
---

# Teams interoperability

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, and screen sharing.

This interoperability allows you to create custom Azure applications that connect users to Teams meetings. Users of your custom applications don't need to have Azure Active Directory identities or Teams licenses to experience this capability. This is ideal for bringing employees (who may be familiar with Teams) and external users (using a custom application experience) together into a seamless meeting experience. This allows you to build experiences similar to the following:

1. Employees use Teams to schedule a meeting
2. Your custom Communication Services application uses the Microsoft Graph APIs to access meeting details
3. Meeting details are shared with external users through your custom application
4. External users use your custom application to join the Teams meeting (via the Communication Services Calling client library)

The high-level architecture for this use-case looks like this: 

![Architecture for Teams interop](..//media/call-flows/teams-interop.png)

While certain Teams meeting features such as raised hand, together mode, and breakout rooms will only be available for Teams users, your custom application will have access to the meeting's core audio, video, and screen sharing capabilities.

When a Communication Services user joins the Teams meeting, the display name provided through the Calling client library will be shown to Teams users. The Communication Services user will otherwise be treated like an anonymous user in Teams. Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](https://docs.microsoft.com/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

Communication Services users can join scheduled Teams meetings as long as anonymous joins are enabled in the [meeting settings](https://docs.microsoft.com/microsoftteams/meeting-settings-in-teams).



## Next steps

> [!div class="nextstepaction"]
> [Join your calling app to a Teams meeting](../../quickstarts/voice-video-calling/get-started-teams-interop.md)
