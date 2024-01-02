---
ms.author: chengyuanlai
title: Quickstart - Add data channel to your Windows calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you learn how to add data channel messaging to your existing Windows calling app using Azure Communication Services.
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
Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-windows) to set up a sample app with voice calling.
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
| DataChannelReceiverCreated | Describes the event when a receiver is created. A new receiver is created when receiving a data message from another endpoint through a new data channel for the first time. |
| DataChannelReceiverMessageReceived | Describes the event when a data message is received and ready to be fetched. |
| DataChannelReceiverClosed | Describes the event when a data channel receiver is to be closed. |
### Enums
| Name | Description |  
| - | - | 
| DataChannelPriority | Describes the priority options of data channel. Values: { `Normal`, `High` }. | 
| DataChannelReliability | Describes the reliability options of data channel. Values: { `Lossy`, `Durable` }. |
### Methods
#### Enable Data Channel feature

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Data Channel Feature object.
```csharp
DataChannelCallFeature dataChannelCallFeature = call.Features.DataChannel;
```
#### Receiving data message
1. Define the DataChannelReceiverCreated event handler.
```csharp
void DataChannelReceiverCreatedHandler(object sender, DataChannelReceiverCreatedEventArgs args) 
{
    DataChannelReceiver receiver = args.Receiver; // get the new data channel receiver
    int channelId = receiver.ChannelId; // get the channel id
    CallIdentifier senderId = receiver.SenderIdentifier; // get the message sender id
    
    // add event handlers for the message received event and closed event from this receiver
    // receiver.MessageReceived += MessageReceivedHandler;
    // receiver.Closed += ReceiverClosedHandler;
}
```
2. Attach the `DataChannelReceiverCreatedHandler`.
```csharp
dataChannelCallFeature.DataChannelReceiverCreated += DataChannelReceiverCreatedHandler;
 ```
3. Define the DataChannelReceiverMessageReceived event handler.
```csharp
void MessageReceivedHandler(object sender, DataChannelReceiverMessageReceivedEventArgs args) 
{
    DataChannelMessage message = args.Receiver.ReadMessage(); // read the data message from the receiver
    uint sequence = message.SequenceNumber; // get the message sequence number
    byte[] data = message.Data; // get the data content
}
```
4. Define the DataChannelReceiverClosed event handler.
```csharp
void ReceiverClosedHandler(object sender, DataChannelReceiverClosedEventArgs args) 
{
        DataChannelReceiver receiver = ergs.Receiver; // get the data channel receiver to be closed
        // clean up resources related to the receiver
};
```
5. Attach the `MessageReceivedHandler` and `ReceiverClosedHandler`.
```csharp
receiver.MessageReceived += MessageReceivedHandler;
receiver.Closed += ReceiverClosedHandler;
```
#### Sending data message
1. Configure the DataChannelSenderCreateOptions.
```csharp
DataChannelSenderCreateOptions options = new DataChannelSenderCreateOptions();
options.ChannelId = 1000;
options.BitrateInKbps = 32;
options.Priority = DataChannelPriority.NORMAL;
options.Reliability = DataChannelReliability.LOSSY;
var participants = new List<CallIdentifier> { /* identifier1, identifier2, ... */ };
options.Participants = participants.AsReadOnly();
```
2. Define the DataChannelSender and send data message
```csharp
DataChannelSender dataChannelSender = dataChannelCallFeature.CreateDataChannelSender(options);
dataChannelSender.SetParticipants(new List<CallIdentifier>().AsReadOnly()); // change participants in the channel if needed
dataChannelSender.SendMessageAsync(msgData); // msgData contains the byte[] data to be sent

```