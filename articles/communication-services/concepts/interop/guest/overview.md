---
title: Communication as Teams external user
titleSuffix: An Azure Communication Services concept document
description: Introduction to Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Communication as Teams external user

You can use Azure Communication Services to build applications that enable external users to join and participate in Teams meetings as Teams anonymous users. Customers can join Teams meetings from within your applications or websites. The main benefits are:
- No requirement to download Teams desktop, mobile or web clients for external users
- External users don't lose context by switching to another application
- Browser support on mobile devices
- User interface (UI) customization
- No additional Teams licenses are required

## Use cases
Here are real-world examples of applications:
- Healthcare provider uses Teams clients to conduct telehealth virtual visit with a patient who uses a healthcare provider application or website
- Customers interested in mortgage schedules virtual consultation on Bank's website with a Bank clerk, who joins consultation via Teams client
- Manufacturer schedules a virtual conference for partners to announce the launch of a new product. Partners can join the launch via a web browser on their phones 

## Prototyping

Developers can experiment with the capabilities on multiple levels to evaluate, learn and customize the product.

### Low code or no-code

You can create an identity and access token for Teams external users on Azure portal without a single line of code. [Here are steps how to do it](../../../quickstarts/identity/quick-create-identity.md).

With a valid identity, access token, and Teams meeting URL, you can use [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/story/composites-call-with-chat-jointeamsmeeting--join-teams-meeting) to join Teams meeting without any code.

>[!VIDEO https://www.youtube.com/embed/FF1LS516Bjw]

### Single-click deployment

The [Azure Communication Services Calling Hero Sample](../../../samples/calling-hero-sample.md) demonstrates how developers can use Azure Communication Services Calling Web SDK to join a Teams meeting from a web application as a Teams external user. You can experiment with the capability with single-click deployment to Azure.

The [Azure Communication Services Authentication Hero Sample](../../../samples/trusted-auth-sample.md) demonstrates how developers can use Azure Communication Services Identity SDK to get access tokens as Teams users. You can clone the GitHub repository and follow a simple guide to set up your service for authentication in Azure.

### Coding

The data flow for joining Teams meetings is available at the [client and server architecture page](../../client-and-server-architecture.md). When implementing the experience, you must implement client logic for real-time communication and server logic for authentication. The following articles will guide you in implementing the communication for Teams external users.

High-level coding articles:
- [Authenticate as Teams external user](../../../quickstarts/identity/access-tokens.md) 
- [Call with Chat Composite](https://azure.github.io/communication-ui-library/?path=/docs/composites-call-with-chat-basicexample--basic-example)

Low-level coding articles:
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)

## Supported use cases

The following table show supported use cases for Teams external user with Azure Communication Services:

| Scenario | Supported |
| --- | --- |
| Join Teams meeting | ✔️ |
| Join channel Teams meeting [1] | ✔️ |
| Join Teams webinar [2] | ✔️ |
| [Join Teams live events](/microsoftteams/teams-live-events/what-are-teams-live-events).| ❌ |
| Join [Teams meeting scheduled in application for personal use](https://www.microsoft.com/microsoft-teams/teams-for-home) | ❌ |
| Join Teams 1:1 or group call | ❌ |
| Join Teams 1:1 or group chat | ❌ |

- [1] Teams external users can join a channel Teams meeting with audio and video, but they won't be able to send or receive any chat messages
- [2] Teams external users may join a Teams webinar. However, the presenter and attendee roles aren't honored for Teams external users. Thus Teams external users on Azure Communication Services SDKs could perform actions not intended for attendees, such as screen sharing, turning their camera on/off, or unmuting themselves, if your application provides UX for those actions.

## Pricing
Any licensed Teams users can schedule Teams meetings and share the invite with external users. External users can join the Teams meeting experience via existing Teams desktop, mobile, and web clients without additional charge. External users joining via Azure Communication Services SDKs will pay
[standard Azure Communication Services consumption](https://azure.microsoft.com/pricing/details/communication-services/) for audio, video, and chat. There's no additional fee for the interoperability capability itself.

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/identity//access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
