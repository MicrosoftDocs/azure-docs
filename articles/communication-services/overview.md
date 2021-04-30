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

Azure Communication Services allows you to easily add real-time voice, video, and telephone communication to your applications. Communication Services SDKs also allow you to add SMS functionality to your communications solutions. Azure Communication Services is identity agnostic and you have complete control over how end users are identified and authenticated. You can connect humans to the communication data plane or services (bots).

Applications include:

- **Business to Consumer (B2C).** A business' employees and services can interact with consumers using voice, video, and rich text chat in a custom browser or mobile application. An organization can send and receive SMS messages, or operate an interactive voice response system (IVR) using a phone number you acquire through Azure. [Integration with Microsoft Teams](./quickstarts/voice-video-calling/get-started-teams-interop.md) allows consumers to join Teams meetings hosted by employees; ideal for remote healthcare, banking, and product support scenarios where employees might already be familiar with Teams.
- **Consumer to Consumer.** Build engaging social spaces for consumer-to-consumer interaction with voice, video, and rich text chat. Any type of user interface can be built on Azure Communication Services SDKs, but complete application samples and UI assets are available to help you get started quickly.

To learn more, check out our [Microsoft Mechanics video](https://www.youtube.com/watch?v=apBX7ASurgM) or the resources linked below.

## Common scenarios

<br>

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create a Communication Services resource](./quickstarts/create-communication-resource.md)**|Begin using Azure Communication Services by using the Azure portal or Communication Services SDK to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provision your first user access tokens.|
|**[Get a phone number](./quickstarts/telephony-sms/get-phone-number.md)**|You can use Azure Communication Services to provision and release telephone numbers. These telephone numbers can be used to initiate or receive phone calls and build SMS solutions.|
|**[Send an SMS from your app](./quickstarts/telephony-sms/send.md)**|The Azure Communication Services SMS SDK is used send and receive SMS messages from service applications.|

After creating a Communication Services resource you can start building client scenarios, such as voice and video calling or text chat:

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create your first user access token](./quickstarts/access-tokens.md)**|User access tokens are used to authenticate clients against your Azure Communication Services resource. These tokens are provisioned and reissued using the Communication Services SDK.|
|**[Get started with voice and video calling](./quickstarts/voice-video-calling/getting-started-with-calling.md)**| Azure Communication Services allows you to add voice and video calling to your browser or native apps using the Calling SDK. |
|**[Join your calling app to a Teams meeting](./quickstarts/voice-video-calling/get-started-teams-interop.md)**|Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, chat, and screen sharing.|
|**[Get started with chat](./quickstarts/chat/get-started.md)**|The Azure Communication Services Chat SDK is used to add rich real-time text chat into your applications.|

## Samples

The following samples demonstrate end-to-end usage of the Azure Communication Services. Use these samples to bootstrap your own Communication Services solutions.
<br>

| Sample name                               | Description                           |
|---                                    |---                                   |
|**[The Group Calling Hero Sample](./samples/calling-hero-sample.md)**| Download a designed application sample for group calling for browsers, iOS, and Android devices. |
|**[The Group Chat Hero Sample](./samples/chat-hero-sample.md)**| Download a designed application sample for group text chat for browsers. |


## Platforms and SDK libraries

Learn more about the Azure Communication Services SDKs with the resources below. REST APIs are available for most functionality if you want to build your own clients or otherwise access the service over the Internet.

| Resource                               | Description                           |
|---                                    |---                                   |
|**[SDK libraries and REST APIs](./concepts/sdk-options.md)**|Azure Communication Services capabilities are conceptually organized into six areas, each represented by an SDK. You can decide which SDK libraries to use based on your real-time communication needs.|
|**[Calling SDK overview](./concepts/voice-video-calling/calling-sdk-features.md)**|Review the Communication Services Calling SDK overview.|
|**[Chat SDK overview](./concepts/chat/sdk-features.md)**|Review the Communication Services Chat SDK overview.|
|**[SMS SDK overview](./concepts/telephony-sms/sdk-features.md)**|Review the Communication Services SMS SDK overview.|

## Other Microsoft Communication Services

There are two other Microsoft communication products you may consider using that are not directly interoperable with Communication Services at this time:

 - [Microsoft Graph Cloud Communication APIs](/graph/cloud-communications-concept-overview) allow organizations to build communication experiences tied to Azure Active Directory users with Microsoft 365 licenses. This is ideal for applications tied to Azure Active Directory or where you want to extend productivity experiences in Microsoft Teams. There are also APIs to build applications and customization within the [Teams experience.](/microsoftteams/platform/?preserve-view=true&view=msteams-client-js-latest)

 - [Azure PlayFab Party](/gaming/playfab/features/multiplayer/networking/) simplifies adding low-latency chat and data communication to games. While you can power gaming chat and networking systems with Communication Services, PlayFab is a tailored option and free on Xbox.


## Next Steps

 - [Create a Communication Services resource](./quickstarts/create-communication-resource.md)
