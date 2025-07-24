---
title: Add data channel messaging to a calling app
titleSuffix: An Azure Communication Services article
description: This article describes how to add Data Channel to your existing calling app using Azure Communication Services.
ms.author: chengyuanlai
author: sloanster
services: azure-communication-services
ms.date: 06/27/2025
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

>[!IMPORTANT]
> The current Data Channel feature API doesn't support direct messaging between a web browser and a native app in a peer-to-peer call scenario.

## Overview

The Data Channel feature API enables real-time data messaging during audio and video calls. In this quickstart guide, we illustrate how to integrate Data Channel feature to your call and use the Data Channel APIs to send and receive data messages through a data channel.

### Prerequisites

Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-windows) to set up a sample app with voice calling.

### Classes

| Name | Description |
| --- | --- | 
| DataChannelCallFeature | Used to start and manage data channel feature. | 
| DataChannelSender | Used to manage a data channel as a sender and send data. | 
| DataChannelReceiver | Used to manage a data channel as a receiver and receive data. |
| DataChannelSenderOptions | Used for representing options to create a data channel sender. |

### Enums

| Name | Description |  
| --- | --- | 
| DataChannelPriority | Describes the priority options of data channel. Values: { `Normal`, `High` }. | 
| DataChannelReliability | Describes the reliability options of data channel. Values: { `Lossy`, `Durable` }. |

### Error Code

| Name | Description |  
| --- | --- | 
| _DataChannelFailedToStart_ | `GetDataChannelSender()` can fail with this error code, indicating underlying Data Channel isn't ready to be used. | 
| _DataChannelRandomIdNotAvailable_ | `GetDataChannelSender()` can fail with this error code, indicating each available random channel ID is in use. | 
| _DataChannelSenderClosed_ | `SendMessage()` can fail with this error code, indicating the sender data channel is closed. |
| _DataChannelMessageSizeOverLimit_ | `SendMessage()` can fail with this error code, indicating the message data size exceeds the limit. You can get the message size limit using `MaxMessageSizeInBytes` in `DataChannelSender`. |
| _DataChannelMessageFailureForBandwidth_ | `SendMessage()` can fail with this error code, indicating a failure in sending the message due to not enough bandwidth. | 
| _DataChannelMessageFailureForTrafficLimit_ | `SendMessage()` can fail with this error code, indicating a failure in sending the message due to the overall usage of Data Channel not in compliance with the traffic limit rules. Refer to [Data Channel Concept Document](../../../../concepts/voice-video-calling/data-channel.md) for details of the traffic limit. |

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
dataChannelCallFeature.ReceiverCreated += DataChannelReceiverCreatedHandler;
 ```

3. Define the MessageReceived event handler.

```csharp
void MessageReceivedHandler(object sender, PropertyChangedEventArgs args) 
{
    DataChannelMessage message = (sender as DataChannelReceiver).ReceiveMessage(); // read the data message from the receiver
    long sequence = message.SequenceNumber; // get the message sequence number
    byte[] data = message.Data; // get the data content
}
```

4. Define the Closed event handler.

```csharp
void ReceiverClosedHandler(object sender, PropertyChangedEventArgs args) 
{
    DataChannelReceiver receiver = sender as DataChannelReceiver; // get the data channel receiver to be closed
};
```

5. Attach the `MessageReceivedHandler` and `ReceiverClosedHandler`.

```csharp
receiver.MessageReceived += MessageReceivedHandler;
receiver.Closed += ReceiverClosedHandler;
```

#### Sending data message

1. Configure the DataChannelSenderOptions.

```csharp
DataChannelSenderOptions options = new DataChannelSenderOptions();
options.ChannelId = 1000;
options.BitrateInKbps = 32;
options.Priority = DataChannelPriority.Normal;
options.Reliability = DataChannelReliability.Lossy;
var participants = new List<CallIdentifier> { /* identifier1, identifier2, ... */ };
options.Participants = participants.AsReadOnly();
```

2. Define the DataChannelSender and send data message

```csharp
DataChannelSender sender = dataChannelCallFeature.GetDataChannelSender(options);
// msgData contains the byte[] data to be sent
sender.SendMessage(msgData);
// change participants in the channel if needed
sender.SetParticipants(new List<CallIdentifier>().AsReadOnly()); 
```