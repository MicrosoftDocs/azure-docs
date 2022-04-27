---
title: SMS FAQ
titleSuffix: An Azure Communication Services concept document
description: SMS FAQ
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
---

# SMS FAQ
This article answers commonly asked questions about the SMS service. 

## Sending and receiving messages
### How can I receive messages using Azure Communication Services?

Azure Communication Services customers can use Azure Event Grid to receive incoming messages. Follow this [quickstart](../../quickstarts/sms/handle-sms-events.md) to setup your event-grid to receive messages.

### How are messages sent to landline numbers treated?

In the United States, Azure Communication Services does not check for landline numbers and will attempt to send it to carriers for delivery. Customers will be charged for messages sent to landline numbers. 

### Can I send messages to multiple recipients?

Yes, you can make one request with multiple recipients. Follow this [quickstart](../../quickstarts/sms/send.md?pivots=programming-language-csharp) to send messages to multiple recipients.

### I received a HTTP Status 202 from the Send SMS API but the SMS didn't reach my phone, what do I do now?

The 202 returned by the service means that your message has been queued to be sent and not delivered. Use this [quickstart](../../quickstarts/sms/handle-sms-events.md) to subscribe to delivery report events and troubleshoot. Once the events are configured, inspect the "deliveryStatus" field of your delivery report to verify delivery success/failure.

### How to send shortened URLs in messages?
Shortened URLs are a good way to keep messages short and readable. However, US carriers prohibit the use of free publicly available URL shortener services. This is because the ‘free-public’ URL shorteners are used by bad-actors to evade detection and get their SPAM messages passed through text messaging platforms. When sending messages in US, we encourage using custom URL shorteners to create URLs with dedicated domain that belongs to your brand. Many US carriers block SMS traffic if they contain publicly available URL shorteners.

Below is a list with examples of common URL shorteners you should avoid to maximize deliverability:
- bit.ly
- goo.gl
- tinyurl.com
- Tiny.cc
- lc.chat
- is.gd
- soo.gd
- s2r.co
- Clicky.me
- budurl.com
- bc.vc

## Opt-out handling
### How does Azure Communication Services handle opt-outs for toll-free numbers?

Opt-outs for US toll-free numbers are mandated and enforced by US carriers and cannot be overridden. 
- **STOP** - If a text message recipient wishes to opt-out, they can send ‘STOP’ to the toll-free number. The carrier sends the following default response for STOP: *"NETWORK MSG: You replied with the word "stop" which blocks all texts sent from this number. Text back "unstop" to receive messages again."*
- **START/UNSTOP** - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send ‘START’ or ‘UNSTOP’ to the toll-free number. The carrier sends the following default response for START/UNSTOP: *“NETWORK MSG: You have replied “unstop” and will begin receiving messages again from this number.”*
- Azure Communication Services will detect the STOP message and block all further messages to the recipient. The delivery report will indicate a failed delivery with status message as “Sender blocked for given recipient.”
- The STOP, UNSTOP and START messages will be relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.

### How does Azure Communication Services handle opt-outs for short codes?
- **STOP** - If a text message recipient wishes to opt-out, they can send ‘STOP’ to the short code. Azure Communication Services sends the following default response for STOP: *"You have successfully been unsubscribed to messages from this number. Reply START to resubscribe"*
- **START/UNSTOP** - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send ‘START’ or ‘UNSTOP to the toll-free number. Azure Communication Service sends the following default response for START/UNSTOP: *“You have successfully been re-subscribed to messages from this number. Reply STOP to unsubscribe.”*
- Azure Communication Services will detect the STOP message and block all further messages to the recipient. The delivery report will indicate a failed delivery with status message as “Sender blocked for given recipient.”
- The STOP, UNSTOP and START messages will be relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.

## Short codes
### What is the eligibility to apply for a short code?
Short Code availability is currently restricted to paid Azure enterprise subscriptions that have a billing address in the United States. Short Codes cannot be acquired on trial accounts or using Azure free credits. For more details, check out our [subscription eligibility page](../numbers/sub-eligibility-number-capability.md).

### Can you text to a toll-free number from a short code?
No. Texting to a toll-free number from a short code is not supported. You also wont be able to receive a message from a toll-free number to a short code.

### How should a short code be formatted?
Short codes do not fall under E.164 formatting guidelines and do not have a country code, or a "+" sign prefix. In the SMS API request, your short code should be passed as the 5-6 digit number you see in your short codes blade without any prefix. 

### How long does it take to get a short code? What happens after a short code program brief application is submitted?
Once you have submitted the short code program brief application in the Azure portal, Azure Communication Services works with the aggregators to get your application approved by each mobile carrier. This process generally takes 8-12 weeks.

## Character and rate limits
### What is the SMS character limit?
 The size of a single SMS message is 140 bytes. The character limit per single message being sent depends on the message content and encoding used. Azure Communication Services supports both GSM-7 and UCS-2 encoding. 

- **GSM-7** - A message containing text characters only will be encoded using GSM-7
- **UCS-2** - A message containing unicode (emojis, international languages) will be encoded using UCS-2

This table shows the maximum number of characters that can be sent per SMS segment to carriers:

|Message|Type|Characters used in the message|Encoding|Maximum characters in a single segment|
|-------|----|---------------|--------|--------------------------------------|
|Hello world|Text|GSM Standard|GSM-7|160|
|你好|Unicode|Unicode|UCS-2|70|

### Can I send/receive long messages (>2048 chars)?

Azure Communication Services supports sending and receiving of long messages over SMS. However, some wireless carriers or devices may act differently when receiving long messages.

### Are there any limits on sending messages?

To ensure that we continue offering the high quality of service consistent with our SLAs, Azure Communication Services applies rate limits (different for each primitive). Developers who call our APIs beyond the limit will receive a 429 HTTP Status Code Response. If your company has requirements that exceed the rate-limits, please email us at phone@microsoft.com.

Rate Limits for SMS:

|Operation|Number Type |Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send Message|Toll-Free|Per Number|60|200|200|
|Send Message|Short Code |Per Number|60|6000|6000|

## Carrier Fees 
### What are the carrier fees for SMS?
In July 2021, US carriers started charging an added fee for SMS messages sent and/or received from toll-free numbers and short codes. Carrier fees for SMS are charged per message segment based on the destination. Azure Communication Services charges a standard carrier fee per message segment. Carrier fees are subject to change by mobile carriers. Please refer to [SMS pricing](../sms-pricing.md) for more details. 

### When will we come to know of changes to these surcharges?
As with similar Azure services, customers will be notified at least 30 days prior to the implementation of any price changes. These charges will be reflected on our SMS pricing page along with the effective dates. 
 
## Emergency support
### Can a customer use Azure Communication Services for emergency purposes?

Azure Communication Services does not support text-to-911 functionality in the United States, but it’s possible that you may have an obligation to do so under the rules of the Federal Communications Commission (FCC).  You should assess whether the FCC’s text-to-911 rules apply to your service or application. To the extent you're covered by these rules, you'll be responsible for routing 911 text messages to emergency call centers that request them. You're free to determine your own text-to-911 delivery model, but one approach accepted by the FCC involves automatically launching the native dialer on the user’s mobile device to deliver 911 texts through the underlying mobile carrier.
