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

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

> [!NOTE]
> Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting. Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact, in real time, to your users within your application’s user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.

> [!NOTE]
> VoIP and Chat usage is only billed to your Azure resource when using Azure APIs and SDKs. Teams clients interacting with Azure Communication Services applications are free.

Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, chat, and screen sharing.

Teams interoperability allows you to create custom applications that connect users to Teams meetings. Users of your custom applications don't need to have Azure Active Directory identities or Teams licenses to experience this capability. This is ideal for bringing employees (who may be familiar with Teams) and external users (using a custom application experience) together into a seamless meeting experience. For example:

1. Employees use Teams to schedule a meeting 
1. Meeting details are shared with external users through your custom application.
   * **Using Graph API** Your custom Communication Services application uses the Microsoft Graph APIs to access meeting details to be shared. 
   * **Using other options** For example, your meeting link can be copied from your calendar in Microsoft Teams.
1. External users use your custom application to join the Teams meeting (via the Communication Services Calling and Chat SDKs)

The high-level architecture for this use-case looks like this: 

![Architecture for Teams interop](./media/call-flows/teams-interop.png)

While certain Teams meeting features such as raised hand, together mode, and breakout rooms will only be available for Teams users, your custom application will have access to the meeting's core audio, video, chat, and screen sharing capabilities. Meeting chat will be accessible to your custom application user while they're in the call. They won't be able to send or receive messages before joining or after leaving the call. 

When a Communication Services user joins the Teams meeting, the display name provided through the Calling SDK will be shown to Teams users. The Communication Services user will otherwise be treated like an anonymous user in Teams.  Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

Communication Services Teams Interop is currently in private preview. When generally available, Communication Services users will be treated like "External access users". Learn more about external access in [Call, chat, and collaborate with people outside your organization in Microsoft Teams](/microsoftteams/communicate-with-users-from-other-organizations).

Communication Services users can join scheduled Teams meetings as long as anonymous joins are enabled in the [meeting settings](/microsoftteams/meeting-settings-in-teams). If the meeting is scheduled for a channel, Communication Services users will not be able to join the chat or send and receive messages.

## Enabling and configuring Teams interop
Teams-ACS federation (interoperability) is managed using tenant level configuration settings, together with a user level policy if you wish to restrict which users are able to use Teams-ACS federation.

The tenant level Teams-ACS federation configuration is managed using the cmdlet [Set-CsTeamsAcsFederationConfiguration](https://docs.microsoft.com/en-us/powershell/module/teams/set-csteamsacsfederationconfiguration?view=teams-ps), which is used to enable or disable Teams and ACS federation for a Teams tenant, and to specify which ACS resources can connect to Teams. Teams-ACS federation is enabled by default. All ACS resources can be allowed, with possible exclusions, or just selected ACS resources can be allowed. See the cmdlet documentation for more details.

The user level Teams-ACS federation policy is managed using the cmdlets [New-CsExternalAccessPolicy](https://docs.microsoft.com/en-us/powershell/module/skype/new-csexternalaccesspolicy?view=skype-ps), [Set-CsExternalAccessPolicy](https://docs.microsoft.com/en-us/powershell/module/skype/set-csexternalaccesspolicy?view=skype-ps) and [Grant-CsExternalAccessPolicy](https://docs.microsoft.com/en-us/powershell/module/skype/grant-csexternalaccesspolicy?view=skype-ps). By default, all users are able to use Team-ACS federation, once it is enabled at the tenant level. The user level policy is only needed if you wish to restrict which users are able to use Teams-ACS federation—you can enable for all users, and disabled just for a selected set of users, or you can disable for all users and enabled for just a selected set of users. See the cmdlet documentation for more details.


## Teams in Government Clouds (GCC)
Azure Communication Services interoperability isn't compatible with Teams deployments using [Microsoft 365 government clouds (GCC)](/MicrosoftTeams/plan-for-government-gcc) at this time. 

## Next steps

> [!div class="nextstepaction"]
> [Join your calling app to a Teams meeting](../quickstarts/voice-video-calling/get-started-teams-interop.md)

For more information, see the following articles:

- Learn about [UI Library](./ui-library/ui-library-overview.md)
- Learn about [UI Library capabilities](./ui-library/ui-library-use-cases.md)
