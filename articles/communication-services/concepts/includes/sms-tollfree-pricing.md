---
title: Toll-free SMS Pricing include file
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
>[!Important] 
>Toll-free availability is currently restricted to Azure subscriptions that have a billing address in the United States.

The Toll-free SMS service requires provisioning a toll-free number through the Azure portal. Once a toll-free number is provisioned, pay-as-you-go pricing applies to the leasing fee, and the usage fee. The leasing fee, and the usage fee is determined by the short code type, location of the short code, and the destination.

## Toll Free Pricing

### Leasing Fee
Fees for toll-free leasing are charged after provisioning and then recur on a month-to-month basis:

|Number type   |Monthly fee |
|--------------|-----------|
|Toll-free (United States) |$2/mo|

### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States.

The following prices include required communications taxes and fees:

|Message Type   |Usage Fee |
|-----------|------------|
|Send messages (per message segment*) |$0.0075 |
|Receive messages (per message segment*) |$0.0075 |

*Please see our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge
A standard carrier surcharge of $0.0025/sent message segment and $0.0010/received message segment is also applicable. A carrier surcharge is subject to change. See our guide on [Carrier surcharges](https://github.com/Azure/Communication/blob/master/sms-carrier-surcharge.md) for details.
