---
ms.author: chengyuanlai
title: Quickstart - Add data channel to your iOS calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you learn how to add data channel messaging to your existing iOS calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 03/01/2024
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
Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-ios) to set up a sample app with voice calling.
### Classes
| Name | Description |
| - | - | 
| DataChannelCallFeature | Used to start and manage data channel feature. | 
| DataChannelSender | Used to manage a data channel as a sender and send data. | 
| DataChannelReceiver | Used to manage a data channel as a receiver and receive data. |
| DataChannelSenderOptions | Used for representing options to create a data channel sender. |
### Enums
| Name | Description |  
| - | - | 
| DataChannelPriority | Describes the priority options of data channel. Values: { `normal`, `high` }. | 
| DataChannelReliability | Describes the reliability options of data channel. Values: { `lossy`, `durable` }. |
### Error Code
| Name | Description |  
| - | - | 
| _dataChannelFailedToStart_ | `getDataChannelSender()` can fail with this error code, indicating underlying Data Channel is not ready to be used. | 
| _dataChannelRandomIdNotAvailable_ | `getDataChannelSender()` can fail with this error code, indicating all available random channel IDs have already been used. | 
| _dataChannelSenderClosed_ | `sendMessage()` can fail with this error code, indicating the sender has already been closed previously. |
| _dataChannelMessageSizeOverLimit_ | `sendMessage()` can fail with this error code, indicating the message data size exceeds the limit. You can get the message size limit using `maxMessageSizeInBytes` in `DataChannelSender`. |
| _dataChannelMessageFailureForBandwidth_ | `sendMessage()` can fail with this error code, indicating a failure in sending the message due to not enough bandwidth. | 
| _dataChannelMessageFailureForTrafficLimit_ | `sendMessage()` can fail with this error code, indicating a failure in sending the message due to the overall usage of Data Channel not in compliance with the traffic limit rules. Refer to [Data Channel Concept Document](../../../../concepts/voice-video-calling/data-channel.md) for details of the traffic limit. |
### Methods
#### Enable Data Channel feature

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Data Channel Feature object.
```swift
var dataChannelCallFeature = self.call!.feature(Features.dataChannel)
```
#### Receiving data message
```swift
let featureDelegate = new FeatureDelegate()
let receiverDelegate = new ReceiverDelegate()
dataChannelCallFeature!.delegate = featureDelegate

class FeatureDelegate: NSObject, DataChannelCallFeatureDelegate {
    public func dataChannelCallFeature(_ dataChannelCallFeature: DataChannelCallFeature, didCreateReceiver args: DataChannelReceiverCreatedEventArgs) {
        let receiver = args.receiver // get the new data channel receiver
        let channelId = receiver.channelId // get the channel id
        let senderId = receiver.senderIdentifier // get the message sender id

        receiver.delegate = receiverDelegate
    }
}

class ReceiverDelegate: NSObject, DataChannelReceiverDelegate {
    public func dataChannelReceiver(_ dataChannelReceiver: DataChannelReceiver, didReceiveMessage args: PropertyChangedEventArgs) {
        let message = dataChannelReceiver.receiveMessage() // read the data message from the receiver
        let sequence = message?.sequenceNumber // get the message sequence number
        let data = message?.data // get the data content
    }
    
    public func dataChannelReceiver(_ dataChannelReceiver: DataChannelReceiver, didClose args: PropertyChangedEventArgs) {
       let channelId = dataChannelReceiver.channelId // get the data channel id to be closed
    }
}
```
#### Sending data message
1. Configure the DataChannelSenderOptions.
```swift
let options = new DataChannelSenderOptions()
options.channelId = 1000
options.bitrateInKbps = 32
options.priority = DataChannelPriority.normal
options.reliability = DataChannelReliability.lossy

let communicationIdentifiers: [CommunicationIdentifier] = [ /* identifier1, identifier2, ... */ ]
options.participants = communicationIdentifiers
```
2. Define the DataChannelSender and send data message
```swift
DataChannelSender sender = dataChannelCallFeature.getDataChannelSender(options)

// msgData contains the data to be sent
sender.sendMessage(msgData)

// change participants in the channel if needed
let participants: [CommunicationIdentifier] = []
dataChannelSender.setParticipants(participants: participants)
```