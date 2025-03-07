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

> [!IMPORTANT]
>- For billing locations in the US and Puerto Rico – Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits are not eligible for purchasing the products. Additionally, customer spend on the products is not eligible for Microsoft Azure Consumption Commitment drawdown.
>
>
>- For billing locations outside the US and Puerto Rico Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits are not eligible for purchasing the products.

The Short Code service requires provisioning a short code through the Azure portal. Once a short code is provisioned, pay-as-you-go pricing applies to the leasing fee, usage fee, and the carrier surcharge. The leasing fee, usage fee, and the carrier surcharge are determined by the short code type, location of the short code, destination, and the carrier of the message.

## Short Codes Pricing

### Setup Fee
When applying for a short code, there are two charges to consider:

- Pre-paid Monthly Fee: This fee covers the period from the day of application until the short code is delivered. Currently, this fee is temporarily waived and will not be charged.
- Setup Fee: This is a one-time charge applied at the time the short code is delivered.

#### Pre-paid fee

|Country/Region|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada| Short Code Fee |Charged before short code delivery.|$1000/mo|
|United Kingdom| Short Code Fee |Charged before short code delivery.|$1600/mo|
|United States|Random Short Code Fee |Charged before short code delivery.|$1000/mo*|

*Extra $500/mo would be charged for Vanity short codes"
>[!Note] 
>The pre-paid monthly fee is currently waived and will not be charged. Please be aware that this is a temporary measure and subject to change.

#### Setup fee

|Country/Region|Fee type   | Description |Fee|
|---------|-----------|-------------|---|
|Canada|Setup Fee |Charged at the time the Short Code is delivered |$3000|
|United States|Setup Fee |Charged at the time the Short Code is delivered |$650|

>[!Note] 
>Short Codes provisioning typically takes on average 8-12 weeks.

### Leasing Fee
Fees for short code leasing are charged after provisioning is complete and then recur on a month-to-month basis:

|Country/Region|Number type | Monthly fee |
|--------|----------|-----------|
|Canada|Random Short Code |$1000/mo |
|United Kingdom|Random Short Code |$1600/mo |
|United States|Random Short Code |$1000/mo* |

*Extra $500/mo would be charged for Vanity short codes

### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message. Messages can be sent from a short code to phone numbers located within the specified countries or regions. 

The following prices are exclusive of the required communications taxes and fees:

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0268 | $0.0061|
|United Kingdom| $0.04 | $0.0075|
|United States| $0.0075 | $0.0075|

*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.

### Carrier surcharge
A standard carrier surcharge is applicable to messages exchanged via short-codes. A carrier surcharge is a per-message segment* charge and is subject to change. Carrier surcharge is calculated based on the destination of the message for sent messages and based on the sender of the message for received messages.  See our guide on [Carrier surcharges]

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|Canada | $0.0050 | NA|
|United States| $0.0025 | NA|
