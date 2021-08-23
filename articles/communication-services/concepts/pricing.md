---
title: Pricing scenarios for Calling (Voice/Video) and Chat
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' Pricing Model.
author: nmurav
manager: nmurav
services: azure-communication-services

ms.author: nmurav
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Pricing Scenarios

Prices for Azure Communication Services are generally based on a pay-as-you-go model. The prices in the following examples are for illustrative purposes and may not reflect the latest Azure pricing.

## Voice/Video calling and screen sharing

Azure Communication Services allow for adding voice/video calling and screen sharing to your applications. You can embed the experience into your applications using JavaScript, Objective-C (Apple), Java (Android), or .NET SDKs. Refer to our [full list of available SDKs](./sdk-options.md).

### Pricing

Calling and screen-sharing services are charged on a per minute per participant basis at $0.004 per participant per minute for group calls. Azure Communication Services does not charge for data egress. To understand the various call flows that are possible, refer to [this page](./call-flows.md).

Each participant of the call will count in billing for each minute they're connected to the call. This holds true regardless of whether the user is video calling, voice calling, or screen-sharing.

### Pricing example: Group audio/video call using JS and iOS SDKs

Alice made a group call with her colleagues, Bob and Charlie. Alice and Bob used the JS SDKs, Charlie iOS SDKs.

- The call lasts a total of 60 minutes.
- Alice and Bob participated for the entire call. Alice turned on her video for five minutes and shared her screen for 23 minutes. Bob had the video on for the whole call (60 minutes) and shared his screen for 12 minutes.
- Charlie left the call after 43 minutes. Charlie used audio and video for the duration of time he participated (43 minutes).

**Cost calculations**

- 2 participants x 60 minutes x $0.004 per participant per minute = $0.48 [both video and audio are charged at the same rate]
- 1 participant x 43 minutes x $0.004 per participant per minute = $0.172  [both video and audio are charged at the same rate]

**Total cost for the group call**: $0.48 + $0.172 = $0.652


### Pricing example: Outbound Call from app using JS SDK to a PSTN number

Alice makes a PSTN Call from an app to Bob on his US phone number beginning with `+1-425`.

- Alice used the JS SDK to build the app.
- The call lasts a total of 10 minutes.

**Cost calculations**

- 1 participant on the VoIP leg (Alice) from App to Communication Services servers x 10 minutes x $0.004 per participant leg per minute = $0.04
- 1 participant on the PSTN outbound leg (Bob) from Communication Services servers to a US telephone number x 10 minutes x $0.013 per participant leg per minute = $0.13.

> [!Note]
> USA mixed rates to `+1-425` is $0.013. Refer to the following link for details: https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)


**Total cost for the call**: $0.04 + $0.13 = $0.17

### Pricing example: Outbound Call from app using JS SDK via Azure Communication Services direct routing

Alice makes an outbound call from an Azure Communication Services app to a telephone number (Bob) via Azure Communication Services direct routing.
- Alice used the JS SDK to build the app.
- Call goes to a Session Border Controller (SBC) connected via Communication Services direct routing
- The call lasts a total of 10 minutes. 

**Cost calculations**

- 1 participant on the VoIP leg (Alice) from App to Communication Services servers x 10 minutes x $0.004 per participant leg per minute = $0.04
- 1 participant on the Communication Services direct routing outbound leg (Bob) from Communication Services servers to an SBC x 10 minutes x $0.004 per participant leg per minute = $0.04.

**Total cost for the call**: $0.04 + $0.04 = $0.08

> [!Note]
> Azure Communication Services direct routing leg is not charged until 08/01/2021.


### Pricing example: Group audio call using JS SDK and one PSTN leg

Alice and Bob are on a VOIP Call. Bob escalated the call to Charlie on Charlie's PSTN number, a US phone number beginning with `+1-425`.

- Alice used the JS SDK to build the app. They spoke for 10 minutes before calling Charlie on the PSTN number.
- Once Bob escalated the call to Charlie on his PSTN number, the three of them spoke for another 10 minutes.

**Cost calculations**

