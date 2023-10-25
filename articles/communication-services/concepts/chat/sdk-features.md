---
title: Chat SDK overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Chat SDK.
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 07/18/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: devx-track-js
---

# Chat SDK overview

Azure Communication Services Chat SDKs can be used to add rich, real-time chat to your applications.

## Chat SDK capabilities

The following table presents the set of features that are currently available in the Communication Services chat SDKs.

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

> [!NOTE] 
>The proprietary signaling package is implemented using web sockets. It will fallback to long polling if web sockets are unsupported.

## JavaScript Chat SDK support by OS and browser

The following table represents the set of supported browsers and versions, which are currently available.

|                                  | Windows          | macOS          | Ubuntu | Linux  | Android | iOS    | iPad OS|
|--------------------------------|----------------|--------------|-------|------|------|------|-------|
| **Chat SDK** | Firefox*, Chrome*, new Edge | Firefox*, Chrome*, Safari* | Chrome*  | Chrome* | Chrome* | Safari* | Safari* |

> [!NOTE] 
> The latest version is supported in addition to the previous two releases.

## Next steps

> [!div class="nextstepaction"]
> [Get started with chat](../../quickstarts/chat/get-started.md)

The following documents may be interesting to you:
- Familiarize yourself with [chat concepts](../chat/concepts.md)
- Understand how [pricing](../pricing.md#chat) works for chat
