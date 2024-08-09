---
title: Tutorial - Migrate from Twilio Conversations Chat to Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to migrate a chat product from Twilio Conversations to Azure Communication Services.
author: RinaRish
services: azure-communication-services

ms.author: ektrishi
ms.date: 07/22/2024
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: template-how-to
zone_pivot_groups: acs-js-swift-android-
---

# Migrate from Twilio Conversations Chat to Azure Communication Services

This article describes how to migrate an existing Twilio Conversations implementation to the [Azure Communication Services Chat SDK](../concepts/chat/sdk-features.md). Both Twilio Conversations s and Azure Communication Services Chat SDK are cloud-based platforms that enable developers to add chat features to their web applications.

However, there are some key differences between them that may affect your choice of platform or require some changes to your existing code if you decide to migrate. In Twilio chat is embedded into a conversation which is a multichannel instance. Azure Communication Services Chat SDK is a single channel for chat. In this article, we compare the main features and functions of both platforms and provide some guidance on how to migrate an existing Twilio Conversations chat implementation to Azure Communication Services Chat SDK.

This article doesn't cover creating a service tier to manage tokens for your chat application. See [chat concepts](../../../concepts/chat/concepts.md) for more information about chat architecture, and [user access tokens](../../identity/access-tokens.md) for more information about access tokens.

## Key considerations
### Authentication and Security
ACS integrates deeply with Azure Active Directory (AAD) for identity management, while Twilio uses its own identity system. You may need to rework how you handle user authentication.

### Event Handling
Twilio’s webhook-based approach may require a different architecture compared to ACS’s event-driven model.

### Additional Services
If your application relies on other Twilio services (like SMS, Voice, etc.), you’ll need to find equivalent Azure services or maintain hybrid solutions.
Migrating may involve not just replacing API calls but also rethinking how your application interacts with these communication services within the broader context of your application's architecture.

## Key features available in Azure Communication Services Chat SDK

| **Feature** | **JavaScript SDK** | **iOS SDK** | **Android SDK** | **.NET SDK** | **Java SDK** | **Python SDK** |
| **Install** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Import** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Auth** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Real-time messaging** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Update sent message** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Group conversations** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Direct (one-to-one) conversations** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Update topic of a chat thread** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Add or remove participant** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **List of participants in a chat thread** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Delete chat thread** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Share chat history** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Media support (images, files, etc.)** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Message delivery receipts** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Typing indicators** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Read receipts** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Push notifications** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Multi-device support** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Message search** | \- | \- | \- | \- | \- | \- |
| **Message editing** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Message deletion** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **User roles and permissions** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Conversation moderation** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Participant management** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Integration with other Azure services** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Client-side encryption** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Server-side message storage** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Bot integration** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Custom message metadata** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **User presence status** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Localized and multi-language support** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |


| Group of features | Capability | Azure CLI | JavaScript  | Java | .NET | Python | iOS | Android |
|-----------------|-------------------|---|---|-----|----|-----|----|----|
| Core Capabilities | Create a chat thread between 2 or more users                                                     | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Update the topic of a chat thread                                                                | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Add or remove participants from a chat thread                                                    | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Choose whether to share chat message history with the participant being added                    | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Get a list of participants in a chat thread                                                      | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Delete a chat thread                                                                             | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Given a communication user, get the list of chat threads the user is part of                     | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Get info for a particular chat thread                                                            | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Send and receive messages in a chat thread                                                       | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Update the content of your sent message                                                          | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Delete a message you previously sent                                                             | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Read receipts for messages that have been read by other participants in a chat                   | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Get notified when participants are actively typing a message in a chat thread                    | ❌   | ✔️   | ❌  | ❌    | ❌  | ✔️     | ✔️   |	
|                   | Get all messages in a chat thread                                                                | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Send Unicode emojis as part of message content                                                   | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Add metadata to chat messages                                                                    | ❌   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Add display name to typing indicator notification                                                | ❌   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|Real-time notifications (enabled by proprietary signaling package**)|  Chat clients can subscribe to get real-time updates for incoming messages and other operations occurring in a chat thread. To see a list of supported updates for real-time notifications, see [Chat concepts](concepts.md#real-time-notifications)                                     | ❌   | ✔️   | ❌    | ❌  | ❌  | ✔️  | ✔️  |	
|Mobile push notifications with Notification Hub |  The Chat SDK provides APIs allowing clients to be notified for incoming messages and other operations occurring in a chat thread by connecting an Azure Notification Hub to your Communication Services resource. In situations where your mobile app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end-users, see [Chat concepts](concepts.md#push-notifications).                                     | ❌   | ❌   | ❌    | ❌  | ❌  | ✔️  | ✔️  |	
| Reporting </br>(This info is available under Monitoring tab for your Communication Services resource on Azure portal)      | Understand API traffic from your chat app by monitoring the published metrics in Azure Metrics Explorer and set alerts to detect abnormalities     | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Monitor and debug your Communication Services solution by enabling diagnostic logging for your resource    | ✔️   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	

::: zone pivot="programming-language-javascript"
[!INCLUDE [Migrating to ACS on WebJS SDK](./includes/twilio-to-acs-chat-js-tutorial.md)]
::: zone-end

::: zone pivot="programming-language-android"
[!INCLUDE [Migrating to ACS on Android SDK](./includes/twilio-to-acs-chat-android-tutorial.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Migrating to ACS on iOS SDK](./includes/twilio-to-acs-chat-ios-tutorial.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Chat with C# SDK](./includes/chat-csharp.md)]
::: zone-end
