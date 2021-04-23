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

Every Azure Communication Services application will have **client applications** that use **services** to facilitate person-to-person connectivity. This page illustrates common architectural elements in a variety of scenarios.

## User access management

Azure Communication Services SDKs require `user access tokens` to access Communication Services resources securely. `User access tokens` should be generated and managed by a trusted service due to the sensitive nature of the token and the connection string necessary to generate them. Failure to properly manage access tokens can result in additional charges due to misuse of resources. It is highly recommended to make use of a trusted service for user management. The trusted service will generate the tokens and pass them back to the client using proper encryption. A sample architecture flow can be found below:

:::image type="content" source="../media/scenarios/archdiagram-access.png" alt-text="Diagram showing user access token architecture.":::

For additional information review [best identity management practices](../../security/fundamentals/identity-management-best-practices.md)

## Browser communication

Azure Communications JavaScript SDKs can enable web applications with rich text, voice, and video interaction. The application directly interacts with Azure Communication Services through the SDK to access the data plane and deliver real-time text, voice, and video communication. A sample architecture flow can be found below:

:::image type="content" source="../media/scenarios/archdiagram-browser.png" alt-text="Diagram showing the browser to browser Architecture for Communication Services.":::

## Native app communication

Many scenarios are best served with native applications. Azure Communication Services supports both browser-to-app and app-to-app communication.  When building a native application experience, having push notifications will enable users to receive calls even when the application is not running. Azure Communication Services makes this easy with integrated push notifications to Google Firebase, Apple Push Notification Service, and Windows Push Notifications. A sample architecture flow can be found below:

:::image type="content" source="../media/scenarios/archdiagram-app.png" alt-text="Diagram showing Communication Services Architecture for native app communication.":::

## Voice and SMS over the public switched telephony network (PSTN)

Communicating over the phone system can dramatically increase the reach of your application. To support PSTN voice and SMS scenarios, Azure Communication Services helps you [acquire phone numbers](../quickstarts/telephony-sms/get-phone-number.md) directly from the Azure portal or using REST APIs and SDKs. Once phone numbers are acquired, they can be used to reach customers using both PSTN calling and SMS in both inbound and outbound scenarios. A sample architecture flow can be found below:

> [!Note]
> During public preview, the provisioning of US phone numbers is available to customers with billing addresses located within the US and Canada.

:::image type="content" source="../media/scenarios/archdiagram-pstn.png" alt-text="Diagram showing Communication Services PSTN architecture.":::

For more information on PSTN phone numbers, see [Phone number types](../concepts/telephony-sms/plan-solution.md)

## Humans communicating with bots and other services

Azure Communication Services supports human-to-system communication though text and voice channels, with services that directly access the Azure Communication Services data plane. For example, you can have a bot answer incoming phone calls or participate in a web chat. Azure Communication Services provides SDKs that enable these scenarios for calling and chat. A sample architecture flow can be found below:

:::image type="content" source="../media/scenarios/archdiagram-bot.png" alt-text="Diagram showing Communication Services Bot architecture.":::

## Networking

You may want to exchange arbitrary data between users, for example to synchronize a shared mixed reality or gaming experience. The real-time data plane used for text, voice, and video communication is available to you directly in two ways:

- **Calling SDK** - Devices in a call have access to APIs for sending and receiving data over the call channel. This is the easiest way to add data communication to an existing interaction.
- **STUN/TURN** - Azure Communication Services makes standards-compliant STUN and TURN services available to you. This allows you to build a heavily customized transport layer on top of these standardized primitives. You can author your own standards-compliant client or use open-source libraries such as [WinRTC](https://github.com/microsoft/winrtc).

## Next steps

> [!div class="nextstepaction"]
> [Creating user access tokens](../quickstarts/access-tokens.md)

For more information, see the following articles:

- Learn about [authentication](../concepts/authentication.md)
- Learn about [Phone number types](../concepts/telephony-sms/plan-solution.md)

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
