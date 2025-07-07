---
title: Toll free SMS pricing
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

> [!NOTE]
> In most cases, customers with Azure subscriptions locations that match the country/region of the Number offer can buy the Number. However, US and Canada numbers may be purchased by customers with Azure subscription locations in other countries/regions. For details about in-country/region and cross-country/region purchases, see [Country/region availability of telephone numbers and subscription eligibility](../numbers/sub-eligibility-number-capability.md).

> [!IMPORTANT]
>
>- For billing locations in the US and Puerto Rico, Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits aren't eligible for purchasing the products. In addition, customer spend on the products isn't eligible for Microsoft Azure Consumption Commitment drawdown.
>
>- For billing locations outside the US and Puerto Rico, Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits aren't eligible for purchasing the products.

To use the Toll-free SMS service, you need to provision a toll-free number through the Azure portal. Once you provision a toll-free number, pay-as-you-go pricing applies to the leasing fee and the usage fee. Azure Communication Services determines the leasing fee and the usage fee by the location of the toll-free number and the destination.

## Toll free pricing

### Leasing fee

Fees for toll free leasing are charged after provisioning and then recur on a month-to-month basis:

|Country/Region |Number type |Monthly fee|
|--------|-----------|------------|
|United States|Toll-free  |$2/mo|
|Canada| Toll-free |$2/mo|
|Puerto Rico| Toll-free |$2/mo|

### Usage Fee

SMS offers pay-as-you-go pricing. The price is a per-message segment* charge based on the destination of the message. You can send messages by toll-free phone numbers to phone numbers located within the United States, Canada, and Puerto Rico.

The following prices are exclusive of the required communications taxes and fees:

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0075 | $0.0075|
|Canada | $0.0075 | $0.0075|
|Puerto Rico | $0.0400 | $0.0075|

*For more information about message segments, see [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit).

## Carrier surcharge

A standard carrier surcharge is applicable to messages exchanged via toll free numbers. A carrier surcharge is a per-message segment* charge and is subject to change. Carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages. For more information, see [Carrier surcharges](https://github.com/Azure/Communication/blob/master/sms-carrier-surcharge.md). For more information about how SMS prices are calculated, see [Pricing example: 1:1 SMS sending](../pricing.md#pricing-example-11-sms-sending).

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0025 | $0.0010|
|Canada | $0.0085 | NA|

*For more information about message segments, see [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit).
