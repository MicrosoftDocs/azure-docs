---
title: Migrate to Azure Communication Services Calling SDK
titleSuffix: An Azure Communication Services conceptual article
description: Migrate a calling product from Twilio Video to Azure Communication Services Calling SDK.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 04/04/2024
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: calling
---

# Migrate to Azure Communication Services Calling SDK

Migrate now to a market leading CPaaS platform with regular updates and long-term support. The [Azure Communication Services Calling SDK](../concepts/voice-video-calling/calling-sdk-features.md) provides features and functions that improve upon the sunsetting Twilio Programmable Video.

Both products are cloud-based platforms that enable developers to add voice and video calling features to their web applications. When you migrate to Azure Communication Services, the calling SDK has key advantages that may affect your choice of platform and require minimal changes to your existing code. 

In this article, we describe the main features and functions of the Azure Communication Services, and link to a document comparing both platforms. We also provide links to instructions for migrating an existing Twilio Programmable Video implementation to Azure Communication Services Calling SDK.

## What is Azure Communication Services? 

Azure Communication Services are cloud-based APIs and SDKs that you can use to seamlessly integrate communication tools into your applications. Improve your customers’ communication experience using our multichannel communication APIs to add voice, video, chat, text messaging/SMS, email, and more.

## Why migrate from Twilio Video to Azure Communication Services? 

Expect more from your communication services platform: 

- **Ease of migration** – Use existing APIs and SDKs including a UI library to quickly migrate from Twilio Programmable Video to Microsoft's Calling SDK.

- **Feature parity** – The Calling SDK provides features and performance that meet or exceed Twilio Video.

- **Multichannel communication** – Choose from enterprise-level communication tools including voice, video, chat, SMS, and email.

- **Maintenance and support** – Microsoft delivers stability and long-term commitment with active support and regular software updates.

## Azure Communication Services and Microsoft are your video platform of the future

Azure Communication Services Calling SDK is just one part of the Azure ecosystem. You can bundle the Calling SDK with many other Azure services to speed enterprise adoption of your Communications Platform as a Service (CPaaS) solution. Key points of why Microsoft is optimal solution:

- **Teams integration** – Seamlessly integrate with Microsoft Teams to extend cloud-based meeting and messaging.

- **Long-term guidance and support** – Microsoft continues to provide application support, updates, and innovation.

- **Artificial Intelligence (AI)** – Microsoft invests heavily in AI research and its practical applications. We're actively applying AI to speed up technology adoption and ultimately improve the end user experience.

- **Leverage the Microsoft ecosystem** – Azure Communication Services, the Calling SDK, the Teams platform, AI research and development, the list goes on. Microsoft invests heavily in data centers, cloud computing, AI, and dozens of business applications.

- **Developer-centric approach** – Microsoft has a long history of investing in developer tools and technologies including GitHub, Visual Studio, Visual Studio Code, Copilot, support for an active developer community, and more.

## Video conference feature comparison 

The Azure Communication Services Calling SDK has feature parity with Twilio’s Video platform, with several additional features to further improve your communications platform. For a detailed feature map, see [Calling SDK overview > Detailed capabilities](./voice-video-calling/calling-sdk-features.md#detailed-capabilities).

## Understand call types in Azure Communication Services

Azure Communication Services offers various call types. The type of call you choose impacts your signaling schema, the flow of media traffic, and your pricing model. For more information, see [Voice and video concepts](../concepts/voice-video-calling/about-call-types.md).

-   **Voice Over IP (VoIP)** - When a user of your application calls another over an internet or data connection. Both signaling and media traffic are routed over the internet.
-   **Public Switched Telephone Network (PSTN)** - When your users call a traditional telephone number, calls are facilitated via PSTN voice calling. To make and receive PSTN calls, you need to introduce telephony capabilities to your Azure Communication Services resource. Here, signaling and media employ a mix of IP-based and PSTN-based technologies to connect your users.
-   **One-to-One Calls** - When one of your users connects with another through our SDKs. You can establish the call via either VoIP or PSTN.
-   **Group Calls** - When three or more participants connect in a single call. Any combination of VoIP and PSTN-connected users can be on a group call. A one-to-one call can evolve into a group call by adding more participants to the call, and one of these participants can be a bot.
-   **Rooms Call** - A Room acts as a container that manages activity between end-users of Azure Communication Services. It provides application developers with enhanced control over who can join a call, when they can meet, and how they collaborate. For a more comprehensive understanding of Rooms, see the [Rooms overview](../concepts/rooms/room-concept.md).


## Key features available in Azure Communication Services Calling SDK

-  **Addressing** - Azure Communication Services provides [identities](../concepts/identity-model.md) for authenticating and addressing communication endpoints. These identities are used within Calling APIs, providing your customers with a clear view of who is connected to a call (the roster).
-  **Encryption** - The Calling SDK safeguards traffic by encrypting it and preventing tampering along the way.
-  **Device Management and Media enablement** - The SDK manages audio and video devices, efficiently encodes content for transmission, and supports both screen and application sharing.
-  **PSTN calling** - You can use the SDK to initiate voice calling using the traditional Public Switched Telephone Network (PSTN), [using phone numbers acquired either in the Azure portal](../quickstarts/telephony/get-phone-number.md) or programmatically.
-  **Teams Meetings** – Your customers can use Azure Communication Services to [join Teams meetings](../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with Teams voice and video calls.
-  **Notifications** - Azure Communication Services provides APIs to notify clients of incoming calls. Notifications enable your application to listen for events (such as incoming calls) even when your application isn't running in the foreground.
-  **User Facing Diagnostics** - Azure Communication Services uses [events](../concepts/voice-video-calling/user-facing-diagnostics.md) to provide insights into underlying issues that might affect call quality. You can subscribe your application to triggers such as weak network signals or muted microphones for proactive issue awareness.
-  **Media Quality Statistics** - Provides comprehensive insights into VoIP and video call [metrics](../concepts/voice-video-calling/media-quality-sdk.md). Metrics include call quality information, empowering developers to enhance communication experiences.
-  **Video Constraints** - Azure Communication Services offers APIs that control [video quality among other parameters](../quickstarts/voice-video-calling/get-started-video-constraints.md) during video calls. The SDK supports different call situations for varied levels of video quality, so developers can adjust parameters like resolution and frame rate.

## Next steps

[Migrate from Twilio Video to Azure Communication Services.](../tutorials/migrating-to-azure-communication-services-calling.md)

For a feature map, see [Calling SDK overview > Detailed capabilities](./voice-video-calling/calling-sdk-features.md#detailed-capabilities)
