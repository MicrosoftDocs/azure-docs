---
title: Azure Communication Services DataChannel
titleSuffix: An Azure Communication Services concept document
description: Overview of DataChannel
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 5/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# DataChannel

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

> [!NOTE]
> This document delves into the DataChannel feature present in the ACS Calling SDK.
> While the DataChannel in this context bears some resemblance to the DataChannel in WebRTC, it's crucial to recognize subtle differences in their specifics.
> Throughout this document, we use terms *DataChannel API* or *API* to denote the DataChannel API within the SDK.
> When referring to the DataChannel API in WebRTC, we explicitly use the term *WebRTC DataChannel API* for clarity and precision.

The DataChannel API enables real-time messaging during audio and video calls. With this API, you can now easily integrate chat and data exchange functionalities into the applications, providing a seamless communication experience for users. Key features include:

1. Real-time Messaging: The DataChannel API enables users to instantly send and receive messages during an ongoing audio or video call, promoting smooth and efficient communication. In group call scenarios, messages can be sent all participants, a single participant, or a specific set of participants within the call. This flexibility enhances communication and collaboration among users during group interactions.
2. Unidirectional Communication: Unlike bidirectional communication, the DataChannel API is designed for unidirectional communication. It employs distinct objects for sending and receiving messages: the DataChannelSender object for sending and the DataChannelReceiver object for receiving. This separation simplifies message management in group calls, leading to a more streamlined user experience.
3. Binary Data Support: The API supports the sending and receiving of binary data, permitting the exchange of diverse data types, such as text, images, and files. Note that text messages must be serialized into a byte buffer before they can be transmitted.
4. Sender options: The DataChannel API provides three configurable options when creating a sender object, including reliability, priority, and bitrate.
 The reliable mode gurantees ordered and lossless message delivery. However, in the unreliable mode, message order isn't ensured, and if the SDK fails to send a message, it's silently dropped. In the contrast, the reliable mode throws an exception in such instances. In the Native SDK, the high priority option prioritizes the processing of DataChannel messages over video packets, while in the Web SDK, this priority setting only applies between different channels of the DataChannel.
5. Security: All messages exchanged\ between a client and the other endpoint are encrypted, ensuring the privacy and security of users' data.

## Common use cases

These are two common use cases:

### Messaging between particpants in a call

The DataChannel API enables the transmission of binary type messages among call participants.
With appropriate serialization, it can handle a variety of message types, extending beyond mere chat texts.
Although other messaging libraries might offer similar funtionality, the DataChannel API provides the advantage of low-latency communication.
Moreover, it removes the necessity for maintaining a separate participant list, thereby simplifying user management.

### File sharing

File sharing represents another widespread use cases for the DataChannel API.
In a peer-to-peer call senario, the DataChannel connection operates on peer-to-peer bases.
This setup offers an efficient method for file transfer, taking full advantage of the direct, peer-to-peer connection to enhance speed and reduce latency.

## Key concepts

### One-way communication
The DataChannel API is designed for one-way communication, as opposed to bi-directional communication. It employs separate objects for sending and receiving messages, with DataChannelSender object responsible for sending messages and the DataChannelReceiver object for receiving messages. The decoupling of sender and receiver objects simplifies message handling in group call scenarios, providing a more streamlined and user-friendly experience.

### Channel id
Every DataChannel message is associated with a specific channel identified by *channelId*.
This id can be utilized to differentiate various application uses, such as using 10000 for chat messages and 10001 for image transfers.
The channelId is assigned during the creation of a DataChannelSender object, 
and can be either user-specified at this stage or automatically allocated by SDK if left unspecified.
The valid range of a channelId lies between 1 and 65535. If a channelId 0 is provided,
or if no channelId is provided, the SDK will assign an available channelId from within the valid range.

### Session
The DataChannel API has the concept of a session, which corresponds to open-close semantics.
In the SDK, the session is associated to the sender or the receiver object.
When you create a sender object with a new channelId, the sender is in open state.
If you call close() API on the sender object, the session is closed, you cannot send message on a closed sender.

### Sequence number
The sequence number is a 32 bit unsigned interger included in the sender's message to indicate the order of messages within a channel.
It's important to note this number is generated from the sender's perspective. Consequently, a receiver may notice a gap in the sequence numbers if the sender alters the recipients during sending messages.

For instance, consider a scenario where a sender sends three messages. Initially, the recipients are Participant A and Participant B.
After the first message, the sender changes the recipient to Participant B, and before the third message, the recipient is switched to participant A.
In this case, Participant A will receive two messages with sequence numbers 1 and 3. However, this doesn't signify message loss, it only reflects the change in the recipients by the sender.

## Next steps
For more information, see the following articles:

- Learn about [QuickStart - Add messaging to your web calling app](../../quickstarts/voice-video-calling/get-started-datachannel.md)
- Learn more about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
