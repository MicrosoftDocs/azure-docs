---
title: Subscription Eligibility and Number Capabilities in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Communication Services.
author: sadas
manager: rcole
services: azure-communication-services

ms.author: sadas
ms.date: 11/28/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Subscription Eligibility and Number Capabilities

Numbers can be purchased on eligible Azure subscriptions and in geographies where Communication Services is legally eligible to provide them.

## Subscription Eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

Additional details on eligible subscription types are as follows:

|Number Type   |Eligible Azure Agreement Type|
|:---|:---|
|Toll-Free and Local (Geographic)|Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement|
|Short-Codes   |Modern Customer Agreement (Field Led) and Enterprise Agreement Only|

## Number Capabilities

The capabilities that are available to you depend on the country that you're operating within (your Azure billing address location), your use case, and the phone number type that you've selected. These capabilities vary by country due to regulatory requirements.

The tables below summarize current availability:

### Customers with US Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|USA (includes PR)   |Toll-Free   |GA   |GA   |GA   |GA   |
|USA (includes PR)   |Local |  |   |GA   |GA   |
|USA  |Short-Codes |Public Preview  |Public Preview   |   |   |

### (New) Customers with UK Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|USA (includes PR)   |Toll-Free   |GA   |GA  |Public Preview   |Public Preview   |
|USA (includes PR)   |Local |   |   |Public Preview   |Public Preview   |

### (New) Customers with Ireland Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|USA (includes PR)   |Toll-Free   |GA   |GA   |GA   |GA   |
|USA (includes PR)   |Local |  |   |GA   |GA   |

## Next Steps
- Get a [Toll-Free or Local Phone Number](../../quickstarts/telephony/get-phone-number.md)
- Get a [Short-Code](../../quickstarts/sms/apply-for-short-code.md)

