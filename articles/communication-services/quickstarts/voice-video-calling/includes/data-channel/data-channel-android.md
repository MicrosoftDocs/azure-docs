---
ms.author: chengyuanlai
title: Quickstart - Add data channel to your Android calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you learn how to add data channel messaging to your existing Android calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 05/04/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]
>[!IMPORTANT]
> Please be aware that the current Data Channel feature API doesn't support direct messaging between a web browser and a native app in a peer-to-peer call scenario.

## Overview
The Data Channel feature API enables real-time data messaging during audio and video calls. In this quickstart guide, we illustrate how to integrate Data Channel feature to your call and use the Data Channel APIs to send and receive data messages through a data channel.
### Prerequisites
Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-android) to set up a sample app with voice calling.
### Classes
| Name | Description |
| - | - | 
| DataChannelCallFeature | Used to start and manage data channel feature. | 
| DataChannelSender | Used to manage a data channel as a sender and send data. | 
| DataChannelReceiver | Used to manage a data channel as a receiver and receive data. |
| DataChannelSenderCreateOptions | Used for representing options to create a data channel sender. |
### Events
| Name | Description |  
| - | - |
| DataChannelReceiverCreatedEvent | Describes the event when a receiver is created. A new receiver is created when receiving a data message from another endpoint through a new data channel for the first time. |
| DataChannelReceiverMessageReceivedEvent | Describes the event when a data message is received and ready to be fetched. |
| DataChannelReceiverClosedEvent | Describes the event when a data channel receiver is to be closed. |
### Listeners
| Name | Description |  
| - | - |
| DataChannelReceiverCreatedListener | Used to handle `DataChannelReceiverCreatedEvent`. |
| DataChannelReceiverMessageReceivedListener | Used to handle `DataChannelReceiverMessageReceivedEvent`. |
| DataChannelReceiverClosedListener | Used to handle `DataChannelReceiverClosedEvent`. |
### Enums
| Name | Description |  
| - | - | 
| DataChannelPriority | Describes the priority options of data channel. Values: { `NORMAL`, `HIGH` }. | 
| DataChannelReliability | Describes the reliability options of data channel. Values: { `LOSSY`, `DURABLE` }. |
### Methods
#### Enable Data Channel feature

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Data Channel Feature object.
```java
DataChannelCallFeature dataChannelCallFeature = call.feature(Features.DATA_CHANNEL);
```
#### Receiving data message
1. Define the DataChannelReceiverCreatedListener.
```java
DataChannelReceiverCreatedListener receiverCreatedListener = new DataChannelReceiverCreatedListener() {
    @Override
    public void onDataChannelReceiverCreated(DataChannelReceiverCreatedEvent e) {
        DataChannelReceiver receiver = e.getReceiver(); // get the new data channel receiver
        int channelId = receiver.getChannelId(); // get the channel id
        CommunicationIdentifier senderId = receiver.getSenderIdentifier(); // get the message sender id
        // listen to the message received event and closed event from this receiver
        // receiver.addOnMessageReceivedListener(messageReceivedlistener);
        // receiver.addOnClosedListener(receiverClosedListener);
    }
};
```
2. Register the `receiverCreatedListener`.
```java
dataChannelCallFeature.addOnDataChannelReceiverCreatedListener(receiverCreatedListener);
 ```
3. Define the DataChannelReceiverMessageReceivedListener.
```java
DataChannelReceiverMessageReceivedListener messageReceivedListener = new DataChannelReceiverMessageReceivedListener() {
    @Override
    public void onMessageReceived(DataChannelReceiverMessageReceivedEvent e) {
        DataChannelMessage message = e.getReceiver().readMessage(); // read the data message from the receiver
        int sequence = message.getSequenceNumber(); // get the message sequence number
        byte[] data = message.getData(); // get the data content
    }
};
```
4. Define the DataChannelReceiverClosedListener.
```java
DataChannelReceiverClosedListener receiverClosedListener = new DataChannelReceiverClosedListener() {
    @Override
    public void onReceiverClosed(DataChannelReceiverClosedEvent e) {
        DataChannelReceiver receiver = e.getReceiver(); // get the data channel receiver to be closed
        // clean up resources related to the receiver
    }
};
```
5. Register the `messageReceivedListener` and `receiverClosedListener`.
```java
receiver.addOnMessageReceivedListener(messageReceivedlistener);
receiver.addOnClosedListener(receiverClosedListener);
```
#### Sending data message
1. Configure the DataChannelSenderCreateOptions.
```java
DataChannelSenderCreateOptions options = new DataChannelSenderCreateOptions();
options.setChannelId(1000);
options.setBitrateInKbps(32);
options.setPriority(DataChannelPriority.NORMAL);
options.setReliability(DataChannelReliability.LOSSY);

List<CommunicationIdentifier> participants = Arrays.asList( /* identifier1, identifier2, ... */ );
options.setParticipants(participants);
```
2. Define the DataChannelSender and send data message
```java
DataChannelSender dataChannelSender = dataChannelCallFeature.createDataChannelSender(options);
dataChannelSender.setParticipants(new ArrayList<CommunicationIdentifier>()); // change participants in the channel if needed
dataChannelSender.sendMessage(msgData); // msgData contains the byte[] data to be sent
```