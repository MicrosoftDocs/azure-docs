---
title: Pricing scenarios for Calling (Voice/Video) and Chat
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' Pricing Model.
author: nmurav
ms.author: nmurav
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# Pricing Scenarios

Prices for Azure Communication Services are generally based on a pay-as-you-go model. The prices in the following examples are for illustrative purposes and may not reflect the latest Azure pricing.

## Voice/Video calling and screen sharing

Azure Communication Services allows for adding voice/video calling and screen sharing to your applications. You can embed the experience into your applications using JavaScript, Objective-C (Apple), Java (Android), or .NET SDKs. Refer to our [full list of available SDKs](./sdk-options.md).

### Pricing

Calling and screen-sharing services are charged on a per minute per participant basis at $0.004 per participant per minute for group calls. Azure Communication Services doesn't charge for data egress. To understand the various call flows that are possible, refer to [this page](./call-flows.md).

Each participant of the call will count in billing for each minute they're connected to the call. This holds true regardless of whether the user is video calling, voice calling, or screen-sharing.

### Pricing example: Group audio/video call using JS and iOS SDKs

Alice made a group call with her colleagues, Bob, and Charlie. Alice and Bob used the JS SDKs, Charlie iOS SDKs.

- The call lasts a total of 60 minutes.
- Alice and Bob participated for the entire call. Alice turned on her video for five minutes and shared her screen for 23 minutes. Bob had the video on for the whole call (60 minutes) and shared his screen for 12 minutes.
- Charlie left the call after 43 minutes. Charlie used audio and video for the duration of time he participated (43 minutes).

**Cost calculations**

- Two participants x 60 minutes x $0.004 per participant per minute = $0.48 [both video and audio are charged at the same rate]
- One participant x 43 minutes x $0.004 per participant per minute = $0.172  [both video and audio are charged at the same rate]

**Total cost for the group call**: $0.48 + $0.172 = $0.652


### Pricing example: Outbound Call from app using JS SDK to a PSTN (Public Switched Telephony Network) number

Alice makes a PSTN Call from an app to Bob on his US phone number beginning with `+1-425`.

- Alice used the JS SDK to build the app.
- The call lasts a total of 10 minutes.

**Cost calculations**

- One participant on the VoIP leg (Alice) from App to Communication Services servers x 10 minutes x $0.004 per participant leg per minute = $0.04
- One participant on the PSTN outbound leg (Bob) from Communication Services servers to a US telephone number x 10 minutes x $0.013 per participant leg per minute = $0.13.

> [!Note]
> USA mixed rate to `+1-425` is $0.013. Refer to the following link for details: https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)


**Total cost for the call**: $0.04 + $0.13 = $0.17

### Pricing example: Outbound Call from app using JS SDK via Azure Communication Services direct routing

Alice makes an outbound call from an Azure Communication Services app to a telephone number (Bob) via Azure Communication Services direct routing.
- Alice used the JS SDK to build the app.
- Call goes to a Session Border Controller (SBC) connected via Communication Services direct routing
- The call lasts a total of 10 minutes. 

**Cost calculations**

- One participant on the VoIP leg (Alice) from App to Communication Services servers x 10 minutes x $0.004 per participant leg per minute = $0.04
- One participant on the Communication Services direct routing outbound leg (Bob) from Communication Services servers to an SBC x 10 minutes x $0.004 per participant leg per minute = $0.04.

**Total cost for the call**: $0.04 + $0.04 = $0.08

### Pricing example: Group audio call using JS SDK and one PSTN leg

Alice and Bob are on a VOIP Call. Bob escalated the call to Charlie on Charlie's PSTN number, a US phone number beginning with `+1-425`.

- Alice used the JS SDK to build the app. They spoke for 10 minutes before calling Charlie on the PSTN number.
- Once Bob escalated the call to Charlie on his PSTN number, the three of them spoke for another 10 minutes.

**Cost calculations**

- Two participants on the VoIP leg (Alice and Bob) from App to Communication Services servers x 20 minutes x $0.004 per participant leg per minute = $0.16
- One participant on the PSTN outbound leg (Charlie) from Communication Services servers to US Telephone number x 10 minutes x $0.013 per participant leg per minute = $0.13

Note: USA mixed rates to `+1-425` is $0.013. Refer to the following link for details: https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)

**Total cost for the VoIP + escalation call**: $0.16 + $0.13 = $.29


### Pricing example: A user of the Communication Services JavaScript SDK joins a scheduled Microsoft Teams meeting

Alice is a doctor meeting with her patient, Bob. Alice will be joining the visit from the Teams Desktop application. Bob will receive a link to join using the healthcare provider website, which connects to the meeting using the Communication Services JavaScript SDK. Bob will use his mobile phone to enter the meeting using a web browser (iPhone with Safari). Chat will be available during the virtual visit.

- The call lasts a total of 30 minutes.
- When Bob joins the meeting, he's placed in the Teams meeting lobby per Teams policy. After one minute, Alice admits him into the meeting.
- After Bob is admitted to the meeting, Alice and Bob participate for the entire call. Alice turns on her video five minutes after the call starts and shares her screen for 13 minutes. Bob has his video on for the whole call.
- Alice sends five messages, Bob replies with three messages.


**Cost calculations**

