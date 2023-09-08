---
title: What is Azure Communication Services?
description: Learn how Azure Communication Services helps you develop rich user experiences with real-time communications.
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---

# What is Azure Communication Services?

Azure Communication Services are cloud-based services with REST APIs and client library SDKs available to help you integrate communication into your applications. You can add communication to your applications without being an expert in underlying technologies such as media encoding or telephony. Azure Communication Service is available in multiple [Azure geographies](concepts/privacy.md) and Azure for government.

>[!VIDEO https://www.youtube.com/embed/chMHVHLFcao]

Azure Communication Services supports various communication formats:

- [Voice and Video Calling](concepts/voice-video-calling/calling-sdk-features.md)
- [Rich Text Chat](concepts/chat/concepts.md)
- [SMS](concepts/sms/concepts.md)
- [Email](concepts/email/email-overview.md)

You can connect custom client apps, custom services, and the publicly switched telephony network (PSTN) to your communications experience. You can acquire [phone numbers](./concepts/telephony/plan-solution.md) directly through Azure Communication Services REST APIs, SDKs, or the Azure portal; and use these numbers for SMS or calling applications or you can integrate email capabilities to your applications using production-ready email SDKs. Azure Communication Services [direct routing](./concepts/telephony/plan-solution.md) allows you to use SIP and session border controllers to connect your own PSTN carriers and bring your own phone numbers.

In addition to REST APIs, [Azure Communication Services client libraries](./concepts/sdk-options.md) are available for various platforms and languages, including Web browsers (JavaScript), iOS (Swift), Android (Java), Windows (.NET). A [UI library](./concepts/ui-library/ui-library-overview.md) can accelerate development for Web, iOS, and Android apps. Azure Communication Services is identity agnostic and you control how end users are identified and authenticated.

Scenarios for Azure Communication Services include:

- **Business to Consumer (B2C).** Employees and services engage external customers using voice, video, and text chat in browser and native apps. An organization can send and receive SMS messages, or [operate an interactive voice response system (IVR)](./concepts/call-automation/call-automation.md) using Call Automation and a phone number you acquire through Azure. [Integration with Microsoft Teams](./quickstarts/voice-video-calling/get-started-teams-interop.md) can be used to connect consumers to Teams meetings hosted by employees; ideal for remote healthcare, banking, and product support scenarios where employees might already be familiar with Teams.
- **Consumer to Consumer (C2C).** Build engaging consumer-to-consumer interaction with voice, video, and rich text chat. Any type of user interface can be built on Azure Communication Services SDKs, or use complete application samples and an open-source UI toolkit to help you get started quickly.

To learn more, check out our [Microsoft Mechanics video](https://www.youtube.com/watch?v=apBX7ASurgM) or the resources linked next.

## Common scenarios

<br>

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create a Communication Services resource](./quickstarts/create-communication-resource.md)**|Begin using Azure Communication Services by using the Azure portal or Communication Services SDK to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provision your first user access tokens.|
|**[Get a phone number](./quickstarts/telephony/get-phone-number.md)**|Use Azure Communication Services to provision and release telephone numbers. These telephone numbers can be used to initiate or receive phone calls and build SMS solutions.|
|**[Send an SMS from your app](./quickstarts/sms/send.md)**| Azure Communication Services SMS REST APIs and SDKs are used to send and receive SMS messages from service applications.|
|**[Send an Email from your app](./quickstarts/email/send-email.md)**| Azure Communication Services Email REST APIs and SDKs are used to send email messages from service applications.|

After creating a Communication Services resource you can start building client scenarios, such as voice and video calling or text chat:

| Resource                               |Description                           |
|---                                    |---                                   |
|**[Create your first user access token](./quickstarts/identity/access-tokens.md)**|User access tokens authenticate clients against your Azure Communication Services resource. These tokens are provisioned and reissued using  Communication Services Identity APIs and SDKs.|
|**[Get started with voice and video calling](./quickstarts/voice-video-calling/getting-started-with-calling.md)**| Azure Communication Services allows you to add voice and video calling to your browser or native apps using the Calling SDK. |
|**[Add telephony calling to your app](./quickstarts/telephony/pstn-call.md)**|With Azure Communication Services, you can add telephony calling capabilities to your application.|
| **[Make an outbound call from your app](./quickstarts/call-automation/quickstart-make-an-outbound-call.md)**| Azure Communication Services Call Automation allows you to make an outbound call with an interactive voice response system using Call Automation SDKs and REST APIs.|
|**[Join your calling app to a Teams meeting](./quickstarts/voice-video-calling/get-started-teams-interop.md)**|Azure Communication Services can be used to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solution(s) can interact with Teams participants over voice, video, chat, and screen sharing.|
|**[Get started with chat](./quickstarts/chat/get-started.md)**|The Azure Communication Services Chat SDK is used to add rich real-time text chat into your applications.|
|**[Connect a Microsoft Bot to a phone number](https://github.com/microsoft/botframework-telephony)**|Telephony channel is a channel in Microsoft Bot Framework that enables the bot to interact with users over the phone. It uses the power of Microsoft Bot Framework combined with the Azure Communication Services and the Azure Speech Services.  |
| **[Add visual communication experiences](https://aka.ms/acsstorybook)** | The UI Library for Azure Communication Services enables you to easily add rich, visual communication experiences to your applications for both calling and chat. |

## Samples

The following samples demonstrate end-to-end usage of the Azure Communication Services. Use these samples to bootstrap your own Communication Services solutions.
<br>

| Sample name                               | Description                           |
|---                                    |---                                   |
|**[The Group Calling Hero Sample](./samples/calling-hero-sample.md)**| Download a designed application sample for group calling for browsers, iOS, and Android devices. |
|**[The Group Chat Hero Sample](./samples/chat-hero-sample.md)**| Download a designed application sample for group text chat for browsers. |
|**[The Web Calling Sample](./samples/web-calling-sample.md)**| Download a designed web application sample for audio, video, and PSTN calling. |


## Platforms and SDK libraries

Learn more about the Azure Communication Services SDKs with the resources listed next. REST APIs are available for most functionality if you want to build your own clients or otherwise access the service over the Internet.

| Resource                               | Description                           |
|---                                    |---                                   |
|**[SDK libraries and REST APIs](./concepts/sdk-options.md)**|Azure Communication Services capabilities are conceptually organized into six areas, each represented by an SDK. You can decide which SDK libraries to use based on your real-time communication needs.|
|**[Calling SDK overview](./concepts/voice-video-calling/calling-sdk-features.md)**|Review the Communication Services Calling SDK overview.|
|**[Call Automation overview](./concepts/call-automation/call-automation.md)**|Review the Communication Services Call Automation SDK overview.|
|**[Chat SDK overview](./concepts/chat/sdk-features.md)**|Review the Communication Services Chat SDK overview.|
|**[SMS SDK overview](./concepts/sms/sdk-features.md)**|Review the Communication Services SMS SDK overview.|
|**[Email SDK overview](./concepts/email/sdk-features.md)**|Review the Communication Services SMS SDK overview.|
|**[UI Library overview](./concepts/ui-library/ui-library-overview.md)**| Review the UI Library for the Communication Services |

## Design resources

Find comprehensive components, composites, and UX guidance in the [UI Library Design Kit for Figma](https://www.figma.com/community/file/1095841357293210472). This design resource is purpose-built to help design your video calling and chat experiences faster and with less effort.  

## Other Microsoft Communication Services

There are two other Microsoft communication products you may consider using, these products aren't directly interoperable with Communication Services at this time:

 - [Microsoft Graph Cloud Communication APIs](/graph/cloud-communications-concept-overview) allow organizations to build communication experiences tied to Azure Active Directory users with Microsoft 365 licenses. This workflow is ideal for applications tied to Azure Active Directory or where you want to extend productivity experiences in Microsoft Teams. There are also APIs to build applications and customization within the [Teams experience.](/microsoftteams/platform/?preserve-view=true&view=msteams-client-js-latest)

 - [Azure PlayFab Party](/gaming/playfab/features/multiplayer/networking/) simplifies adding low-latency chat and data communication to games. While you can power gaming chat and networking systems with Communication Services, PlayFab is a tailored option and free on Xbox.


## Next Steps

 - [Create a Communication Services resource](./quickstarts/create-communication-resource.md)
