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
5. Security: All messages exchanged between a client and the other endpoint are encrypted, ensuring the privacy and security of users' data.

## Common use cases

These are two common use cases:

### Messaging between particpants in a call

The DataChannel API enables the transmission of binary type messages among call participants.
With appropriate serialization in the application, it can deliver a variety of message types, extending beyond mere chat texts.
Although other messaging libraries might offer similar funtionality, the DataChannel API provides the advantage of low-latency communication.
Moreover, it removes the necessity for maintaining a separate participant list, thereby simplifying user management.

### File sharing

File sharing represents another common use cases for the DataChannel API.
In a peer-to-peer call scenario, the DataChannel connection works on a peer-to-peer basis.
This setup offers an efficient method for file transfer, taking full advantage of the direct, peer-to-peer connection to enhance speed and reduce latency.

In a group call scenario, files can still be shared among participants.
Additionally, broadcasting the file content to all participants can be achieved by setting an empty participant list.
However, it's important to keep in mind that, in additional to bandwidth limitations,
there are further restrictions imposed during a group call when broadcasting messages, such as packet rate and back pressure from the recieve bitrate.

## Key concepts

### Unidirectional communication
The DataChannel API is designed for unidirectional communication, as opposed to bi-directional communication in WebRTC DataChannel.
It employs separate objects for sending and receiving messages, with DataChannelSender object responsible for sending messages and the DataChannelReceiver object for receiving messages.

The decoupling of sender and receiver objects simplifies message handling in group call scenarios, providing a more streamlined and user-friendly experience.

### Channel
Every DataChannel message is associated with a specific channel identified by `channelId`.
It's important to clarify that this channelId is not related to the id property in the WebRTC DataChannel.
This channelId can be utilized to differentiate various application uses, such as using 10000 for chat messages and 10001 for image transfers.

The channelId is assigned during the creation of a DataChannelSender object,
and can be either user-specified or determined by SDK if left unspecified.

The valid range of a channelId lies between 1 and 65535. If a channelId 0 is provided,
or if no channelId is provided, the SDK will assign an available channelId from within the valid range.

### Reliability
When creating a channel, you have the option to specify the reliability setting.
Two options are available: `Durable` and `Lossy`.
By choosing `Durable`, SDK will create a reliable channel, while `Lossy` creates an unreliable channel.
In current Web SDK implementation, we utilize a reliable WebRTC DataChannnel connection.
As a result, messages from both reliable and unreliable channel are transmitted through this reliable WebRTC DataChannel connection.

In Web SDK, the key difference lies in how undeliverable messages are handled, the order of messages, and the potential for message loss.
An unreliable channel will sliently discard the message if the delivery is not possible, and
the order of messages is not guranteed.
Furthermore, an unreliable channel may experience instances of message loss.
On the other hand, a reliable channel will throw an exception when a message cannot be delivered, ensuring a higher degree of reliability in the transmission of data.

### Priority
When creating a channel, you have the option to specify the priority setting.
Two options are available: `High` and `Normal`.
In the case of Native SDK, the `Normal` priority ensures a best effort delivery where video transmission is given precedence over DataChannel. 
On the other hand, the `High` priority setting prioritizes DataChannel messages over video, to the point where video quality may suffer due to bandwidth allocation for DataChannel.
For Web SDK, priority settings are compared only among channels on the sender's side. Channels with a `High` priority setting are given higher precedence for transmission compared to those set as `Normal`.

### Session
The DataChannel API introduces the concept of a session, which adheres to open-close semantics.
In the SDK, the session is associated to the sender or the receiver object.

Upon creating a sender object with a new channelId, the sender object is in open state.
If the `close()` API is invoked on the sender object, the session becomes closed and can no longer facilitate message sending.
At the same time, the sender object will notify all participants in the call that the session is closed.

If a sender object is created with an already existing channelId, the existing sender object associated with the channelId will be closed.
In turn, any messages sent from the newly created sender object will be recognized as part of a new session.

From the receiver's perspective, messages coming from different sessions on the sender's side are directed to distinct receiver objects.
If the SDK identifies a new session associated with an existing channelId on the receiver's side, it creates a new receiver object.
The SDK won't close the older receiver object; such closure will only take place when the receiver object receives a closure notification from the sender,
or if the session hasn't received any messages from the sender for over two minutes.

In instances where the session of a receiver object is closed and no new session for the same channelId exists on the receiver's side, the SDK will create a new receiver object upon receipt of a message from the same session at a later time. However, if a new session for the same channelId exists on the receiver's side, the SDK will discard any incoming messages from the previous session.

Considering that the receiver object will close if it doesn't receive messages for more than two minutes. We suggest that the application periodically sends keep-alive messages from the sender's side to maintain the active status of the receiver object.

### Sequence number
The sequence number is a 32 bit unsigned integer included in the DataChannel message to indicate the order of messages within a channel.
It's important to note this number is generated from the sender's perspective. Consequently, a receiver may notice a gap in the sequence numbers if the sender alters the recipients during sending messages.

For instance, consider a scenario where a sender sends three messages. Initially, the recipients are Participant A and Participant B.
After the first message, the sender changes the recipient to Participant B, and before the third message, the recipient is switched to participant A.
In this case, Participant A will receive two messages with sequence numbers 1 and 3. However, this doesn't signify message loss, it only reflects the change in the recipients by the sender.

## Limitations

### Message size
The maximum allowable size for a single message is 64KB. If you need to send data larger than this limit, you will need to divide the data into into multiple messages.

### Participant list
The maximum number of participants in a list is limited to 64. If you want to specify more participants, you will need to manage participant list on your own.
For example, if you want to send a message to 50 participants, you can create two different channels, each with 25 participants in their recipient lists.
Please note that when calculating the limit, two endpoints using the same participant identifier will be counted as separate entities.

As an alternative, you could opt for broadcasting messages. However, be aware that certain restrictions apply when sending broadcast messages.

### Rate limiting
There is a limit on the overall send bitrate, currently set at 500 Kbps.
However, when broadcasting messages, the send bitrate limit is dynamic and depends on the receive bitrate.
In the current implementation, the send bitrate limit is calcualted as the maximum send bitrate(500 Kbps) minus 80% of the receive bitrate.

Furthermore, we also enforce a packet rate resitriction when sending broadcast messages.
The current limit is set at 80 packets per second, where every 1200 bytes in a message is counted as one packet.
These measures are in place to prevent flooding when a significant number of participants in a group call are broadcasting messages.

## Next steps
For more information, see the following articles:

- Learn about [QuickStart - Add messaging to your web calling app](../../quickstarts/voice-video-calling/get-started-datachannel.md)
- Learn more about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
