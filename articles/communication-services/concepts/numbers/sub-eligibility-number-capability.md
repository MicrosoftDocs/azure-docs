---
title: Subscription Eligibility and Number Capabilities in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Communication Services.
author: sadas
manager: rcole
services: azure-communication-services

ms.author: sadas
ms.date: 03/04/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Subscription eligibility and number capabilities

Numbers can be purchased on eligible Azure subscriptions and in geographies where Communication Services is legally eligible to provide them.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

Additional details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement* |
| Short-Codes                      | Modern Customer Agreement (Field Led) and Enterprise Agreement**                                       |

\* Allowing the purchase of Italian phone numbers for CSP and LSP customers is planned only for General Availability launch. 

\** Applications from all other subscription types will be reviewed and approved on a case-by-case bases

## Number capabilities

The capabilities that are available to you depend on the country that you're operating within (your Azure billing address location), your use case, and the phone number type that you've selected. These capabilities vary by country due to regulatory requirements.

The tables below summarize current availability:

## Customers with US Azure billing addresses

| Number            | Type        | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------------- | :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| USA & Puerto Rico | Toll-Free   | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local       | -                    | -                    | General Availability | General Availability\* |
| USA               | Short-Codes | Public Preview       | Public Preview\*     | -        | -          |

\* Available through Azure Bot Framework and Dynamics only

## Customers with UK Azure billing addresses

| Number             | Type           | Send SMS             | Receive SMS          | Make Calls       | Receive Calls    |
| :----------------- | :------------- | :------------------- | :------------------- | :--------------- | :--------------- |
| UK                 | Toll-Free      | -        | -        | Public Preview   | Public Preview\* |
| UK                 | Local          | -        | -        | Public Preview   | Public Preview\* |
| USA & Puerto Rico  | Toll-Free      | General Availability | General Availability | Public Preview   | Public Preview\* |
| USA & Puerto Rico  | Local          | -        | -        | Public Preview   | Public Preview\* |
| Canada             | Toll-Free      | Public Preview       | Public Preview       | Public Preview   | Public Preview\* |
| Canada             | Local          | -        | -        | Public Preview   | Public Preview\* |

\* Available through Azure Bot Framework and Dynamics only

## Customers with Ireland Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls           | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------------- | :--------------- |
| Ireland           | Toll-Free | -        | -        | Public Preview       | Public Preview\* |
| Ireland           | Local     | -        | -        | Public Preview       | Public Preview\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | Public Preview       | Public Preview\* |
| USA & Puerto Rico | Local     | -        | -        | Public Preview       | Public Preview\* |
| Canada            | Toll-Free | Public Preview       | Public Preview       | Public Preview       | Public Preview\* |
| Canada            | Local     | -        | -        | Public Preview       | Public Preview\* |
| UK                | Toll-Free | -        | -        | Public Preview       | Public Preview\* |
| UK                | Local     | -        | -        | Public Preview       | Public Preview\* |


\* Available through Azure Bot Framework and Dynamics only

## Customers with Denmark Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | Public Preview | Public Preview\* |
| USA & Puerto Rico | Local     | -        | -        | Public Preview | Public Preview\* |
| Canada            | Toll-Free | Public Preview       | Public Preview       | Public Preview | Public Preview\* |
| Canada            | Local     | -        | -        | Public Preview | Public Preview\* |
| UK                | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| UK                | Local     | -        | -        | Public Preview | Public Preview\* |

\* Available through Azure Bot Framework and Dynamics only

## Customers with Canada Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Canada            | Toll-Free | Public Preview       | Public Preview       | Public Preview | Public Preview\* |
| Canada            | Local     | -        | -        | Public Preview | Public Preview\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | Public Preview | Public Preview\* |
| USA & Puerto Rico | Local     | -        | -        | Public Preview | Public Preview\* |
| UK                | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| UK                | Local     | -        | -        | Public Preview | Public Preview\* |


\* Available through Azure Bot Framework and Dynamics only

## Customers with Italy Azure billing addresses

| Number  | Type      | Send SMS      | Receive SMS   | Make Calls     | Receive Calls    |
| :------ | :-------- | :------------ | :------------ | :------------- | :--------------- |
| Italy   | Toll-Free** | - | - | Public Preview | Public Preview\* |
| Italy   | Local**     | - | - | Public Preview | Public Preview\* |

\* Available through Azure Bot Framework and Dynamics only

\** Allowing the purchase of Italian phone numbers for CSP and LSP customers is planned only for General Availability launch.

## Customers with Sweden Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Sweden            | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Sweden            | Local     | -        | -        | Public Preview | Public Preview\* |
| Canada            | Toll-Free | Public Preview       | Public Preview       | Public Preview | Public Preview\* |
| Canada            | Local     | -        | -        | Public Preview | Public Preview\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | Public Preview | Public Preview\* |
| USA & Puerto Rico | Local     | -        | -        | Public Preview | Public Preview\* |

\* Available through Azure Bot Framework and Dynamics only

## Next steps

For additional information about Azure Communication Services' telephony options please see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
