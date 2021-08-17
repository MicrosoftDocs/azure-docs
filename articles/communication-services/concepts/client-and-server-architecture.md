---
title: Client and server architecture
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' architecture.
author: mikben
manager: mikben
services: azure-communication-services

ms.author: mikben
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# Client and Server Architecture

This page illustrates typical architectural components and dataflows in various Azure Communication Service scenarios. Relevant components include:

1. **Client Application.** This website or native application is leveraged by end-users to communicate. Azure Communication Services provides [SDK client libraries](sdk-options.md) for multiple browsers and application platforms. In addition to our core SDKs, [a UI toolkit](https://aka.ms/acsstorybook) is available to accelerate browser app development.
1. **Identity Management Service.**  This service capability you build to map users and other concepts in your business logic to Azure Communication Services and also to create tokens for those users when required.
1. **Call Management Service.**  This service capability you build to manage and monitor voice and video calls.  This service can create calls, invite users, call phone numbers, play audio, listen to DMTF tones and leverage many other call features through the Calling Automation SDK and REST APIs.


## User access management

Azure Communication Services clients must present `user access tokens` to access Communication Services resources securely. `User access tokens` should be generated and managed by a trusted service due to the sensitive nature of the token and the connection string or managed identity necessary to generate them. Failure to properly manage access tokens can result in additional charges due to misuse of resources.

:::image type="content" source="../media/scenarios/architecture_v2_identity.svg" alt-text="Diagram showing user access token architecture.":::

### Dataflows
1. The user starts the client application. The design of this application and user authentication scheme is in your control.
2. The client application contacts your identity management service. The identity management service maintains a mapping between your users and other addressable objects (for example services or bots) to Azure Communication Service identities.
3. The identity management service creates a user access token for the applicable identity. If no Azure Communication Services identity has been allocated the past, a new identity is created.  

### Resources
- **Concept:** [User Identity](identity-model.md)
- **Quickstart:** [Create and manage access tokens](../quickstarts/access-tokens.md)
- **Tutorial:** [Build a identity management services use Azure Functions](../tutorials/trusted-service-tutorial.md)

> [!IMPORTANT]
> For simplicity, we do not show user access management and token distribution in subsequent architecture flows.


## Calling a user without push notifications
The simplest voice and video calling scenarios involves a user calling another, in the foreground without push notifications.

:::image type="content" source="../media/scenarios/architecture_v2_calling_without_notifications.svg" alt-text="Diagram showing Communication Services architecture calling without push notifications.":::

### Dataflows

1. The accepting user initializes the Call client, allowing them to receive incoming phone calls.
2. The initiating user needs the Azure Communication Services identity of the person they want to call. A typical experience may have a *friend's list* maintained by the identity management service that collates the user's friends and associated Azure Communication Service identities.
3. The initiating user initializes their Call client and calls the remote user.
4. The accepting user is notified of the incoming call through the Calling SDK.
5. The users communicate with each other using voice and video in a call.

### Resources
- **Concept:** [Calling Overview](voice-video-calling/calling-sdk-features.md)
- **Quickstart:** [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- **Quickstart:** [Add video calling to your app](../quickstarts/voice-video-calling/get-started-with-video-calling.md)
- **Hero Sample:** [Group Calling for Web, iOS, and Android](../samples/calling-hero-sample.md)


## Joining a user-created group call
You may want users to join a call without an explicit invitation. For example you may have a *social space* with an associated call, and users join that call at their leisure. In this first dataflow, we show a call that is initially created by a client.

:::image type="content" source="../media/scenarios/architecture_v2_calling_join_client_driven.svg" alt-text="Diagram showing Communication Services architecture calling out-of-band signaling.":::

### Dataflows
1. Initiating user initializes their Call client and makes a group call.
2. The initiating user shares the group call ID with a Call management service.
3. The Call Management Service shares the call ID with other users. For example, if the application orients around scheduled events, the group call ID might be an attribute of the scheduled event's data model.
4. Other users join the call using the group call ID.
5. The users communicate with each other using voice and video in a call.


## Joining a scheduled Teams call
Azure Communication Service applications can join Teams calls. This is ideal for many business-to-consumer scenarios, where the consumer is leveraging a custom application and custom identity, while the business-side is using Teams.

:::image type="content" source="../media/scenarios/architecture_v2_calling_join_teams_driven.svg" alt-text="Diagram showing Communication Services architecture for joining a Teams meeting.":::


### Dataflows
1. The Call Management Service creates a group call with [Graph APIs](/graph/api/resources/onlinemeeting?view=graph-rest-1.0). Another pattern involves end users creating the group call using [Bookings](https://www.microsoft.com/microsoft-365/business/scheduling-and-booking-app), Outlook, Teams, or another scheduling experience in the Microsoft 365 ecosystem.
2. The Call Management Service shares the Teams call details with Azure Communication Service clients.
3. Typically, a Teams user must join the call and allow external users to join through the lobby. However this experience is sensitive to the Teams tenant configuration and specific meeting settings.
4. Azure Communication Service users initialize their Call client and join the Teams meeting, using the details received in Step 2.
5. The users communicate with each other using voice and video in a call.

### Resources
- **Concept:** [Teams Interoperability](teams-interop.md)
- **Quickstart:** [Join a Teams meeting](../quickstarts/voice-video-calling/get-started-teams-interop.md)