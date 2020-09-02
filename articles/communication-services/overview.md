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

# What Is Azure Communication Services?

[!INCLUDE [Public Preview Notice](./includes/public-preview-include.md)]

Azure Communication Services allows you to easily add real-time multimedia voice, video, and telephony-over-IP communications features to your applications. The Communication Services SDKs also allow you to add chat and SMS functionality to your communications solutions.

When you use Communication Services, you're building on top of the same infrastructure that powers Microsoft Teams and the consumer Skype experience. These services seamlessly auto-scale for global deployments of any size. You can use Communication Services for voice, video, text, and data communication in a variety of scenarios:

- Browser-to-browser, browser-to-app, and app-to-app communication
- Users interacting with bots or other services
- Users and bots interacting over the public switched telephony network

Mixed scenarios are supported. For example, a Communication Services application may have users speaking from browsers and traditional telephony devices at the same time. Communication Services may also be combined with Azure Bot Service to build bot-driven interactive voice response (IVR) systems.

## Common scenarios

The following resources are a great place to start if you're new to Azure Communication Services:
<br>

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create a Communication Services resource](./quickstarts/create-a-communication-resource.md)**|You can begin using Azure Communication Services by using the Azure portal or Communication Services Administration SDK to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provision your first user access tokens.|
|**[Create your first user access token](./quickstarts/user-access-tokens.md)**|User access tokens are used to authenticate your services against your Azure Communication Services resource. These tokens are provisioned and reissued using the Communication Services Administration SDK.|
|**[Get a phone number](./quickstarts/telephony-and-sms/get-a-phone-number.md)**|You can use Azure Communication Services to provision and release telephone numbers. These telephone numbers can be used to initiate outbound calls, receive inbound calls, and build SMS communications solutions.|
|**[Send an SMS from your app](./quickstarts/telephony-and-sms/send-sms.md)**|The Azure Communication Services SMS SDK allows you to send and receive SMS messages from your .NET and JavaScript applications.|
|**[Get started with voice and video calling](./quickstarts/voice-and-video-calling/getting-started-with-calling.md)**| Azure Communication Services allows you to add voice and video calling to your apps using the Calling SDK. This SDK is powered by WebRTC and allows you to establish peer-to-peer, multimedia, real-time communications within your applications.|
|**[Get started with chat](./quickstarts/chat/get-started-with-chat.md)**|The Azure Communication Services Chat SDK can be used to integrate real-time chat into your applications.|


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
|**[Calling SDK overview](./concepts/voice-and-video-calling/calling-sdk-features.md)**|Review the Communication Services Calling SDK overview.|
|**[Chat SDK overview](./concepts/chat/chat-sdk-features.md)**|Review the Communication Services Chat SDK overview.|
|**[SMS SDK overview](./concepts/telephony-and-sms/sms-sdk-features.md)**|Review the Communication Services SMS SDK overview.|


## Next Steps

 - [Create a Communication Services resource](./quickstarts/create-a-communication-resource.md)
 - [Compare communication services](./compare.md)
