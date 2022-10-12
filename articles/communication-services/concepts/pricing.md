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

### Pricing example: Outbound Call from Microsoft Dynamics 365 Omnichannel for Customer Service agent application via Azure Communication Services direct routing

Alice is a Dynamics 365 contact center agent, who makes an outbound call from Omnichannel for Customer Service to a telephone number (Bob) via Azure Communication Services direct routing.
- Alice uses Omnichannel for Customer Service client application 
- Omnichannel for Customer Service bot starts new outgoing call via direct routing
- Call goes to a Session Border Controller (SBC) connected via Communication Services direct routing
- Dynamics 365 Omnichannel for Customer Service bot adds Alice to a call by escalating the direct routing call to a group call
- The call lasts a total of 10 minutes. 

**Cost calculations**

- One participant on the VoIP leg (Alice) from Omnichannel for Customer Service client application x 10 minutes x $0.004 per participant leg per minute = $0.04
- One participant on the Communication Services direct routing outbound leg (Bob) from Communication Services servers to an SBC x 10 minutes x $0.004 per participant leg per minute = $0.04.
- Omnichannel for Customer Servicebot does not introduce additional ACS charges.

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


## SMS (Short Messaging Service)

Azure Communication Services allows for adding SMS messaging capabilities to your applications. You can embed the experience into your applications using JavaScript, Java, Python, or .NET SDKs. Refer to our [full list of available SDKs](./sdk-options.md).

### Pricing

The SMS usage price is a per-message segment charge based on the destination of the message. The carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages. Please refer to the [SMS Pricing Page](./sms-pricing.md) for pricing details. 

### Pricing example: 1:1 SMS sending

Contoso is a healthcare company with clinics in US and Canada. Contoso has a Patient Appointment Reminder application that sends out SMS appointment reminders to patients regarding upcoming appointments. 

- The application sends appointment reminders to 20 US patients and 30 Canada patients using a US toll-free number.
- Message length of the reminder message is 150 chars < 1 message segment*. Hence, total sent messages are 20 message segments for US and 30 message segments for CA.

**Cost calculations**

- US - 20 message segments x $0.0075 per sent message segment + 20 message segments x $0.0025 carrier surcharge per sent message segment = $0.20
- CA - 30 message segments x $0.0075 per sent message segment + 30 message segments x $0.0085 carrier surcharge per sent message segment = $0.48

**Total cost for the appointment reminders for 20 US patients and 30 CA patients**: $0.20 + $0.48 = $0.68

### Pricing example: 1:1 SMS receiving

Contoso is a healthcare company with clinics in US and Canada. Contoso has a Patient Appointment Reminder application that sends out SMS appointment reminders to patients regarding upcoming appointments. Patients can respond to the messages with "Reschedule" and include their date/time preference to reschedule their appointments.

- The application sends appointment reminders to 20 US patients and 30 Canada patients using a CA toll-free number.
- 6 US patients and 4 CA patients respond back to reschedule their appointments. Contoso receives 10 SMS responses in total.
- Message length of the reschedule messages is less than 1 message segment*. Hence, total messages received are 6 message segments for US and 4 message segments for CA.

**Cost calculations**

- US - 6 message segments x $0.0075 per received message segment + 6 message segments x $0.0010 carrier surcharge per received message segment = $0.051
- CA - 4 message segments x $0.0075 per received message segment = $0.03

**Total cost for receiving patient responses from 6 US patients and 4 CA patients**: $0.051 + $0.03 = $0.081

## Telephony
Please refer to the following links for details on Telephony pricing

- [PSTN Pricing Details](./pstn-pricing.md)

## Next Steps
Get started with Azure Communication Services:

- [Send an SMS](../quickstarts/sms/send.md)
- [Add Voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)
