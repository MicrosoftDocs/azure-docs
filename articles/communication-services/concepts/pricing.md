---
title: Pricing scenarios for Calling (Voice/Video) and Chat
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' Pricing Model.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 09/29/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Pricing Scenarios

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

<!--
> [!WARNING]
> This document is under construction and needs the following items to be addressed:
> - Looks like other resources point to a /pricing page that is managed by Commerce or Marketing? https://azure.microsoft.com/pricing/details/functions/ Should we? FOLLOWING UP WITH KRISTIN TO FIND THE RIGHT ACS PAGE
-->

Prices for Azure Communication Services are based on a pay-as-you-go model with no upfront fees. You'll only be billed for your consumption and use of the services.

## Voice/Video calling and screen sharing

Azure Communication Services allow for adding voice/video calling and screen sharing to your applications. You can embed the experience into your applications using JavaScript, Objective-C (Apple), Java (Android), or .NET client libraries. Refer to our [full list of available client libraries](./sdk-options.md).

### Pricing

Calling and screen-sharing services are charged on a per minute per participant basis at $0.004 per participant per minute for group calls. To understand the various call flows that are possible, refer to [this page](./call-flows.md).

Each participant of the call will count in billing for each minute they're connected to the call. This holds true regardless of whether the user is video calling, voice calling, or screen-sharing.

### Pricing example: Group audio/video call using JS and iOS client libraries

Alice made a group call with her colleagues, Bob and Charlie. Alice and Bob used the JS client libraries, Charlie iOS client libraries.

- The call lasts a total of 60 minutes.
- Alice and Bob participated for the entire call. Alice turned on her video for five minutes and shared her screen for 23 minutes. Bob had the video on for the whole call (60 minutes) and shared his screen for 12 minutes.
- Charlie left the call after 43 minutes. Charlie used audio and video for the duration of time he participated (43 minutes).

**Cost calculations**

- 2 participants x 60 minutes x $0.004 per participant per minute = $0.48 [both video and audio are charged at the same rate]
- 1 participant x 43 minutes x $0.004 per participant per minute = $0.172  [both video and audio are charged at the same rate]

**Total cost for the group call**: $0.48 + $0.172 = $0.652

## Chat

With Communication Services you can enhance your application with the ability to send and receive chat messages between 2 or more users. Chat client libraries are available for JavaScript, .NET, Python and Java. Refer to [this page to learn about client libraries](./sdk-options.md)

### Price

You're charged $0.0008 for every chat message sent.

### Pricing example: Chat between two users 

Geeta starts a chat thread with Emily to share an update and sends 5 messages. The chat lasts 10 minutes wherein Geeta and Emily send another 15 messages each.

**Cost calculations** 
- Number of messages sent (5 + 15 + 15) x $0.0008 = $0.028

### Pricing example: Group chat with multiple users 

Charlie starts a chat thread with his friends Casey & Jasmine to plan a vacation. They chat for a while wherein Charlie, Casey & Jasmine send 20, 30 and 18 messages respectively. They realize that their friend Rose might be interested in joining the trip as well, so they add her to the chat thread and share all the message history with her. 

Rose sees the messages and starts chatting. In the meanwhile Casey gets a call and he decides to catch up on the conversation later. Charlie, Jasmine & Rose decide on the travel dates and send another 30, 25, 35 messages respectively.

**Cost calculations** 

- Number of messages sent (20 + 30 + 18 + 30 + 25 + 35) x $0.0008 = $0.1264


## Telephony and SMS

## Price 

Telephony services are priced on a per-minute basis, while SMS is priced on a per-message basis. Pricing is determined by the type and location of the number you're using as well as the destination of your calls and SMS messages.

### Telephone calling

Traditional telephone calling (calling that occurs over the public switched telephone network) is available with pay-as-you-go pricing for phone numbers based in the United States. The price is a per-minute charge based on the type of number used and the destination of the call. Pricing details for the most popular calling destinations are included in the table below. Please see the [detailed pricing list](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv) for a full list of destinations.


#### United States calling prices

The following prices include required communications taxes and fees until June 30th, 2021:

|Number type   |To make calls   |To receive calls|
|--------------|-----------|------------|
|Local     |Starting at $0.013/min       |$0.0085/min        |
|Toll-free |$0.013/min   |$0.0220/min |

#### Other calling destinations

The following prices include required communications taxes and fees until June 30th, 2021:

|Make calls to   |Price per minute|
|-----------|------------|
|Canada     |Starting at $0.013/min   |
|United Kingdom     |Starting at $0.015/min   |
|Germany     |Starting at $0.015/min   |
|France     |Starting at $0.016/min   |


### SMS

SMS offers pay-as-you-go pricing. The price is a per-message charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Note that local (geographic) phone numbers can't be used to send SMS messages.

The following prices include required communications taxes and fees until June 30th, 2021:

|Country   |Send messages|Receive messages|
|-----------|------------|------------|
|USA (Toll-free)    |$0.0075/msg   | $0.0075/msg |