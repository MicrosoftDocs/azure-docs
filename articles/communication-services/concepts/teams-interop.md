---
title: Teams meeting interoperability
titleSuffix: An Azure Communication Services concept document
description: Join Teams meetings
author: chpalm
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Teams interoperability

> [!IMPORTANT]
> BYOI interoperability is in public preview and available to all Communication Services applications and Teams organizations.
>
> Microsoft 365 authenticated interoperability is in private preview, and restricted using service controls to Azure Communication Services early adopters. To join early access program, complete [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8MfnD7fOYZEompFbYDoD4JUMkdYT0xKUUJLR001ODdQRk1ITTdOMlRZNSQlQCN0PWcu).
>
> Preview APIs and SDKs are provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services can be used to build custom applications that interact with Microsoft Teams. End users of your Communication Services application can interact with Teams participants over voice, video, chat, and screen sharing.

Azure Communication Services supports two types of Teams interoperability depending on the identity of the end user:

- **Bring your own identity.** You control user authentication and users of your custom applications don't need to have Azure Active Directory identities or Teams licenses to join Teams meetings. Teams treats your application as anonymous external user.
- **Microsoft 365 Teams identity.** Your application acts on behalf of an end user's Microsoft 365 identity and their Teams configured resources. These authenticated applications can make calls and join meetings seamlessly on behalf of Microsoft 365 users.

Applications can implement both authentication schemes and leave the choice of authentication up to the end user.

## Bring your own identity
Bring your own identity (BYOI) is the most common and simplest model for using Azure Communication Services and Teams interoperability. You implement whatever authentication scheme you desire, your app can join Microsoft Teams meetings, and Teams will treat these users as anonymous external accounts. Your Teams organization must be configured to allow anonymous users to join meeting; this can be configured using the Teams admin center or Teams PowerShell.

This capability is ideal for business-to-consumer applications that bring together employees (familiar with Teams) and external users (using a custom application experience) into a meeting experience. For example:

1. Employees use Teams to schedule a meeting
1. Meeting details are shared with external users through your custom application.
   * **Using Graph API** -  Your custom application uses the Microsoft Graph APIs to access meeting details to be shared.
   * **Manual options** - For example, your meeting link can be copied from your calendar in Microsoft Teams.
1. External users use your custom application to join the Teams meeting (via the Communication Services Calling and Chat SDKs)

While certain Teams meeting features such as raised hand, together mode, and breakout rooms will only be available for Teams users, your custom application will have access to the meeting's core audio, video, chat, and screen sharing capabilities. Meeting chat will be accessible to your custom application user while they're in the call. They won't be able to send or receive messages before joining or after leaving the call. If the meeting is scheduled for a channel, Communication Services users will not be able to join the chat or send and receive messages.

When a Communication Services user joins the Teams meeting, the display name provided through the Calling SDK will be shown to Teams users. The Communication Services user will otherwise be treated like an anonymous user in Teams.  

Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

Additional information on required dataflows for joining Teams meetings is available at the [client and server architecture page](client-and-server-architecture.md). The [Group Calling Hero Sample](../samples/calling-hero-sample.md) provides example code for joining a Teams meeting from a Web application.

## Microsoft 365 Teams identity
Authenticating the end user's Microsoft 365 account and authorizing your application through Azure Active Directory allows for a deeper level of interoperability with Microsoft Teams. These applications can make calls and join meetings seamlessly on behalf of Microsoft 365 users. When interacting in a meeting or call, users of the native Teams app will observe your application's end users having the appropriate display name, profile picture, call history, and other Microsoft 365 attributes. Chat functionality is currently available via Graph API.

This identity model is ideal for augmenting a Teams deployment with a fully custom user experience. For example, an application can be used to answer phone calls on behalf of the end user's Teams provisioned PSTN number and have a user interface optimized for a receptionist or call center business process.  

Building an Azure Communication Services app using Microsoft 365 identities requires:
1. Azure Communication Services resource in Azure
2. Azure Active Directory application
3. Application authorization from the end-user or an admin in Azure Active Directory
4. Authentication of the end user's Microsoft 365 identity

Authentication and authorization of the end-users are performed through [Microsoft Authentication Library flows (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview). The following diagram summarizes integrating your calling experiences with authenticated Teams interoperability:

![Process to enable calling feature for custom Teams endpoint experience](./media/teams-identities/teams-identity-calling-overview.png)


## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact, in real time, to your users within your application’s user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.

## Pricing
All usage of Azure Communication Service APIs and SDKs increments [Azure Communication Service billing meters](https://azure.microsoft.com/pricing/details/communication-services/). Interactions with Microsoft Teams, such as joining a meeting or initiating a phone call using a Teams allocated number, will increment these meters but there is no additional fee for the Teams interoperability capability itself, and there is no pricing distinction between the BYOI and Microsoft 365 authentication options.

If your Azure application has an end user spend 10 minutes in a meeting with a user of Microsoft Teams, those two users combined consumed 20 calling minutes. The 10 minutes exercised through the custom application and using Azure APIs and SDKs will be billed to your resource. However the 10 minutes consumed by the end user in the native Teams application is covered by the applicable Teams license and is not metered by Azure.

## Teams in Government Clouds (GCC)
Azure Communication Services interoperability isn't compatible with Teams deployments using [Microsoft 365 government clouds (GCC)](/MicrosoftTeams/plan-for-government-gcc) at this time.

## Next steps

> [!div class="nextstepaction"]
> [Join a BYOI calling app to a Teams meeting](../quickstarts/voice-video-calling/get-started-teams-interop.md)
> [Authenticate Microsoft 365 users](../quickstarts/manage-teams-identity.md)
