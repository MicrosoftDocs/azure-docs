---
title: Short Code SMS Pricing includes file
description: include file
services: azure-communication-services
author: prakulka
manager: shahen

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/30/2021
ms.topic: include
ms.custom: Include file
ms.author: prakulka
---
>[!Important] 
>Short Code availability is currently restricted to Azure enterprise subscriptions that have a billing address in the United States.

The Short Code service requires provisioning a short code through the Azure portal. Once a short code is provisioned, pay-as-you-go pricing applies to the leasing fee, usage fee, and the carrier surcharge. The leasing fee, usage fee, and the carrier surcharge are determined by the short code type, location of the short code, destination, and the carrier of the message.

## Short Codes Pricing

### Provisioning Fee
Fees for short code provisioning are charged during the short code provisioning period:

|Fee type   | Description |Fee|
|-----------|-------------|---|
|Setup Fee |Charged at the time the Short Code is delivered |$650 |
|Random Short Code Fee |Charged before to short code delivery. Waived for a limited period|$1000/mo*|

*Extra $500/mo would be charged for Vanity short codes

>[!Note] 
>Short Codes provisioning typically takes on average 8-12 weeks.

### Leasing Fee
Fees for short code leasing are charged after provisioning is complete and then recur on a month-to-month basis:

|Number type | Monthly fee |
|----------|-----------|
|Random Short Code |$1000/mo* |

*Extra $500/mo would be charged for Vanity short codes

### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent from a short code to phone numbers located within the United States. 

The following prices are exclusive of the required communications taxes and fees:

|Message Type   |Usage Fee |
|-----------|------------|
|Send messages (per message segment*) |$0.0075 |
|Receive messages (per message segment*) |$0.0075 |

*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge
An extra flat carrier surcharge of $0.0025/sent message segment is also applicable. A carrier surcharge is subject to change. See our guide on [Carrier surcharges](https://github.com/Azure/Communication/blob/master/sms-carrier-surcharge.md) for details.
