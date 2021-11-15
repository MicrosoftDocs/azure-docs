---
title: Pricing for SMS
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' SMS Pricing Model.
author: prakulka
ms.author: prakulka
ms.date: 11/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# SMS Pricing 

SMS service is priced on a per-message basis. SMS pricing is determined by the number type, destination carrier, and location of the number you're using as well as the destination of your SMS messages. 

## Toll Free Pricing

###Leasing Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Toll-free (United States) |$2/mo |


###Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Carriers charge additional surcharges per message. Please refer to [this](./sms-pricing.md#ccarrier-surcharge) section for carrier surcharges per number type.

The following prices include required communications taxes and fees:

|Country   |Send messages|Receive messages|
|-----------|------------|------------|
|USA (Toll-free)    |$0.0075/message segment*  | $0.0075/message segment |

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Short Codes Pricing

###Leasing Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Random Short Code (United States) |$1000/mo |
|Vanity Short Code (United States) |$1500/mo |

###Setup Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Fee type   |Monthly fee   |
|--------------|-----------|
|Provisioning Fee (United States) 
<br>*Charged at the time the Short Code is delivered* |$1000/mo |
|Vanity Short Code (United States) |$1500/mo |


###Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Carriers charge additional surcharges per message. Please refer to [this](./sms-pricing.md#ccarrier-surcharge) section for carrier surcharges per number type.

The following prices include required communications taxes and fees:

|Country   |Send messages|Receive messages|
|-----------|------------|------------|
|USA (Toll-free)    |$0.0075/message segment*  | $0.0075/message segment |

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.


