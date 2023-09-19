---
ms.author: chengyuanlai
title: Quickstart - Add data channel to your iOS calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you learn how to add data channel messaging to your existing iOS calling app using Azure Communication Services.
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
Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-ios) to set up a sample app with voice calling.
### Classes
| Name | Description |
| - | - | 
| DataChannelCallFeature | Used to start and manage data channel feature. | 
| DataChannelSender | Used to manage a data channel as a sender and send data. | 
| DataChannelReceiver | Used to manage a data channel as a receiver and receive data. |
| DataChannelSenderCreateOptions | Used for representing options to create a data channel sender. |
### Delegates
| Name | Description |  
| - | - |
| didCreateDataChannelReceiver | Handles the event when a receiver is created. A new receiver is created when receiving a data message from another endpoint through a new data channel for the first time. |
| didReceiveMessage | Handles the event when a data message is received and ready to be fetched. |
| didClose | Handles the event when a data channel receiver is to be closed. |
### Enums
| Name | Description |  
| - | - | 
| DataChannelPriority | Describes the priority options of data channel. Values: { `normal`, `high` }. | 
| DataChannelReliability | Describes the reliability options of data channel. Values: { `lossy`, `durable` }. |
### Methods
#### Enable Data Channel feature

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Data Channel Feature object.
```swift
var dataChannelCallFeature = self.call!.feature(Features.dataChannel)
```
#### Receiving data message
```swift
@State var callObserver:CallObserver?
self.callObserver = CallObserver(view:self)

extension CallObserver: DataChannelCallFeatureDelegate {
    init(view:<nameOfView>) {
        owner = view
        super.init()
    }
    public func dataChannelCallFeature(_ dataChannelCallFeature: DataChannelCallFeature, didCreateDataChannelReceiver args: DataChannelReceiverCreatedEventArgs) {
        let dataChannelReceiver = e.receiver // get the new data channel receiver
        let channelId = dataChannelReceiver.channelId // get the channel id
        let senderId = dataChannelReceiver.senderIdentifier // get the message sender id
        dataChannelReceiver!.delegate = self;
    }
}

extension CallObserver: DataChannelReceiverDelegate {
    public func dataChannelReceiver(_ dataChannelReceiver: DataChannelReceiver, didReceiveMessage args: DataChannelReceiverMessageReceivedEventArgs) {
        let message = args.receiver.readMessage() // read the data message from the receiver
        let sequence = message.sequenceNumber // get the message sequence number
        let data = message.data // get the data content
    }
    
    public func dataChannelReceiver(_ dataChannelReceiver: DataChannelReceiver, didClose args: DataChannelReceiverClosedEventArgs) {
       let receiver = args.receiver // get the data channel receiver to be closed
        // clean up resources related to the receiver
    }
}

dataChannelCallFeature!.delegate = self.callObserver
```
#### Sending data message
1. Configure the DataChannelSenderCreateOptions.
```swift
let options = new DataChannelSenderCreateOptions()
options.channelId = 1000
options.bitrateInKbps = 32
options.priority = DataChannelPriority.normal
options.reliability = DataChannelReliability.lossy

let communicationIdentifiers: [CommunicationIdentifier] = [ /* identifier1, identifier2, ... */ ]
options.participants = communicationIdentifiers
```
2. Define the DataChannelSender and send data message
```swift
DataChannelSender dataChannelSender = dataChannelCallFeature.createDataChannelSender(options)
let participants: [CommunicationIdentifier] = []
dataChannelSender.setParticipants(participants: participants) // change participants in the channel if needed
dataChannelSender.sendMessage(msgData) // msgData contains the data to be sent
```