---
title: SMS FAQ
titleSuffix: An Azure Communication Services concept document
description: SMS FAQ
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 03/26/2021
ms.topic: sms-faq
ms.service: azure-communication-services
---

# SMS FAQ
## Can a customer use Azure Communication Services for emergency purposes?

Azure Communication Services does not support text-to-911 functionality in the United States, but it’s possible you may have an obligation to do so under the rules of the Federal Communications Commission (FCC).  You should assess whether the FCC’s text-to-911 rules apply to your service or application. To the extent you are covered by these rules, you will be responsible for routing 911 text messages to emergency call centers that request them.  You are free to determine your own text-to-911 delivery model, but one approach accepted by the FCC involves automatically launching the native dialer on the user’s mobile device to deliver 911 texts through the underlying mobile carrier.

## Are there any limits on sending messages?

To ensure that we continue offering the high quality of service consistent with our SLAs, ACS applies rate limits (different for each primitive). Developers who call our APIs beyond the limit will receive a 429 HTTP Status Code Response. If your company has requirements that exceed the rate-limits, please email us at phone@microsoft.com

Rate Limits for SMS:

|Operation|Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|-----|-------------|-------------------|-------------------------|
|Send Message|Per Number|60|200|200|

## How does Azure Communication Services handle opt-outs for Toll-free numbers?

Opt-outs for US toll-free numbers are mandated and enforced by US carriers.
- STOP - If a text message recipient wishes to opt-out, they can send ‘STOP’ to the toll-free number. The carrier sends the following default response for STOP: "NETWORK MSG: You replied with the word "stop" which blocks all texts sent from this number. Text back "unstop" to receive messages again."
- START/UNSTOP - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send ‘START’ or ‘UNSTOP to the toll-free number. The carrier sends the following default response for START/UNSTOP: “NETWORK MSG: You have replied “unstop” and will begin receiving messages again from this number.”
- Azure Communication Services will detect the STOP message and block all further messages to the recipient. The delivery report will indicate a failed delivery with status message as “Sender blocked for given recipient.”
- The STOP, UNSTOP and START messages will be relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.

## How can I receive messages using Azure Communication Services?

ACS customers can use Azure Event Grid to receive incoming messages. Follow this [quickstart](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/telephony-sms/handle-sms-events) to setup your event-grid to receive messages.

## Can I send/receive long messages (>2048 chars)?

Azure Communication Services supports sending and receiving of long messages over SMS. However, some wireless carriers or devices may act differently when receiving long messages.

## How are messages sent to landline numbers treated?

In US, ACS does not check for landline numbers and will attempt to send it to carriers for delivery. Customers will be charged for messages sent to landline numbers. 

## Can I send messages to multiple recipients?


Yes, you can make one request with multiple recipients. Follow this [quickstart](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/telephony-sms/send?pivots=programming-language-csharp) to send messages to multiple recipients.





