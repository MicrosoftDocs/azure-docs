---
title: Azure Communication Services DataChannel
titleSuffix: An Azure Communication Services concept document
description: Overview of DataChannel
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 2/20/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# DataChannel feature

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The DataChannel feature API provides

Here are the key features:

1. Real-time Messaging: The DataChannel feature API enables users to send and receive messages instantly during an ongoing audio or video call. This feature ensures smooth communication between users, facilitating collaboration and interaction. In a group call scenario, the feature API allows you to send messages to various recipients. This includes sending messages to all participants in a call, a single participant, or a specific set of participants within the call. This flexibility enhances communication and collaboration among users during group interactions.
2. One-Way Communication: The DataChannel feature API is designed for one-way communication, as opposed to bi-directional communication. It employs separate objects for sending and receiving messages, with DataChannelSender object responsible for sending messages and the DataChannelReceiver object for receiving messages. The decoupling of sender and receiver objects simplifies message handling in group call scenarios, providing a more streamlined and user-friendly experience.
3. Binary Data Support: The feature API supports sending and receiving binary data, allowing for the exchange of different types of information, such as text, images, files.
4. Reliable and Unreliable Modes: The current implementation of the feature in our Web SDK exclusively utilizes a reliable WebRTC DataChannel connection. Despite this, the feature API still offers Reliable and Lossy options when creating a DataChannel sender. The Reliable option ensures that messages are delivered in order and without loss between the browser client and the server. In a peer-to-peer call scenario, the reliable mode guarantees the delivery of messages without loss between two endpoints. Although messages sent through an unreliable channel still pass through the reliable connection, the order of these messages isn't guaranteed. In cases where SDK fails to send the channel messages, the Reliable mode throws an exception, whereas the Lossy mode silently drops the message.
5. Security: The current implementation of the feature in our Web SDK utilizes a WebRTC DataChannel connection to send and receive messages. This means all messages exchanged using the feature API are encrypted, ensuring the privacy and security of users' data.


## Next steps
For more information, see the following articles:

- Learn about [QuickStart - Add messaging to your web calling app](../../quickstarts/voice-video-calling/get-started-datachannel.md)
- Learn more about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
