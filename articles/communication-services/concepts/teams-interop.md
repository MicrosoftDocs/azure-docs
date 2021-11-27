---
title: Teams interoperability
titleSuffix: An Azure Communication Services concept document
description: Teams interoperability
author: chpalm
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams interoperability

> [!IMPORTANT]
> Bring your own identity (BYOI) interoperability is in public preview and available to all Communication Services applications and Teams organizations.
>
> Teams identity interoperability is in private preview, and restricted using service controls to Azure Communication Services early adopters. To join early access program, complete [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8MfnD7fOYZEompFbYDoD4JUMkdYT0xKUUJLR001ODdQRk1ITTdOMlRZNSQlQCN0PWcu).
>
> Preview APIs and SDKs are provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services can be used to build custom applications and experiences that enable interaction with Microsoft Teams users over voice, video, chat, and screen sharing. The [Communication Services UI Library](ui-library/ui-library-overview.md) provides customizable, production-ready UI components that can be easily added into these applications. The following video demonstrates some of the capabilities of Teams interoperability:

<br>

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWGTqQ]

## User identity models

Azure Communication Services supports two types of Teams interoperability depending on the identity of the end user:

- **[Bring your own identity (BYOI)](#bring-your-own-identity).** You control user authentication and users of your custom applications don't need to have Azure Active Directory identities or Teams licenses. This model allows you to build custom applications for non-Teams users to connect and communicate with Teams users.
- **[Teams identity](#teams-identity).** User authentication is controlled by Azure Active Directory and users of your custom application must have Teams licenses. This model allows you to build custom applications for Teams users to enable specialized workflows or experiences that are not possible with the standard Teams client.

Applications can implement both authentication models and leave the choice of authentication up to the end user. The following table shows how the two models compare.

|Feature|Bring your own identity| Teams identity|
|---|---|---|
|Identity provider|Any|Azure Active Directory|
|Authentication & authorization|Custom*| Azure Active Directory and custom*|
|Calling available via | Communication Services Calling SDKs | Communication Services Calling SDKs |
|Chat available via | Communication Services Chat SDKs | Graph API |
|Join Teams meetings | Yes | Yes |
|Make and receive calls with Teams users | No | Yes |
|PSTN support| Not supported for Communication Services users in Teams meetings | inbound call assigned to Teams identity, outbound call using calling plan|

\* Server logic issuing access tokens can perform any custom authentication and authorization of the request.

## Bring your own identity

The bring your own identity (BYOI) authentication model allows you to build custom applications for non-Teams users to connect and communicate with Teams users. You control user authentication and users of your custom applications don't need to have Azure Active Directory identities or Teams licenses. The first scenario that has been enabled allows users of your application to join Microsoft Teams meetings as external accounts, similar to [anonymous users that join meetings](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings) using the Teams web application. This is ideal for business-to-consumer applications that bring together employees (familiar with Teams) and external users (using a custom application) into a meeting experience. In the future we will be enabling additional scenarios including direct calling and chat which will allow your application to initiate calls and chats with Teams users outside the context of a Teams meeting.

For more information, see [Join a Teams meeting](join-teams-meeting.md).

It is currently not possible for a Teams user to join a call that was initiated using the Azure Communication Services Calling SDK.

## Teams identity

The Azure Communication Services Calling SDK can be used with Teams identities to build custom applications for Teams users to enable specialized workflows or experiences that are not possible with the standard Teams client. Teams identities are authenticated by Azure Active Directory, and all attributes and details about the user are bound to their Azure Active Directory account.

The Teams identity model is ideal for use cases where a custom user interface is needed, where the Teams client is not available for your platform, or where the Teams client does not support a sufficient level of customization. For example, an application can be used to answer phone calls on behalf of the end user's Teams provisioned PSTN number and have a user interface optimized for a receptionist or call center business process.

When a Communication Services endpoint connects to a Teams meeting or call using a Teams identity, the endpoint is treated like a Teams user with a Teams client, with access to more functionality than BYOI users. Teams users can join Teams meetings, place calls to other Teams user, receive calls from phone numbers, and they can transfer ongoing calls to the Teams call queue.

Calling and screen sharing functionality is available via the Communication Services Calling SDK. Calling management is available via Graph API, configuration in the Teams client or Teams Admin Portal. Chat functionality is available via Graph API.

Teams users are authenticated via the MSAL library against Azure Active Directory in the client application. Authentication tokens received from Azure Active Directory are exchanged for Communication Services access tokens via the Communication Services Identity SDK. You are encouraged to implement an exchange of tokens in your backend services as exchange requests are signed by credentials for Azure Communication Services. In your backend services, you can require any additional authentication.

To learn more about the functionality, join our TAP program for early access by completing [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8MfnD7fOYZEompFbYDoD4JUMkdYT0xKUUJLR001ODdQRk1ITTdOMlRZNSQlQCN0PWcu).

## Teams meeting and calling experiences

There are several ways that users can join a Teams meeting:

- Via Teams clients as authenticated **Teams users**. This includes the desktop, mobile, and web Teams clients.
- Via Teams clients as unauthenticated **Anonymous users**. 
- Via custom Communication Services applications as **BYOI users** using the bring your own identity authentication model. 
- Via custom Communication Services applications as **Teams users** using the Teams identity authentication model.

![Overview of multiple interoperability scenarios within Azure Communication Services](./media/teams-identities/teams-interop-overview-v2.png)

Using the Teams identity authentication model, a Communication Services application allows **Teams users** to join calls with other **Teams users** who are using the Teams clients:
![Overview of interoperability scenarios within Azure Communication Services](./media/teams-identities/teams-interop-microsoft365-identity-interop-overview-v2.png)

## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact, in real time, to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.

## Pricing
All usage of Azure Communication Service APIs and SDKs increments [Azure Communication Service billing meters](https://azure.microsoft.com/pricing/details/communication-services/). Interactions with Microsoft Teams, such as joining a meeting or initiating a phone call using a Teams allocated number, will increment these meters but there is no additional fee for the Teams interoperability capability itself, and there is no pricing distinction between the BYOI and Microsoft 365 authentication options.

If your Azure application has an end user spend 10 minutes in a meeting with a user of Microsoft Teams, those two users combined consumed 20 calling minutes. The 10 minutes exercised through the custom application and using Azure APIs and SDKs will be billed to your resource. However the 10 minutes consumed by the end user in the native Teams application is covered by the applicable Teams license and is not metered by Azure.

## Teams in Government Clouds (GCC)
Azure Communication Services interoperability isn't compatible with Teams deployments using [Microsoft 365 government clouds (GCC)](/MicrosoftTeams/plan-for-government-gcc) at this time.

## Next steps

> [!div class="nextstepaction"]
> [Enable Teams access tokens](../quickstarts/manage-teams-identity.md)
