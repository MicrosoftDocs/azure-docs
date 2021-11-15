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

### Leasing Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Toll-free (United States) |$2/mo |


### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Carriers charge additional surcharges per message. Please refer to [this](./sms-pricing.md#ccarrier-surcharge) section for carrier surcharges per number type.

The following prices include required communications taxes and fees:

|Number Type   |Send messages (per message segment*)|Receive messages (per message segment*)|
|-----------|------------|------------|
|Toll-free (United States)    |$0.0075 | $0.0075 |

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Short Codes Pricing

### Leasing Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Random Short Code (United States) |$1000/mo |
|Vanity Short Code (United States) |$1500/mo |

### Setup Fee
Fees for phone number leasing are charged upfront and then recur on a month-to-month basis:

|Fee type   | Description|Fee|
|--------------|------|-----|
|Provisioning Fee (United States) |Charged at the time the Short Code is delivered |$650 |
|Service Fee (United States) |Charged prior to short code delivery. Waived for a limited period|$1000/mo |


### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States. Carriers charge additional surcharges per message. Please refer to [this](./sms-pricing.md#carrier-surcharge) section for carrier surcharges per number type.

The following prices include required communications taxes and fees:

|Number Type   |Send messages (per message segment*)|Receive messages (per message segment*)|
|-----------|------------|------------|
|Short code (United States)    |$0.0075 | $0.0075|

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge

|Number Type   |Send messages (per message segment*)|Receive messages (per message segment*)|
|-----------|------------|------------|
|Toll-free (United States)   |$0.0025 | $0.0010 |
|Short Codes (United States)    |$0.0025 |  |

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

