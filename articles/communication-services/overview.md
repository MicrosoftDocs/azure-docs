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

[!INCLUDE [Survey Request](./includes/survey-request.md)]

Azure Communication Services offers multichannel communication APIs for adding voice, video, chat, text messaging/SMS, email, and more to all your applications. 

Azure Communication Services include REST APIs and client library SDKs, so you don't need to be an expert in the underlying technologies to add communication into your apps. Azure Communication Services is available in multiple [Azure geographies](concepts/privacy.md) and Azure for government.

>[!VIDEO https://www.youtube.com/embed/chMHVHLFcao]

Azure Communication Services supports various communication formats:

- [Voice and Video Calling](concepts/voice-video-calling/calling-sdk-features.md)
- [Rich Text Chat](concepts/chat/concepts.md)
- [SMS](concepts/sms/concepts.md)
- [Email](concepts/email/email-overview.md)
- [Advanced Messaging for WhatsApp](concepts/advanced-messaging/whatsapp/whatsapp-overview.md)

You can connect custom client apps, custom services, and the publicly switched telephone network (PSTN) to your communications experience. You can acquire [phone numbers](./concepts/telephony/plan-solution.md) directly through Azure Communication Services REST APIs, SDKs, or the Azure portal and use these numbers for SMS or calling applications.

You can also integrate email capabilities to your applications using production-ready email SDKs. Azure Communication Services [direct routing](./concepts/telephony/plan-solution.md) enables you to use SIP and session border controllers to connect your own PSTN carriers and bring your own phone numbers.

In addition to REST APIs, [Azure Communication Services client libraries](./concepts/sdk-options.md) are available for various platforms and languages, including Web browsers (JavaScript), iOS (Swift), Android (Java), Windows (.NET). Take advantage of the [UI library](./concepts/ui-library/ui-library-overview.md) to accelerate development for Web, iOS, and Android apps. Azure Communication Services is identity agnostic, and you control how to identify and authenticate your customers.

Scenarios for Azure Communication Services include:

- **Business to Consumer (B2C).** Employees and services engage external customers using voice, video, and text chat in browser and native apps. Your organization can send and receive SMS messages, or [operate an interactive voice response system (IVR)](./concepts/call-automation/call-automation.md) using Call Automation and a phone number you acquire through Azure. You can [Integrate with Microsoft Teams](./quickstarts/voice-video-calling/get-started-teams-interop.md) to connect consumers to Teams meetings hosted by employees. This integration is ideal for remote healthcare, banking, and product support scenarios where employees might already be familiar with Teams.
- **Consumer to Consumer (C2C).** Build engaging consumer-to-consumer interaction with voice, video, and rich text chat. You can build custom user interfaces on Azure Communication Services SDKs. You can also deploy complete application samples and an open-source UI toolkit to help you get started quickly.

To learn more, check out our [Microsoft Mechanics video](https://www.youtube.com/watch?v=apBX7ASurgM) and the following resources.



## Common scenarios

<br>

| Resource                               |Description                           |
|---                                    |---                                   |
| **[Create a Communication Services resource](./quickstarts/create-communication-resource.md)** | Begin using Azure Communication Services through the Azure portal or Communication Services SDK to provision your first Communication Services resource. Once you have your Communication Services resource connection string, you can provide user access tokens. |
| **[Get a phone number](./quickstarts/telephony/get-phone-number.md)** | Use Azure Communication Services to provision and release telephone numbers. Then use telephone numbers to initiate or receive phone calls and build SMS solutions. |
| **[Send an SMS from your app](./quickstarts/sms/send.md)** | Use Azure Communication Services SMS REST APIs and SDKs to send and receive SMS messages from service applications. |
| **[Send an Email from your app](./quickstarts/email/send-email.md)** | Use Azure Communication Services Email REST APIs and SDKs to send email messages from service applications. |

After creating a Communication Services resource you can start building client scenarios, such as voice and video calling or text chat:

| Resource | Description |
|--- |--- |
| **[Create your first user access token](./quickstarts/identity/access-tokens.md)** | User access tokens authenticate clients against your Azure Communication Services resource. These tokens are provisioned and reissued using Communication Services Identity APIs and SDKs. |
| **[Get started with voice and video calling](./quickstarts/voice-video-calling/getting-started-with-calling.md)** | Azure Communication Services enable you to add voice and video calling to your browser or native apps using the Calling SDK. |
| **[Add telephony calling to your app](./quickstarts/telephony/pstn-call.md)** | Use Azure Communication Services to add telephony calling capabilities to your application. |
| **[Make an outbound call from your app](./quickstarts/call-automation/quickstart-make-an-outbound-call.md)** | Use Call Automation SDKs and REST APIs to make outbound calls with an interactive voice response system. |
| **[Join your calling app to a Teams meeting](./quickstarts/voice-video-calling/get-started-teams-interop.md)** | Use Azure Communication Services to build custom meeting experiences that interact with Microsoft Teams. Users of your Communication Services solutions can interact with Teams participants over voice, video, chat, and screen sharing. |
| **[Get started with chat](./quickstarts/chat/get-started.md)** | Use the Azure Communication Services Chat SDK to add rich real-time text chat into your applications. |
| **[Connect a Microsoft Bot to a phone number](https://github.com/microsoft/botframework-telephony)** |Telephony channel is a channel in Microsoft Bot Framework that enables the bot to interact with users over the phone. It uses the power of Microsoft Bot Framework combined with the Azure Communication Services and the Azure Speech Services.  |
| **[Add visual communication experiences](https://aka.ms/acsstorybook)** | The UI Library for Azure Communication Services enables you to easily add rich, visual communication experiences to your applications for both calling and chat. |

## Samples

The following samples demonstrate end-to-end solutions using Azure Communication Services. Start with these samples to bootstrap your own Communication Services solutions.
<br>

| Sample name | Description |
|--- |--- |
| **[The Group Calling Hero Sample](./samples/calling-hero-sample.md)** | Download a designed application sample for group calling via browsers, iOS, and Android devices. |
| **[The Group Chat Hero Sample](./samples/chat-hero-sample.md)** | Download a designed application sample for group text chat in browsers. |
| **[The Web Calling Sample](./samples/web-calling-sample.md)** | Download a designed web application for audio, video, and PSTN calling. |


## Platforms and SDK libraries

To learn more about the Azure Communication Services SDKs, see the following resources. If you want to build your own clients or access the service over the Internet, REST APIs are available for most functions.

| Resource | Description |
|--- |--- |
| **[SDK libraries and REST APIs](./concepts/sdk-options.md)** | Azure Communication Services capabilities are organized into six areas, each with an SDK. You can decide which SDK libraries to use based on your real-time communication needs. |
| **[Calling SDK overview](./concepts/voice-video-calling/calling-sdk-features.md)** | See the Calling SDK for information about end-user browsers, apps, and services to drive voice and video communication.|
| **[Call Automation overview](./concepts/call-automation/call-automation.md)** | Review the Call Automation SDK for more about server-based intelligent call workflows and call recording for voice and PSTN channels. |
| **[Chat SDK overview](./concepts/chat/sdk-features.md)** | See the Chat SDK for information about adding chat capabilities to your applications. |
| **[SMS SDK overview](./concepts/sms/sdk-features.md)** | Review the SMS SDK to add SMS messaging to your applications. |
| **[Email SDK overview](./concepts/email/sdk-features.md)** | See the Email SDK for information about adding transactional Email support to your applications. |
| **[UI Library overview](./concepts/ui-library/ui-library-overview.md)**| Review the UI Library for more about production-ready UI components that you can drop into your applications. |

## Design resources

Find comprehensive components, composites, and UX guidance in the [UI Library Design Kit for Figma](https://www.figma.com/community/file/1095841357293210472). This design resource is purpose-built to help design your video calling and chat experiences faster and with less effort.  

## Other Microsoft Communication Services

Consider using two other Microsoft communication products that aren't directly interoperable with Azure Communication Services at this time:

 - [Microsoft Graph Cloud Communication APIs](/graph/cloud-communications-concept-overview) enable organizations to build communication experiences tied to Microsoft Entra users with Microsoft 365 licenses. This workflow is ideal for applications tied to Microsoft Entra ID or where you want to extend productivity experiences in Microsoft Teams. There are also APIs to build applications and customization within the [Teams experience.](/microsoftteams/platform/?preserve-view=true&view=msteams-client-js-latest)

 - [Azure PlayFab Party](/gaming/playfab/features/multiplayer/networking/) simplifies adding low-latency chat and data communication to games. While you can power gaming chat and networking systems with Communication Services, PlayFab is a tailored option and free on Xbox.


## Next steps

 - [Create a Communication Services resource](./quickstarts/create-communication-resource.md)
