---
title: Teams meeting interoperability 
titleSuffix: An Azure Communication Services concept document
description: Join Teams meetings
author: chpalm
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Teams interoperability

> [!IMPORTANT]
> To enable/disable [Teams tenant interoperability](../concepts/teams-interop.md), complete [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR21ouQM6BHtHiripswZoZsdURDQ5SUNQTElKR0VZU0VUU1hMOTBBMVhESS4u).

Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, chat, and screen sharing.

Teams interoperability allows you to create custom applications that connect users to Teams meetings. Users of your custom applications don't need to have Azure Active Directory identities or Teams licenses to experience this capability. This is ideal for bringing employees (who may be familiar with Teams) and external users (using a custom application experience) together into a seamless meeting experience. For example:

1. Employees use Teams to schedule a meeting 
1. Meeting details are shared with external users through your custom application.
   * **Using Graph API** Your custom Communication Services application uses the Microsoft Graph APIs to access meeting details to be shared. 
   * **Using other options** For example, your meeting link can be copied from your calendar in Microsoft Teams.
1. External users use your custom application to join the Teams meeting (via the Communication Services Calling and Chat client libraries)

The high-level architecture for this use-case looks like this: 

![Architecture for Teams interop](./media/call-flows/teams-interop.png)

While certain Teams meeting features such as raised hand, together mode, and breakout rooms will only be available for Teams users, your custom application will have access to the meeting's core audio, video, chat, and screen sharing capabilities. Meeting chat will be accessible to your custom application user while they're in the call. They won't be able to send or receive messages before joining or after leaving the call. 

When a Communication Services user joins the Teams meeting, the display name provided through the Calling client library will be shown to Teams users. The Communication Services user will otherwise be treated like an anonymous user in Teams.  Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

Communication Services Teams Interop is currently in private preview. When generally available, Communication Services users will be treated like "External access users". Learn more about external access in [Call, chat, and collaborate with people outside your organization in Microsoft Teams](/microsoftteams/communicate-with-users-from-other-organizations).

Communication Services users can join scheduled Teams meetings as long as anonymous joins are enabled in the [meeting settings](/microsoftteams/meeting-settings-in-teams).

## Teams in Government Clouds (GCC)
Azure Communication Services interoperability isn't compatible with Teams deployments using [Microsoft 365 government clouds (GCC)](/MicrosoftTeams/plan-for-government-gcc) at this time. 

## Next steps

> [!div class="nextstepaction"]
> [Join your calling app to a Teams meeting](../quickstarts/voice-video-calling/get-started-teams-interop.md)