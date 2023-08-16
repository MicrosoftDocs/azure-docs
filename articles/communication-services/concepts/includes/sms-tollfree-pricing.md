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
>In most cases, customers with Azure subscriptions locations that match the country/region of the Number offer will be able to buy the Number. However, US and Canada numbers may be purchased by customers with Azure subscription locations in other countries/regions. Please see [here](../numbers/sub-eligibility-number-capability.md) for details on in-country and cross-country purchases.

The Toll-free SMS service requires provisioning a toll-free number through the Azure portal. Once a toll-free number is provisioned, pay-as-you-go pricing applies to the leasing fee, and the usage fee. The leasing fee, and the usage fee is determined by the short code type, location of the short code, and the destination.

## Toll Free Pricing

### Leasing Fee
Fees for toll-free leasing are charged after provisioning and then recur on a month-to-month basis:

|Country/Region |Number type |Monthly fee|
|--------|-----------|------------|
|United States|Toll-free  |$2/mo|
|Canada| Toll-free |$2/mo|
|Puerto Rico| Toll-free |$2/mo|

### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment* charge based on the destination of the message. Messages can be sent by toll-free phone numbers to phone numbers located within the United States, Canada, and Puerto Rico.

The following prices are exclusive of the required communications taxes and fees:

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0075 | $0.0075|
|Canada | $0.0075 | $0.0075|
|Puerto Rico | $0.0400 | $0.0075|

*Please see our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

## Carrier surcharge
A standard carrier surcharge is applicable to messages exchanged via toll-free numbers. A carrier surcharge is a per-message segment* charge and is subject to change. Carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages.  See our guide on [Carrier surcharges](https://github.com/Azure/Communication/blob/master/sms-carrier-surcharge.md) for details. See our pricing example [here](../pricing.md#pricing-example-11-sms-sending) to see how SMS prices are calculated.

|Country| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0025 | $0.0010|
|Canada | $0.0085 | NA|

*Please see our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.
