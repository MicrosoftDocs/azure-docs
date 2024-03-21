---
title: Tutorial - Migrating from Twilio video to ACS
titleSuffix: An Azure Communication Services tutorial
description: Learn how to migrate a calling product from Twilio to Azure Communication Services.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 01/26/2024
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android
---

# Migration Guide from Twilio Video to Azure Communication Services

This article describes how to migrate an existing Twilio Video implementation to the [Azure Communication Services' Calling SDK](../concepts/voice-video-calling/calling-sdk-features.md). Both Twilio Video and Azure Communication Services' Calling SDK for WebJS are also cloud-based platforms that enable developers to add voice and video calling features to their web applications.

However, there are some key differences between them that may affect your choice of platform or require some changes to your existing code if you decide to migrate. In this article, we compare the main features and functions of both platforms and provide some guidance on how to migrate your existing Twilio Video implementation to Azure Communication Services' Calling SDK for WebJS.

## Key features of the Azure Communication Services calling SDK

-  **Addressing** - Azure Communication Services provides [identities](../concepts/identity-model.md) for authentication and addressing communication endpoints. These identities are used within Calling APIs, providing clients with a clear view of who is connected to a call (the roster).
-  **Encryption** - The Calling SDK safeguards traffic by encrypting it and preventing tampering along the way.
-  **Device Management and Media enablement** - The SDK manages audio and video devices, efficiently encodes content for transmission, and supports both screen and application sharing.
-  **PSTN calling** - You can use the SDK to initiate voice calling using the traditional Public Switched Telephone Network (PSTN), [using phone numbers acquired either in the Azure portal](../quickstarts/telephony/get-phone-number.md) or programmatically.
-  **Teams Meetings** – Azure Communication Services is equipped to [join Teams meetings](../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with Teams voice and video calls.
-  **Notifications** - Azure Communication Services provides APIs to notify clients of incoming calls. This allows your application to listen for events (such as incoming calls) even when your application isn't running in the foreground.
-  **User Facing Diagnostics** - Azure Communication Services uses [events](../concepts/voice-video-calling/user-facing-diagnostics.md) designed to provide insights into underlying issues that could affect call quality. You can subscribe your application to triggers such as weak network signals or muted microphones for proactive issue awareness.
-  **Media Quality Statistics** - Provides comprehensive insights into VoIP and video call [metrics](../concepts/voice-video-calling/media-quality-sdk.md). Metrics include call quality information, empowering developers to enhance communication experiences.
-  **Video Constraints** - Azure Communication Services offers APIs that control [video quality among other parameters](../quickstarts/voice-video-calling/get-started-video-constraints.md) during video calls. The SDK supports different call situations for varied levels of video quality, so developers can adjust parameters like resolution and frame rate.

**For a more detailed understanding of the Calling SDK for different platforms, see** [**this document**](../concepts/voice-video-calling/calling-sdk-features.md#detailed-capabilities)**.**

If you're embarking on a new project from the ground up, see the [Quickstarts of the Calling SDK](../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web).


### Calling support

The Azure Communication Services calling SDK supports the following streaming configurations:

| Limit                                                                     | Web                                                                                                   | Windows/Android/iOS         |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------------------------|
| Maximum \# of outgoing local streams that can be sent simultaneously      | 1 video and 1 screen sharing                                                                          | 1 video + 1 screen sharing  |
| Maximum \# of incoming remote streams that can be rendered simultaneously | 9 videos + 1 screen sharing on desktop browsers\*, 4 videos + 1 screen sharing on web mobile browsers | 9 videos + 1 screen sharing |

## Call Types in Azure Communication Services

Azure Communication Services offers various call types. The type of call you choose impacts your signaling schema, the flow of media traffic, and your pricing model. For more information, see [Voice and video concepts](../concepts/voice-video-calling/about-call-types.md).

-   **Voice Over IP (VoIP)** - When a user of your application calls another over an internet or data connection. Both signaling and media traffic are routed over the internet.
-   **Public Switched Telephone Network (PSTN)** - When your users call a traditional telephone number, calls are facilitated via PSTN voice calling. To make and receive PSTN calls, you need to introduce telephony capabilities to your Azure Communication Services resource. Here, signaling and media employ a mix of IP-based and PSTN-based technologies to connect your users.
-   **One-to-One Calls** - When one of your users connects with another through our SDKs. The call can be established via either VoIP or PSTN.
-   **Group Calls** - Happens when three or more participants connect in a single call. Any combination of VoIP and PSTN-connected users can be on a group call. A one-to-one call can evolve into a group call by adding more participants to the call, and one of these participants can be a bot.
-   **Rooms Call** - A Room acts as a container that manages activity between end-users of Azure Communication Services. It provides application developers with enhanced control over who can join a call, when they can meet, and how they collaborate. For a more comprehensive understanding of Rooms, see the [Rooms overview](../concepts/rooms/room-concept.md).

::: zone pivot="platform-web"
[!INCLUDE [Migrating to ACS on WebJS SDK](./includes/twilio-to-acs-video-webjs-tutorial.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Migrating to ACS on iOS SDK](./includes/twilio-to-acs-video-ios-tutorial.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Migrating to ACS on Android SDK](./includes/twilio-to-acs-video-android-tutorial.md)]
::: zone-end