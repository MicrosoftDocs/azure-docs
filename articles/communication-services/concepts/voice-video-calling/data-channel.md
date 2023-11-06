---
title: Azure Communication Services Data Channel
titleSuffix: An Azure Communication Services concept document
description: Overview of Data Channel
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 5/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Data Channel

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

> [!NOTE]
> This document delves into the Data Channel feature present in the Azure Communication Services Calling SDK.
> While the Data Channel in this context bears some resemblance to the Data Channel in WebRTC, it's crucial to recognize subtle differences in their specifics.
> Throughout this document, we use terms *Data Channel API* or *API* to denote the Data Channel API within the SDK.
> When referring to the Data Channel API in WebRTC, we explicitly use the term *WebRTC Data Channel API* for clarity and precision.

The Data Channel API enables real-time messaging during audio and video calls. With this API, you can now easily integrate data exchange functionalities into the applications, providing a seamless communication experience for users. Key features include:

* Real-time Messaging: The Data Channel API enables users to instantly send and receive messages during an ongoing audio or video call, promoting smooth and efficient communication. In group call scenarios, messages can be sent to a single participant, a specific set of participants, or all participants within the call. This flexibility enhances communication and collaboration among users during group interactions.
* Unidirectional Communication: Unlike bidirectional communication, the Data Channel API is designed for unidirectional communication. It employs distinct objects for sending and receiving messages: the DataChannelSender object for sending and the DataChannelReceiver object for receiving. This separation simplifies message management in group calls, leading to a more streamlined user experience.
* Binary Data Support: The API supports the sending and receiving of binary data, permitting the exchange of diverse data types, such as text, images, and files. The text messages must be serialized into a byte buffer before they can be transmitted.
* Sender Options: The Data Channel API provides three configurable options when creating a sender object, including Reliability, Priority, and Bitrate. These options enable the configuration of a channel to meet specific needs for different use cases.
* Security: All messages exchanged between a client and the other endpoint are encrypted, ensuring the privacy and security of users' data.

## Common use cases

The Data Channel feature has two common use cases:

### Messaging between participants in a call

The Data Channel API enables the transmission of binary type messages among call participants.
With appropriate serialization in the application, it can deliver various message types for different purposes.
There are also other libraries or services providing the messaging functionalities.
Each of them has its advantages and disadvantages. You should choose the suitable one for your usage scenario.
For example, the Data Channel API offers the advantage of low-latency communication, and simplifies user management as there's no need to maintain a separate participant list.
However, the data channel feature doesn't provide message persistence and doesn't guarantee that message won't be lost in an end-to-end manner.
If you need the stateful messaging or guaranteed delivery, you may want to consider alternative solutions.

### File sharing

File sharing represents another common use cases for the Data Channel API.
In a peer-to-peer call scenario, the Data Channel connection works on a peer-to-peer basis.
This setup offers an efficient method for file transfer, taking full advantage of the direct, peer-to-peer connection to enhance speed and reduce latency.

In a group call scenario, files can still be shared among participants. However, there are better ways, such as Azure Storage or Azure Files.
Additionally, broadcasting the file content to all participants in a call can be achieved by setting an empty participant list.
However, it's important to keep in mind that, in addition to bandwidth limitations,
there are further restrictions imposed during a group call when broadcasting messages, such as packet rate and back pressure from the receive bitrate.

## Key concepts

### Unidirectional communication
The Data Channel API is designed for unidirectional communication, as opposed to bi-directional communication in WebRTC Data Channel. It employs separate objects for sending and receiving messages, with DataChannelSender object responsible for sending messages and the DataChannelReceiver object for receiving messages.

The decoupling of sender and receiver objects simplifies message handling in group call scenarios, providing a more streamlined and user-friendly experience.

### Channel
Every Data Channel message is associated with a specific channel identified by `channelId`.
It's important to clarify that this channelId isn't related to the `id` property in the WebRTC Data Channel.
This channelId can be utilized to differentiate various application uses, such as using 1000 for control messages and 1001 for image transfers.

The channelId is assigned during the creation of a DataChannelSender object,
and can be either user-specified or determined by the SDK if left unspecified.

The valid range of a channelId lies between 1 and 65535. If a channelId 0 is provided,
or if no channelId is provided, the SDK assigns an available channelId from within the valid range.

### Reliability
Upon creation, a channel can be configured to be one of the two Reliability options: `lossy` or `durable`.