- 2 participants on the VoIP leg (Alice and Bob) from App to Communication Services servers x 20 minutes x $0.004 per participant leg per minute = $0.16
- 1 participant on the PSTN outbound leg (Charlie) from Communication Services servers to US Telephone number x 10 minutes x $0.013 per participant leg per minute = $0.13

Note: USA mixed rates to `+1-425` is $0.013. Refer to the following link for details: https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)

**Total cost for the VoIP + escalation call**: $0.16 + $0.13 = $.29


### Pricing example: A user of the Communication Services JavaScript SDK joins a scheduled Microsoft Teams meeting

Alice is a doctor meeting with her patient, Bob. Alice will be joining the visit from the Teams Desktop application. Bob will receive a link to join using the healthcare provider website, which connects to the meeting using the Communication Services JavaScript SDK. Bob will use his mobile phone to enter the meeting using a web browser (iPhone with Safari). Chat will be available during the virtual visit.

- The call lasts a total of 30 minutes.
- When Bob joins the meeting, he's placed in the Teams meeting lobby per Teams policy. After one minute, Alice admits him into the meeting.
- After Bob is admitted to the meeting, Alice and Bob participate for the entire call. Alice turns on her video five minutes after the call starts and shares her screen for 13 minutes. Bob has his video on for the whole call.
- Alice sends five messages, Bob replies with three messages.


**Cost calculations**

- 1 Participant (Bob) connected to Teams lobby x 1 minute x $0.004 per participant per minute (lobby charged aat regular rate of meettings) = $0.004
- 1 participant (Bob) x 29 minutes x $0.004 per participant per minute = $0.116 [both video and audio are charged at the same rate]
- 1 participant (Alice) x 30 minutes x $0.000 per participant per minute = $0.0*.
- 1 participant (Bob) x 3 chat messages x $0.0008 = $0.0024.
- 1 participant (Alice) x 5 chat messages x $0.000  = $0.0*.

*Alice's participation is covered by her Teams license. Your Azure invoice will show the minutes and chat messages that Teams users had with Communication Services Users for your convenience, but those minutes and messages originating from the Teams client will not cost.

**Total cost for the visit**:
- User joining using the Communication Services JavaScript SDK: $0.004 + $0.116 + $0.0024 = $0.1224
- User joining on Teams Desktop Application: $0 (covered by Teams license)


## Chat

With Communication Services you can enhance your application with the ability to send and receive chat messages between two or more users. Chat SDKs are available for JavaScript, .NET, Python and Java. Refer to [this page to learn about SDKs](./sdk-options.md)

### Price

You're charged $0.0008 for every chat message sent.

### Pricing example: Chat between two users

Geeta starts a chat thread with Emily to share an update and sends 5 messages. The chat lasts 10 minutes. Geeta and Emily send another 15 messages each.

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

### Telephone number leasing

Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Local (United States)     |$1/mo        |
|Toll-free (United States) |$2/mo |


### Telephone calling

Traditional telephone calling (calling that occurs over the public switched telephone network) is available with pay-as-you-go pricing for phone numbers based in the United States. The price is a per-minute charge based on the type of number used and the destination of the call. Pricing details for the most popular calling destinations are included in the table below. Please see the [detailed pricing list](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv) for a full list of destinations.


#### United States calling prices

The following prices include required communications taxes and fees:

|Number type   |To make calls   |To receive calls|
|--------------|-----------|------------|
|Local     |Starting at $0.013/min       |$0.0085/min        |
|Toll-free |$0.013/min   |$0.0220/min |

#### Other calling destinations

The following prices include required communications taxes and fees:

|Make calls to   |Price per minute|
|-----------|------------|
|Canada     |Starting at $0.013/min   |
|United Kingdom     |Starting at $0.015/min   |
|Germany     |Starting at $0.015/min   |
|France     |Starting at $0.016/min   |


### SMS

SMS offers pay-as-you-go pricing. The price is a per-message charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Note that local (geographic) phone numbers can't be used to send SMS messages.

The following prices include required communications taxes and fees:

|Country   |Send messages|Receive messages|
|-----------|------------|------------|
|USA (Toll-free)    |$0.0075/msg   | $0.0075/msg |
