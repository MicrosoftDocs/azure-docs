---
title: Service limits for Azure Communication Services
titleSuffix: An Azure Communication Services how-to document
description: Learn how to
author: manoskow
manager: shahen
services: azure-communication-services

ms.author: manoskow
ms.date: 11/01/2021
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: data
---
# Service limits for Azure Communication Services

This document explains some of the limitations of Azure Communication Services and what to do if you are running into these limitations. 

## Acquiring phone numbers

### Action to take

For more information, see the [phone number types](./telephony-sms/plan-solution.md) concept page.

## Identity

### Throttling

| API | Timeframes (seconds) | Limit (number of requests) |
|--|--|--|
| **Create identity** | 30 | 500|
| **Delete identity** | 30 | 500|
| **Issue access token** | 30 | 500|
| **Revoke access token**  | 1 | 100|
| **createUserAndToken**| 30 | 1000 |
| **exchangeTokens**| 30 | 500 |

### Action to take
We always recommend you acquire identities and tokens in advance of starting other transactions like creating chat threads or starting calls, for example, right when your webpage is initially loaded or when the app is starting up. 

For more information, see the [identity concept overview](./authentication.md) page.

## SMS
When sending or receiving a high volume of messages, you might receive a ```429``` error. This indicates you are hitting the service limitations and your messages will be queueud to be sent once the number of requests is below the threshold.

Rate Limits for SMS:

|Operation|Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|-----|-------------|-------------------|-------------------------|
|Send Message|Per Number|60|200|200|

### Action to take
If your company has requirements that exceed the rate-limits, please email us at phone@microsoft.com.

For more information on the SMS SDK and service, see the [SMS SDK overview](./telephony-sms/sdk-features.md) page or the [SMS FAQ](./telephony-sms/sms-faq.md) page.

## Chat

### Throttling

| **Operation**         | **Scope**                 | Timeframe (seconds) | Limit (number of requests) |
|--|--|--|--|
|Send Message 	        | Per Thread 	        |60 	        |2000 
|                       | Per User per Thread 	|60 	        |50 
|Get Message 	        | Per User Per Thread   |-              |-
|Get Messages 	        |Per User Per Thread    |5              |15
|                       |Per Thread	        |5	        |250
|Update Message 	|Per User per Thread 	|5 	        |3 
|                       | 	 	        |60             |30 
|                       | 	                |180            |60 
|Get Thread             |Per User Per Thread    |5              |10 
||Per User 	        |                       |5 	        |20 
|Get Threads 	        |Per User 	        |5              |40 
|UpdateThreadRoster 	|Per Thread 	        |300 	        |25
|	                |Per User               |60 	        |25
| 	                |Per User Per Thread 	|1 	        |-

### Service maximum limitations

| **Name**         | Limit  |
|--|--|
|Number of participants in thread | 250 |
|Batch of participants - CreateThread | 200 |
|Batch of participants - AddParticipant | 200 |

### Action to take

For more information about the chat SDK and service, see the [chat SDK overview](./chat/sdk-features.md) page.

## Voice and video calling

### Action to take

For more information about the voice and video calling SDK and service, see the [calling SDK overview](./voice-video-calling/calling-sdk-features.md) page.

## Teams Interoperability and Microsoft Graph

### Action to take


## Next steps
