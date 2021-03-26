---
title: What is Azure Communication Services?
description: Learn how Azure Communication Services helps you develop rich user experiences with real-time communications.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services

---

# What is Azure Communication Services?

[!INCLUDE [Public Preview Notice](./includes/public-preview-include.md)]

> [!IMPORTANT]
> Applications that you build using Azure Communication Services can talk to Microsoft Teams. To learn more, visit our [Teams Interop](./quickstarts/voice-video-calling/get-started-teams-interop.md) documentation.


Azure Communication Services allows you to easily add real-time multimedia voice, video, and telephony-over-IP communications features to your applications. The Communication Services SDKs also allow you to add chat and SMS functionality to your communications solutions.

<br>

> [!VIDEO https://www.youtube.com/embed/apBX7ASurgM]

<br>
<br>

You can use Communication Services for voice, video, text, and data communication in a variety of scenarios:

- Browser-to-browser, browser-to-app, and app-to-app communication
- Users interacting with bots or other services
- Users and bots interacting over the public switched telephony network

Mixed scenarios are supported. For example, a Communication Services application may have users speaking from browsers and traditional telephony devices at the same time. Communication Services may also be combined with Azure Bot Service to build bot-driven interactive voice response (IVR) systems.

## Common scenarios

The following resources are a great place to get started with Azure Communication Services. 
<br>

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create a Communication Services resource](./quickstarts/create-communication-resource.md)**|You can begin using Azure Communication Services by using the Azure portal or Communication Services  SDK to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provision your first user access tokens.|
|**[Get a phone number](./quickstarts/telephony-sms/get-phone-number.md)**|You can use Azure Communication Services to provision and release telephone numbers. These telephone numbers can be used to initiate outbound calls and build SMS communications solutions.|
|**[Send an SMS from your app](./quickstarts/telephony-sms/send.md)**|The Azure Communication Services SMS SDK allows you to send and receive SMS messages from your .NET and JavaScript applications.|

After creating an Communication Services resource you can start building client scenarios, such as voice and video calling or text chat.

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create your first user access token](./quickstarts/access-tokens.md)**|User access tokens are used to authenticate your services against your Azure Communication Services resource. These tokens are provisioned and reissued using the Communication Services  SDK.|
|**[Get started with voice and video calling](./quickstarts/voice-video-calling/getting-started-with-calling.md)**| Azure Communication Services allows you to add voice and video calling to your apps using the Calling SDK. This library is powered by WebRTC and allows you to establish peer-to-peer, multimedia, real-time communications within your applications.|
|**[Join your calling app to a Teams meeting](./quickstarts/voice-video-calling/get-started-teams-interop.md)**|Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, chat, and screen sharing.|
|**[Get started with chat](./quickstarts/chat/get-started.md)**|The Azure Communication Services Chat SDK can be used to integrate real-time chat into your applications.|

## Samples

The following samples demonstrate end-to-end utilization of the Azure Communication Services SDKs. Feel free to use these samples to bootstrap your own Communication Services solutions.
<br>

| Sample name                               | Description                           |
|---                                    |---                                   |
|**[The Group Calling Hero Sample](./samples/calling-hero-sample.md)**|See how the Communication Services SDKs can be used to build a group calling experience.|
|**[The Group Chat Hero Sample](./samples/chat-hero-sample.md)**|See how the Communication Services SDKs can be used to build a group chat experience.|


## Platforms and SDKs

The following resources will help you learn about the Azure Communication Services SDKs:

| Resource                               | Description                           |
|---                                    |---                                   |
|**[SDKs and REST APIs](./concepts/sdk-options.md)**|Azure Communication Services capabilities are conceptually organized into six areas, each represented by an SDK. You can decide which SDKs to use based on your real-time communication needs.|
|**[Calling SDK overview](./concepts/voice-video-calling/calling-sdk-features.md)**|Review the Communication Services Calling SDK overview.|
|**[Chat SDK overview](./concepts/chat/sdk-features.md)**|Review the Communication Services Chat SDK overview.|
|**[SMS SDK overview](./concepts/telephony-sms/sdk-features.md)**|Review the Communication Services SMS SDK overview.|

## Compare Azure Communication Services

There are two other Microsoft communication products you may consider leveraging that are not directly interoperable with Communication Services at this time:

 - [Microsoft Graph Cloud Communication APIs](/graph/cloud-communications-concept-overview) allow organizations to build communication experiences tied to Azure Active Directory users with Microsoft 365 licenses. This is ideal for applications tied to Azure Active Directory or where you want to extend productivity experiences in Microsoft Teams. There are also APIs to build applications and customization within the [Teams experience.](/microsoftteams/platform/?preserve-view=true&view=msteams-client-js-latest)

 - [Azure PlayFab Party](/gaming/playfab/features/multiplayer/networking/) simplifies adding low-latency chat and data communication to games. While you can power gaming chat and networking systems with Communication Services, PlayFab is a tailored option and free on Xbox.


## Next Steps

 - [Create a Communication Services resource](./quickstarts/create-communication-resource.md)
