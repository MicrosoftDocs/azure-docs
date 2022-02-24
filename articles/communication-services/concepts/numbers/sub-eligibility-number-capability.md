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

## Customers with US Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|USA (includes PR)   |Toll-Free   |GA   |GA   |GA   |GA*   |
|USA (includes PR)   |Local |  |   |GA   |GA*   |
|USA  |Short-Codes |Public Preview  |Public Preview*   |   |   |

## Customers with UK Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|UK  |Toll-Free   |  |  |Public Preview   |Public Preview*   |
|UK  |Local |   |   |Public Preview   |Public Preview*   |
|USA (includes PR)   |Toll-Free   |GA   |GA  |Public Preview   |Public Preview*   |
|USA (includes PR)   |Local |   |   |Public Preview   |Public Preview*   |

## Customers with Ireland Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|USA (includes PR)   |Toll-Free   |GA   |GA   |GA   |GA*   |
|USA (includes PR)   |Local |  |   |GA   |GA*   |

## Customers with Denmark Azure Billing Addresses
|Number|Type   |Send SMS   | Receive SMS |Make Calls   |Receive Calls|
|:---|:---|:---|:---|:---|:---|
|Denmark  |Toll-Free   |  |  |Public Preview   |Public Preview*   |
|Denmark  |Local |   |   |Public Preview   |Public Preview*   |

***
\* Available through Azure Bot Framework and Dynamics only

## Next Steps
In this quickstart, you learned about Subscription Eligibility and Number Capabilities for Communication Services.

The following documents may be interesting to you:
- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