- One Participant (Bob) connected to Teams lobby x 1 minute x $0.004 per participant per minute (lobby charged at regular rate of meetings) = $0.004
- One participant (Bob) x 29 minutes x $0.004 per participant per minute = $0.116 [both video and audio are charged at the same rate]
- One participant (Alice) x 30 minutes x $0.000 per participant per minute = $0.0*.
- One participant (Bob) x three chat messages x $0.0008 = $0.0024.
- One participant (Alice) x five chat messages x $0.000  = $0.0*.

*Alice's participation is covered by her Teams license. Your Azure invoice will show the minutes and chat messages that Teams users had with Communication Services Users for your convenience, but those minutes and messages originating from the Teams client won't be charged.

**Total cost for the visit**:
- User joining using the Communication Services JavaScript SDK: $0.004 + $0.116 + $0.0024 = $0.1224
- User joining on Teams Desktop Application: $0 (covered by Teams license)

### Pricing example: Inbound PSTN call to the Communication Services JavaScript SDK with Teams identity elevated to group call with another Teams user on Teams desktop client

Alice has ordered a product from Contoso and struggles to set it up. Alice calls from her phone (Android) 800-CONTOSO to ask for help with the received product. Bob is a customer support agent in Contoso and sees an incoming call from Alice on the customer support website (Windows, Chrome browser). Bob accepts the incoming call via Communication Services JavaScript SDK initialized with Teams identity. Teams calling plan enables Bob to receive PSTN calls. Bob sees on the website the product ordered by Alice. Bob decides to invite product expert Charlie to the call. Charlie sees an incoming group call from Bob in the Teams Desktop client and accepts the call.

- The call lasts a total of 30 minutes.
- Bob accepts the call from Alice.
- After five minutes, Bob adds Charlie to the call. Charlie has his camera turned off for 10 minutes. Then turns his camera on for the rest of the call. 
- After another 10 minutes, Alice leaves the call. 
- After another five minutes, both Bob and Charlie leave the call

**Cost calculations**

- One Participant (Alice) called the phone number associated with Teams user Bob using Teams Calling plan x 25 minutes deducted from Bob's tenant Teams minute pool
- One participant (Bob) x 30 minutes x $0.004 per participant per minute = $0.12 [both video and audio are charged at the same rate]
- One participant (Charlie) x 25 minutes x $0.000 per participant per minute = $0.0*.

*Charlie's participation is covered by her Teams license.

**Total cost of the visit**:
- Teams cost for a user joining using the Communication Services JavaScript SDK: 25 minutes from Teams minute pool
- Communication Services cost for a user joining using the Communication Services JavaScript SDK: $0.12
- User joining on Teams Desktop client: $0 (covered by Teams license)


## Call Recording

Azure Communication Services allows customers to record PSTN, WebRTC, Conference, SIP Interface calls. Currently Call Recording supports mixed audio+video MP4 and mixed audio-only MP3/WAV output formats. Call Recording SDKs are available for Java and C#. Refer to [this page to learn more](../quickstarts/voice-video-calling/call-recording-sample.md).

### Price

You're charged $0.01/min for mixed audio+video format and $0.002/min for mixed audio-only.

### Pricing example: Record a call in a mixed audio+video format

Alice made a group call with her colleagues, Bob and Charlie. 

- The call lasts a total of 60 minutes. And recording was active during 60 minutes.
- Bob stayed in a call for 30 minutes and Alice and Charlie for 60 minutes.

**Cost calculations**
- You'll be charged the length of the meeting. (Length of the meeting is the timeline between user starts a recording and either explicitly stops or when there's no one left in a meeting).
- 60 minutes x $0.01 per recording per minute = $0.6

### Pricing example: Record a call in a mixed audio+only format

Alice starts a call with Jane. 

- The call lasts a total of 60 minutes. The recording lasted for 45 minutes.

**Cost calculations**
- You'll be charged the length of the recording. 
- 45 minutes x $0.002 per recording per minute = $0.09

## Chat

With Communication Services you can enhance your application with the ability to send and receive chat messages between two or more users. Chat SDKs are available for JavaScript, .NET, Python, and Java. Refer to [this page to learn about SDKs](./sdk-options.md)

### Price

You're charged $0.0008 for every chat message sent.

### Pricing example: Chat between two users

Geeta starts a chat thread with Emily to share an update and sends five messages. The chat lasts 10 minutes. Geeta and Emily send another 15 messages each.

**Cost calculations**
- Number of messages sent (5 + 15 + 15) x $0.0008 = $0.028

### Pricing example: Group chat with multiple users

Charlie starts a chat thread with his friends Casey & Jasmine to plan a vacation. They chat for a while wherein Charlie, Casey & Jasmine send 20, 30 and 18 messages respectively. They realize that their friend Rose might be interested in joining the trip as well, so they add her to the chat thread and share all the message history with her.

Rose sees the messages and starts chatting. In the meanwhile Casey gets a call and he decides to catch up on the conversation later. Charlie, Jasmine & Rose decide on the travel dates and send another 30, 25, 35 messages respectively.

**Cost calculations**

- Number of messages sent (20 + 30 + 18 + 30 + 25 + 35) x $0.0008 = $0.1264


## SMS (Short Messaging Service) and Telephony

Please refer to the following links for details on SMS and Telephony pricing

- [SMS Pricing Details](./sms-pricing.md)
- [PSTN Pricing Details](./pstn-pricing.md)


## Next Steps
Get started with Azure Communication Services:

- [Send an SMS](../quickstarts/sms/send.md)
- [Add Voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
