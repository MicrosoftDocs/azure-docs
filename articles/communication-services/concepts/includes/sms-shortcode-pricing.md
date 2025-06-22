---
title: Short Code SMS Pricing
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
> [!IMPORTANT]
> Short Code availability is currently restricted to Azure enterprise subscriptions that have a billing address in the United States, Canada, and United Kingdom.

> [!IMPORTANT]
>
>- For billing locations in the US and Puerto Rico, Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits aren't eligible for purchasing the products. In addition, customer spend on the products isn't eligible for Microsoft Azure Consumption Commitment drawdown.
>
>- For billing locations outside the US and Puerto Rico, Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits aren't eligible for purchasing the products.

To use the Short Code service, you need to provision a short code through the Azure portal. Once you provision a short code, pay-as-you-go pricing applies to the leasing fee, usage fee, and the carrier surcharge. Azure Communication Services determines the leasing fee, usage fee, and carrier surcharge by the short code type, location of the short code, destination, and the carrier of the message.

## Short Codes pricing

### Setup fee

When you apply for a short code, there are two charges to consider:

- Prepaid Monthly Fee: A fee that covers the period from the day of application until the short code is delivered. Currently, this fee is temporarily waived and isn't charged.
- Setup Fee: A one-time charge applied at the time the short code is delivered.

#### Prepaid fee

|Country/Region|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada| Short Code Fee |Charged before short code delivery.|$1000/mo|
|United Kingdom| Short Code Fee |Charged before short code delivery.|$1600/mo|
|United States|Random Short Code Fee |Charged before short code delivery.|$1000/mo*|

*Extra $500/mo would be charged for Vanity short codes"
> [!NOTE]
> The pre-paid monthly fee is currently waived and is not charged. The fee waiver is a temporary measure and subject to change.

#### Setup fee details

|Country/Region|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada|Setup Fee |Charged at the time the Short Code is delivered |$3,000|
|United States|Setup Fee |Charged at the time the Short Code is delivered |$650|

> [!NOTE]
> Short Codes provisioning typically takes on average 8 to 12 weeks.

### Leasing fee

Fees for short code leasing are charged after provisioning is complete and then recur on a month-to-month basis:

|Country/Region|Number type | Monthly fee |
|--------|----------|-----------|
|Canada|Random Short Code |$1000/mo |
|United Kingdom|Random Short Code |$1600/mo |
|United States|Random Short Code |$1000/mo* |

*Extra $500/mo would be charged for Vanity short codes

### Usage fee

SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. You can send messages from a short code to phone numbers located within the specified countries or regions. 

The following prices don't include the required communications taxes and fees:

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0268 | $0.0061|
|United Kingdom| $0.04 | $0.0075|
|United States| $0.0075 | $0.0075|

*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

### Carrier surcharge

A standard carrier surcharge applies to messages exchanged via short-codes. A carrier surcharge is a per-message segment* charge and is subject to change. Carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages. See the SMS FAQ [Carrier fees](../sms/sms-faq.md#carrier-fees).

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0050 | NA|
|United States| $0.0025 | NA|
