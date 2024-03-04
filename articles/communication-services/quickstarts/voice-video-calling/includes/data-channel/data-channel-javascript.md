---
ms.author: enricohuang
title: Quickstart - Add messaging to your web calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to add messaging to your existing web calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 05/04/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Data Channel feature API enables real-time messaging during audio and video calls. In this quickstart guide, we'll illustrate how to integrate the Data Channel feature, enabling the exchange of text messages among participants within a group call. Please note that there are many different messaging solutions other than the Data Channel feature, and you should choose the suitable solution for your specific usage scenario.


[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> Please be aware that our current implementation of the DataChannel feature API doesn't support direct messaging between a web browser and a native app in a peer-to-peer call scenario.


## Create a DataChannelSender object
First you need to create a DataChannelSender object to send messages. In this custom messaging application, we suggest assigning a number to `channelId`, which serves to distinguish different application use cases. For instance, you can assign `channelId` 1000 for custom messages.

```js
const dataChannel = call.feature(Features.DataChannel);
const messageSender = dataChannel.createDataChannelSender({
    channelId: 1000
});
```

There are several other options, such as reliability, bandwidth, and priority. You can ignore these for now and use the default values.
While the sender object is created, you still need a receiver object to receive messages.

## Register a listener to obtain the DataChannelReceiver object

To acquire a receiver object, you need to register a listener that captures the `dataChannelReceiverCreated` event.
When a receiver object is created, the SDK emits the event along with the receiver object.

```js
dataChannel.on('dataChannelReceiverCreated', receiver => {
    // receiver.channelId
    // reciever.senderParticipantIdentifier, which shows the sender id
});
```

Within the listener callback function, you can access the receiver object and retrieve information such as `channelId` and the sender participant ID `senderParticipantIdentifier`.
It's your responsibility to maintain the receiver object reference, as the SDK emits the event once for each created receiver object.

## Handle messageReady and close event of DataChannelReceiver object

When a message arrives, the DataChannelReceiver object receives the message, stores it in its internal buffer, and emits a `messageReady` event.
It's not necessary to register `messageReady` event listener to receive messages, as you can always call the `readMessage` API at any time.
However, for best practice, we recommend reading message within the `messageReady` listener callback, if message processing takes a long time, you can
offload the work to a Web Worker to prevent blocking the message reception.

```js
dataChannel.on('dataChannelReceiverCreated', receiver => {
    if (receiver.channelId === 1000) {
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
## Set participants

To specify the recipients for your messages, you can use `DataChannelSender.setParticipants` API. The sender object maintains the most recent participant list you provide.
The participant type is `CommunicationIdentifier`, which you can obtain from `remoteParticipant.identifier`. For more information, please refer to [Access remote participant properties](../../../../how-tos/calling-sdk/manage-calls.md?pivots=platform-web#access-remote-participant-properties).

```js
const user = call.remoteParticipants[0]; // assume the user wants to send a message to the first participant in the remoteParticipants list
messageSender.setParticipants([user.identifier]);
```
Please note that the participant list is limited to 64 participants. If the participant list is an empty array, the SDK broadcasts the message to all participants in the call.

## Send and receive messages

DataChannel feature API requires you to pass data as `Uint8Array` type. You can't directly send a JavaScript string using `sendMessage` API.
For example, if you want to send a string `abc`, you can't use `sender.sendMessage('abc')`. Instead, you need to serialize the data to a byte buffer first.
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
    if (receiver.channelId === 1000) {
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
