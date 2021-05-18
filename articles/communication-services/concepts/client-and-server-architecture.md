---
title: Client and server architecture
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' architecture.
author: mikben
manager: mikben
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# Client and Server Architecture

This page illustrates typical architectural components and dataflows in various Azure Communication Service scenarios. Relevant components include:

1. **Client Application.** This is the website or native application that end-users leverage to communicate. Azure Communication Services provides SDK client libraries for multiple browsers and application platforms. In addition to our core SDKs, a UI toolkit is available to accelerate app devleopment for browsers.
1. **Identity Management Service.**  This is a service capability you build to map users and other concepts in your business logic to Azure Communication Services and also to create tokens for those users when required.
1. **Call Management Service.**  This is a service capability you build to manage and monitor voice and video calls.  This service can create calls, invite users, call phone numbers, play audio, listen to DMTF tones and leverage many other call features through the Calling Automation SDK and REST APIs.


## User access management

Azure Communication Services clients msut present `user access tokens` to access Communication Services resources securely. `User access tokens` should be generated and managed by a trusted service due to the sensitive nature of the token and the connection string or managed identity necessary to generate them. Failure to properly manage access tokens can result in additional charges due to misuse of resources. 

For additional information review [best identity management practices](../../security/fundamentals/identity-management-best-practices.md)

:::image type="content" source="../media/scenarios/architecture_v2_identity.png" alt-text="Diagram showing user access token architecture.":::

### Dataflows
1. The user starts the client application. The design of this application and user authentication scheme is in your control.
2. The client application contacts your identity management service. The identity management service maintains a mapping between your users and other addressable objects (e.g. bots) to Azure Communication Service identities.
3. The identity management service creates a user access token for the applicable identity. If no Azure Communication Services identity has been allocated the past, a new identity is created.  

> [!IMPORTANT]
> For simplicity, we do not show user access management and token distribution in subsequent architecture flows.


## Calling a user without push notifications
The simplest voice and video calling scenarios involves a user calling another, in the foreground without push notifications. 

### Dataflows

1. The accepting user initializes the Call client, allowing them to receive incoming phone calls.
2. The initiating user needs the Azure Communication Services identity of the person they want to call. A typical experience may have a *friend's list* maintained by the identity management service that collates the user's friends and associated Azure Communication Service identities.
3. The initiating user initializes their Call client and calls the remote user.
4. The accepting user is notified of the incoming call through the Calling SDK.
5. The users communicate with each other using voice and video in a call.

## Calling a user with push notifications
In many scenarios a user will not have the application open in the foreground, and push notifications are required to invite users to a call. Azure Communication Services allows you to drive push notifications using Azure EventGrid or Azure Notification Hub. 

:::image type="content" source="../media/scenarios/architecture_v2_calling_without_notifications.png" alt-text="Diagram showing Communication Services Architecture for native app communication.":::

### Dataflows
1. The accepting user initializes the Call client and registers for push notifications. 
2. The initiating user needs the Azure Communication Services identity of the person they want to call. A typical experience may have a *friend's list* maintained by the identity management service that collates the user's friends and associated Azure Communication Service identities.
3. The initiating user initializes their Call client and calls the remote user.
4. The accepting user is notified of the incoming call through a push notification. 
5. The users communicate with each other using voice and video in a call.


## Joining a user-created group call
You may want users to join a call without an explicit invitation. For example you may have a *team space* with an associated call, and users join that call at their leisure. In this first dataflow, we show a call that is initially created by a client.


:::image type="content" source="../media/scenarios/architecture_v2_calling_join_client_driven.png" alt-text="Diagram showing Communication Services Architecture for native app communication.":::

### Dataflows
1. Initiating user initializes their Call client and makes a group call.
2. The initiating user shares the group call id with a Call management service.
3. The Call Management Service shares the call id with other users. For example, if the application orients around scheduled events, the group call id might be an attribute of the scheduled event's data model.
4. Other users join the call using the group call id.
5. The users communicate with each other using voice and video in a call.


## Joining a service-created group call
In many scenarios it is easier and more secure for a service to create a group call and then users join that call.
:::image type="content" source="../media/scenarios/architecture_v2_calling_join_service_driven.png" alt-text="Diagram showing Communication Services Architecture for native app communication.":::

### Dataflows
1. The Call Management Service creates a group call with [Call Automation APIs](../voice-video-calling/call-automation-apis). The service can invite specific users and monitor participants in real-time.
2. Users receive the group call id from the Call Manaagemnt Service.
3. User join the call.
4. The users communicate with eachother using voice and video in a call.

## PSTN enabled calling
Clients and services can add PSTN numbers to a call. 

### Dataflows

## Joining bots and services to calls

### Dataflows



## Joining a scheduled Teams call
Azure Communication Service applications can join Teams calls. This is ideal for many business-to-consumer scenarios, where the consumer is leveraging a custom application and custom identity, while the business-side is using Teams. 

:::image type="content" source="../media/scenarios/architecture_v2_calling_join_teams_driven.png" alt-text="Diagram showing Communication Services Architecture for native app communication.":::


### Dataflows
1. The Call Management Service creates a group call with [Graph APIs](https://docs.microsoft.com/en-us/graph/api/resources/onlinemeeting?view=graph-rest-1.0). Another pattern involves end-users creating the group call using Outlook, Teams, or another scheduling experience in the M365 ecosystem.
2. The Call Management Service shares the Team call details with Azure Communication Service clients.
3. Typically, a Teams user must join the call and allow external users to join through the lobby. However  this is sensitive to the Teams tenant configuration and specific meeting settings.
3. Azure Communication Service users initialize their Call client and join the Teams meeting, using the details received in Step 2.
4. The users communicate with eachother using voice and video in a call.

## Chat

### Dataflows

## SMS
### Dataflows


## Device to Device networking with TURN
### Dataflows


## Next steps

> [!div class="nextstepaction"]
> [Creating user access tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:

- Learn about [authentication](../concepts/authentication.md)
- Learn about [Phone number types](../concepts/telephony-sms/plan-solution.md)

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
