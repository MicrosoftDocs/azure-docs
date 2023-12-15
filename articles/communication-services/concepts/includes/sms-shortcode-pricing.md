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
>Short Code availability is currently restricted to Azure enterprise subscriptions that have a billing address in the United States, Canada, and United Kingdom.

The Short Code service requires provisioning a short code through the Azure portal. Once a short code is provisioned, pay-as-you-go pricing applies to the leasing fee, usage fee, and the carrier surcharge. The leasing fee, usage fee, and the carrier surcharge are determined by the short code type, location of the short code, destination, and the carrier of the message.

## Short Codes Pricing

### Provisioning Fee
There are 2 types of fees for short code provisioning.

**Setup fee:**

|Country|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada|Setup Fee |Charged at the time the Short Code is delivered |$3000|
|United States|Setup Fee |Charged at the time the Short Code is delivered |$650|

**Short code fee:**

|Country|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada| Short Code Fee |Charged before short code delivery. Waived for a limited period|$1000/mo|
|United Kingdom| Short Code Fee |Charged before short code delivery. Waived for a limited period|$1600/mo|
|United States|Random Short Code Fee |Charged before short code delivery. Waived for a limited period|$1000/mo*|

*Extra $500/mo would be charged for Vanity short codes

>[!Note] 
>Short Codes provisioning typically takes on average 8-12 weeks.

### Leasing Fee
Fees for short code leasing are charged after provisioning is complete and then recur on a month-to-month basis:

|Country|Number type | Monthly fee |
|--------|----------|-----------|
|Canada|Random Short Code |$1000/mo |
|United Kingdom|Random Short Code |$1600/mo |
|United States|Random Short Code |$1000/mo* |

*Extra $500/mo would be charged for Vanity short codes

### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent from a short code to phone numbers located within the specified countries. 

The following prices are exclusive of the required communications taxes and fees:

|Country| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0268 | $0.0061|
|United Kingdom| $0.04 | $0.0075|
|United States| $0.0075 | $0.0075|


*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge
A standard carrier surcharge is applicable to messages exchanged via toll-free numbers. A carrier surcharge is a per-message segment* charge and is subject to change. Carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages.  See our guide on [Carrier surcharges]

|Country| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0050 | NA|
|United States| $0.0025 | NA|
