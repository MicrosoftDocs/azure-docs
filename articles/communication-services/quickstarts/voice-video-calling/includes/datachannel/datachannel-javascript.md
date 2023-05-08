---
ms.author: enricohuang
title: QuciStart - Add messaging to your web calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to add messaging to your existing web calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 05/04/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
---

The DataChannel feature API enables real-time messaging during audio and video calls. With this DataChannel feature API, you can now easily integrate chat and data exchange functionalities into the applications, providing a seamless communication experience for users.

Here are the key features:

1. Real-time Messaging: The DataChannel feature API enables users to send and receive messages instantly during an ongoing audio or video call. This feature ensures smooth communication between users, facilitating collaboration and interaction. In a group call scenario, the feature API allows you to send messages to various recipients. This includes sending messages to all participants in a call, a single participant, or a specific set of participants within the call. This flexibility enhances communication and collaboration among users during group interactions.
2. One-Way Communication: The DataChannel feature API is designed for one-way communication, as opposed to bi-directional communication. It employs separate objects for sending and receiving messages, with DataChannelSender object responsible for sending messages and the DataChannelReceiver object for receiving messages. The decoupling of sender and receiver objects simplifies message handling in group call scenarios, providing a more streamlined and user-friendly experience.
3. Binary Data Support: The feature API supports sending and receiving binary data, allowing for the exchange of different types of information, such as text, images, files.
3. Reliable and Unreliable Modes: The current implementation of the feature in our Web SDK exclusively utilizes a reliable WebRTC DataChannel connection. Despite this, the feature API still offers Reliable and Lossy options when creating a DataChannel sender. The Reliable option ensures that messages are delivered in order and without loss between the browser client and the server. In a peer-to-peer call scenario, the reliable mode guarantees the delivery of messages without loss between two endpoints. Although messages sent through an unreliable channel still pass through the reliable connection, the order of these messages is not guaranteed. In cases where SDK fails to send the channel messages, the Reliable mode will throw an exception, whereas the Lossy mode will silently drop the message.
4. Security: The current implementation of the feature in our Web SDK utilizes a WebRTC DataChannel connection to send and receive messages. This means all messages exchanged using the feature API are encrypted, ensuring the privacy and security of users' data.

For more details and a deeper understanding of the feature, please refer to the concept document provided. This comprehensive resource will offer additional information and guidance on utilizing the DataChannel feature API effectively.

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> Please be aware that our current implementation of the DataChannel feature API doesn't support direct messaging between a web browser and a native app in a peer-to-peer call scenario.

## Create a simple chat application

In this example, we will demonstrate how to create a chat application that enables sending and receiving text messages among participants in a group call.

### Create a DataChannelSender object
First you need to create a DataChannelSender object to send messages. In this chat application, we suggest to assign a number to `channelId`, which serves to distinguish different application use cases. For instance, you can assign `channelId` 10000 for chat messages..

```js
const dataChannel = call.feature(Features.DataChannel);
const messageSender = dataChannel.createDataChannelSender({
    channelId: 10000
});
```

There are several other options availablle, such as reliability, bandwidth, and priority. You can ignore these for now and use the default values.
While the sender object is created, you still need a receiver object to receive messages.

### Register a listener to obtain the DataChannelReceiver object

To acquire a reciever object, you need to register a listener that captures the `dataChannelReceiverCreated` event.
When a receiver object is created, the SDK will emit the event along with the receiver object.

```js
dataChannel.on('dataChannelReceiverCreated', receiver => {
    // receiver.channelId
    // reciever.senderParticipantIdentifier, which shows the sender id
});
```

Within the listener callback function, you can access the receiver object and retrieve information such as `channelId` and the sender participant id `senderParticipantIdentifier`.
It's your responsibility to maintain the receiver object reference, as the SDK will only emit the event once for each created receiver object.

### Handle messageReady and close event of DataChannelReceiver object

When a message arrives, the DataChannelReceiver object receives the message, stores it in its internal buffer, and emits a `messageReady` event.
It's not necessary to register `messageReady` event listener to receive messages, as you can always call the `readMessage` API at any time.
However, for best practice, we recommend reading message within the `messageReady` listener callback, if message processing takes a long time, you can
offload the work to a Web Worker to prevent blocking the message reception.

```js
dataChannel.on('dataChannelReceiverCreated', receiver => {
    if (receiver.channelId === 10000) {
        receiver.on('close', () => {
            console.log(`data channel id = ${receiver.channelId} from ${JSON.stringify(receiver.senderParticipantIdentifier)} is closed`);
        });
        receiver.on('messageReady', () => {
            const message = receiver.readMessage();
            // process the message
        });
    }
});
```
### Set participants

To specify the recipients for your messages, you can use `DataChannelSender.setParticipants` API. The sender object will maintain the most recent participant list you provide.
The participant type is `CommunicationIdentifier`, which you can obtain from `remoteParticipant.identifier`. For more information, please refer to [Access remote participant properties](../../how-tos/calling-sdk/manage-calls?pivots=platform-web#access-remote-participant-properties).

```js
const user = call.remoteParticipants[0]; // assume the user wants to send a message to the first participant in the remoteParticipants list
messageSender.setParticipants([user.identifier]);
```
Please note that the participant list is limited to 64 participants. If the participant list is an empty array, the SDK will broadcast the message to all participants in the call.

### Send and receive messages

DataChannel feature API requires you to pass data as `Uint8Array` type. You cannot directly send a JavaScript string using `sendMessage` API.
For example, if you want to send a string 'abc', you cannot use `sender.sendMessage('abc')`. Instead, you need to serialize the data to a byte buffer first.
```js
const data = (new TextEncoder()).encode('abc');
sender.sendMessage(data);
```
Here's another example for sending a JSON object.
```js
const obj = {...}; // some object
const data = (new TextEncoder()).encode(JSON.stringify(obj));
sender.sendMessage(data);
```

Receive and decode the message
```js
dataChannel.on('dataChannelReceiverCreated', receiver => {
    if (receiver.channelId === 10000) {
        const textDecoder = new TextDecoder();
        receiver.on('close', () => {
            console.log(`data channel id = ${receiver.channelId} from ${JSON.stringify(receiver.senderParticipantIdentifier)} is closed`);
        });
        receiver.on('messageReady', () => {
            const message = receiver.readMessage();
            const text = textDecoder.decode(message.data);
            console.log(`from ${JSON.stringify(receiver.senderParticipantIdentifier)}:${text}`);
        });
    }
});
```

You can find a complete sample at the following link: https://github.com/Azure-Samples/communication-services-web-calling-tutorial