A `lossy` channel means the order of messages isn't guaranteed and a message can be silently dropped when sending fails. It generally affords a faster data transfer speed.

A `durable` channel means the SDK guarantees a lossless and ordered message delivery. In cases when a message can't be delivered, the SDK will throw an exception.
In the Web SDK, the durability of the channel is ensured through a reliable SCTP connection. However, it doesn't imply that message won't be lost in an end-to-end manner.
In the context of a group call, it signifies the prevention of message loss between the sender and server.
In a peer-to-peer call, it denotes reliable transmission between the sender and remote endpoint.

> [!Note]
> In the current Web SDK implementation, data transmission is done through a reliable WebRTC Data Channel connection for both `lossy` and `durable` channels.

### Priority
Upon creation, a channel can be configured to be one of the two Priority options: `normal` or `high`.

For the Web SDK, priority settings are only compared among channels on the sender side. Channels with a `high` priority are given higher precedence for transmission compared to the ones with `normal` priority.

### Bitrate
When creating a channel, a desirable bitrate can be specified for bandwidth allocation.

This Bitrate property is to notify the SDK of the expected bandwidth requirement for a particular use case. Although the SDK generally can't match the exact bitrate, it tries to accommodate the request.


### Session
The Data Channel API introduces the concept of a session, which adheres to open-close semantics.
In the SDK, the session is associated to the sender or the receiver object.

Upon creating a sender object with a new channelId, the sender object is in open state.
If the `close()` API is invoked on the sender object, the session becomes closed and can no longer facilitate message sending.
At the same time, the sender object notifies all participants in the call that the session is closed.

If a sender object is created with an already existing channelId, the existing sender object associated with the channelId will be closed and any messages sent from the newly created sender object will be recognized as part of the new session.

From the receiver's perspective, messages coming from different sessions on the sender's side are directed to distinct receiver objects.
If the SDK identifies a new session associated with an existing channelId on the receiver's side, it creates a new receiver object.
The SDK doesn't close the older receiver object; such closure takes place 1) when the receiver object receives a closure notification from the sender, or 2) if the session hasn't received any messages from the sender for over two minutes.

In instances where the session of a receiver object is closed and no new session for the same channelId exists on the receiver's side, the SDK creates a new receiver object upon receipt of a message from the same session at a later time. However, if a new session for the same channelId exists on the receiver's side, the SDK discards any incoming messages from the previous session.

Considering that the receiver object closes if it doesn't receive messages for more than two minutes, we suggest that the application periodically sends keep-alive messages from the sender's side to maintain the active status of the receiver object.

### Sequence number
The sequence number is a 32-bit unsigned integer included in the Data Channel message to indicate the order of messages within a channel. It's important to note this number is generated from the sender's perspective. Consequently, a receiver may notice a gap in the sequence numbers if the sender alters the recipients during sending messages.

For instance, consider a scenario where a sender sends three messages. Initially, the recipients are Participant A and Participant B. After the first message, the sender changes the recipient to Participant B, and before the third message, the recipient is switched to participant A. In this case, Participant A will receive two messages with sequence numbers 1 and 3. However, this doesn't signify a message loss but only reflects the change in the recipients by the sender.

## Limitations

### Message size
The maximum allowable size for a single message is 32 KB. If you need to send data larger than the limit, you'll need to divide the data into multiple messages.

### Participant list
The maximum number of participants in a list is limited to 64. If you want to specify more participants, you'll need to manage participant list on your own. For example, if you want to send a message to 50 participants, you can create two different channels, each with 25 participants in their recipient lists.
When calculating the limit, two endpoints with the same participant identifier will be counted as separate entities.
As an alternative, you could opt for broadcasting messages. However, certain restrictions apply when broadcasting messages.

### Rate limiting
There's a limit on the overall send bitrate, currently set at 500 Kbps.
However, when broadcasting messages, the send bitrate limit is dynamic and depends on the receive bitrate.
In the current implementation, the send bitrate limit is calculated as the maximum send bitrate (500 Kbps) minus 80% of the receive bitrate.

Furthermore, we also enforce a packet rate restriction when sending broadcast messages.
The current limit is set at 80 packets per second, where every 1200 bytes in a message is counted as one packet.
These measures are in place to prevent flooding when a significant number of participants in a group call are broadcasting messages.

## Next steps
For more information, see the following articles:

- Learn about [QuickStart - Add data channel to your calling app](../../quickstarts/voice-video-calling/get-started-data-channel.md)
- Learn more about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
