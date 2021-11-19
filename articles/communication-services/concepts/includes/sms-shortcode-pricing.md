---
title: Short Code SMS Pricing include file
description: include file
services: azure-communication-services
author: prakulka
manager: shahen

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/30/2021
ms.topic: include
ms.custom: include file
ms.author: prakulka
---

SMS service is priced on a per-message basis. SMS pricing is determined by the number type, destination carrier, and location of the number you're using as well as the destination of your SMS messages. 

## Short Codes Pricing

### Provisioning Fee
Fees for short code provisioning are charged upfront during provisioning period:

|Fee type   | Description|Fee|
|--------------|------|-----|
|Provisioning Fee |Charged at the time the Short Code is delivered |$650 |
|Random Short Code Fee |Charged prior to short code delivery. Waived for a limited period|$1000/mo |
|Vanity Short Code Fee |Charged prior to short code delivery. Waived for a limited period|$1500/mo |


### Leasing Fee
Fees for short code leasing are charged after provisioning is complete and then recur on a month-to-month basis:

|Number type   |Monthly fee   |
|--------------|-----------|
|Random Short Code |$1000/mo |
|Vanity Short Code |$1500/mo |


### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent from a short code to phone numbers located within the United States. 

The following prices include required communications taxes and fees:

|Operation   |Usage Fee |
|-----------|------------|
|Send messages (per message segment*) |$0.0075 |
|Receive messages (per message segment*) |$0.0075 |

*Please see [here](./telephony-sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge
Additional flat carrier surcharge of $0.0025/sent msg segment would be applicable. Carrier surcharge is subject to change. Click <Link-To-be-added> for details.
