---
title: What is Azure Communication Services?
description: Learn how Azure Communication Services helps you develop rich user experiences with real-time communications.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 07/20/2020
ms.topic: overview
ms.service: azure-communication-services

---

# What is Azure Communication Services?

[!INCLUDE [Public Preview Notice](./includes/public-preview-include.md)]

Azure Communication Services allows you to easily add real-time multimedia voice, video, and telephony-over-IP communications features to your applications. The Communication Services client libraries also allow you to add chat and SMS functionality to your communications solutions.

<br>

> [!VIDEO https://www.youtube.com/embed/49oshhgY6UQ]

<br>
<br>

You can use Communication Services for voice, video, text, and data communication in a variety of scenarios:

- Browser-to-browser, browser-to-app, and app-to-app communication
- Users interacting with bots or other services
- Users and bots interacting over the public switched telephony network

Mixed scenarios are supported. For example, a Communication Services application may have users speaking from browsers and traditional telephony devices at the same time. Communication Services may also be combined with Azure Bot Service to build bot-driven interactive voice response (IVR) systems.

## Common scenarios

The following resources are a great place to start if you're new to Azure Communication Services:
<br>

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create a Communication Services resource](./quickstarts/create-communication-resource.md)**|You can begin using Azure Communication Services by using the Azure portal or Communication Services Administration client library to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provision your first user access tokens.|
|**[Create your first user access token](./quickstarts/access-tokens.md)**|User access tokens are used to authenticate your services against your Azure Communication Services resource. These tokens are provisioned and reissued using the Communication Services Administration client library.|
|**[Get a phone number](./quickstarts/telephony-sms/get-phone-number.md)**|You can use Azure Communication Services to provision and release telephone numbers. These telephone numbers can be used to initiate outbound calls and build SMS communications solutions.|
|**[Send an SMS from your app](./quickstarts/telephony-sms/send.md)**|The Azure Communication Services SMS client library allows you to send and receive SMS messages from your .NET and JavaScript applications.|
|**[Get started with voice and video calling](./quickstarts/voice-video-calling/getting-started-with-calling.md)**| Azure Communication Services allows you to add voice and video calling to your apps using the Calling client library. This library is powered by WebRTC and allows you to establish peer-to-peer, multimedia, real-time communications within your applications.|
|**[Get started with chat](./quickstarts/chat/get-started.md)**|The Azure Communication Services Chat client library can be used to integrate real-time chat into your applications.|


## Samples

The following samples demonstrate end-to-end utilization of the Azure Communication Services client libraries. Feel free to use these samples to bootstrap your own Communication Services solutions.
<br>

| Sample name                               | Description                           |
|---                                    |---                                   |
|**[The Group Calling Hero Sample](./samples/calling-hero-sample.md)**|See how the Communication Services client libraries can be used to build a group calling experience.|
|**[The Group Chat Hero Sample](./samples/chat-hero-sample.md)**|See how the Communication Services client libraries can be used to build a group chat experience.|


## Platforms and client libraries

The following resources will help you learn about the Azure Communication Services client libraries:

| Resource                               | Description                           |
|---                                    |---                                   |
|**[Client libraries and REST APIs](./concepts/sdk-options.md)**|Azure Communication Services capabilities are conceptually organized into six areas, each represented by a client library. You can decide which client libraries to use based on your real-time communication needs.|
|**[Calling client library overview](./concepts/voice-video-calling/calling-sdk-features.md)**|Review the Communication Services Calling client library overview.|
|**[Chat client library overview](./concepts/chat/sdk-features.md)**|Review the Communication Services Chat client library overview.|
|**[SMS client library overview](./concepts/telephony-sms/sdk-features.md)**|Review the Communication Services SMS client library overview.|

## Compare Azure Communication Services

There are two other Microsoft communication products you may consider leveraging that are not directly interoperable with Communication Services at this time:

 - [Microsoft Graph Cloud Communication APIs](https://docs.microsoft.com/graph/cloud-communications-concept-overview) allow organizations to build communication experiences tied to Azure Active Directory users with M365 licenses. This is ideal for applications tied to Azure Active Directory or where you want to extend productivity experiences in Microsoft Teams. There are also APIs to build applications and customization within the [Teams experience.](https://docs.microsoft.com/microsoftteams/platform/?view=msteams-client-js-latest&preserve-view=true)

 - [Azure PlayFab Party](https://docs.microsoft.com/gaming/playfab/features/multiplayer/networking/) simplifies adding low-latency chat and data communication to games. While you can power gaming chat and networking systems with Communication Services, PlayFab is a tailored option and free on Xbox.


## Next Steps

 - [Create a Communication Services resource](./quickstarts/create-communication-resource.md)
