---
title: Country availability of telephone numbers and subscription eligibility
titleSuffix: An Azure Communication Services concept document
description: Learn about Country Availability, Subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Communication Services.
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/04/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Country availability of telephone numbers and subscription eligibility

Numbers can be purchased on eligible Azure subscriptions and in geographies where Communication Services is legally eligible to provide them.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement*, Pay-As-You-Go |
| Short-Codes                      | Modern Customer Agreement (Field Led), Enterprise Agreement**, Pay-As-You-Go                                      |

\* In some countries/regions, number purchases are only allowed for own use. Reselling or suballcoating to another parties is not allowed. Due to this, purchases for CSP and LSP customers is not allowed.

\** Applications from all other subscription types will be reviewed and approved on a case-by-case basis. Reach out to acstns@microsoft.com for assistance with your application.

## Number capabilities and availability

The capabilities and numbers that are available to you depend on the country that you're operating within, your use case, and the phone number type that you've selected. These capabilities vary by country due to regulatory requirements.

The following tables summarize current availability:

## Customers with US Azure billing addresses

| Number            | Type        | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------------- | :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| USA & Puerto Rico | Toll-Free   | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local       | -                    | -                    | General Availability | General Availability\* |
| USA               | Short-Codes | General Availability | General Availability | -        | -          |
| Canada             | Toll-Free      | General Availability       | General Availability       | General Availability   | General Availability\* |
| Canada             | Local          | -        | -        | General Availability   | General Availability\* |
| UK                 | Toll-Free      | -        | -        | General Availability   | General Availability\* |
| UK                 | Local          | -        | -        | General Availability   | General Availability\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with UK Azure billing addresses

| Number             | Type           | Send SMS             | Receive SMS          | Make Calls       | Receive Calls    |
| :----------------- | :------------- | :------------------- | :------------------- | :--------------- | :--------------- |
| UK                 | Toll-Free      | -        | -        | General Availability   | General Availability\* |
| UK                 | Local          | -        | -        | General Availability   | General Availability\* |
| USA & Puerto Rico  | Toll-Free      | General Availability | General Availability | General Availability   | General Availability\* |
| USA & Puerto Rico  | Local          | -        | -        | General Availability   | General Availability\* |
| Canada             | Toll-Free      | General Availability       | General Availability       | General Availability   | General Availability\* |
| Canada             | Local          | -        | -        | General Availability   | General Availability\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Ireland Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls           | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------------- | :--------------- |
| Ireland           | Toll-Free | -        | -        | General Availability       | General Availability\* |
| Ireland           | Local     | -        | -        | General Availability       | General Availability\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | General Availability       | General Availability\* |
| USA & Puerto Rico | Local     | -        | -        | General Availability       | General Availability\* |
| Canada            | Toll-Free | General Availability | General Availability | General Availability  | General Availability\* |
| Canada            | Local     | -        | -        | General Availability       | General Availability\* |
| UK                | Toll-Free | -        | -        | General Availability       | General Availability\* |
| UK                | Local     | -        | -        | General Availability       | General Availability\* |


\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Denmark Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local     | -        | -        | General Availability | General Availability\* |
| Canada            | Toll-Free | General Availability | General Availability | General Availability  | General Availability\* |
| Canada            | Local     | -        | -        | General Availability       | General Availability\* |
| UK                | Toll-Free | -        | -        | General Availability       | General Availability\* |
| UK                | Local     | -        | -        | General Availability       | General Availability\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Canada Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Canada            | Toll-Free | General Availability | General Availability | General Availability  | General Availability\* |
| Canada            | Local     | -        | -        | General Availability       | General Availability\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local     | -        | -        | General Availability | General Availability\* |
| UK                | Toll-Free | -        | -        | General Availability       | General Availability\* |
| UK                | Local     | -        | -        | General Availability       | General Availability\* |


\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Italy Azure billing addresses

| Number  | Type      | Send SMS      | Receive SMS   | Make Calls     | Receive Calls    |
| :------ | :-------- | :------------ | :------------ | :------------- | :--------------- |
| Italy   | Toll-Free** | - | - | General Availability | General Availability\* |
| Italy   | Local**     | - | - | General Availability | General Availability\* |
| USA & Puerto Rico | Toll-Free   | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local       | -                    | -                    | General Availability | General Availability\* |
| Canada             | Toll-Free      | General Availability       | General Availability       | General Availability   | General Availability\* |
| Canada             | Local          | -        | -        | General Availability   | General Availability\* |
| UK                 | Toll-Free      | -        | -        | General Availability   | General Availability\* |
| UK                 | Local          | -        | -        | General Availability   | General Availability\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Italy can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Customers with Sweden Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Sweden            | Toll-Free | -        | -        | General Availability | General Availability\* |
| Sweden            | Local     | -        | -        | General Availability | General Availability\* |
| Canada            | Toll-Free | General Availability | General Availability | General Availability  | General Availability\* |
| Canada            | Local     | -        | -        | General Availability       | General Availability\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local     | -        | -        | General Availability | General Availability\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with France Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| France            | Local**     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in France can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Customers with Spain Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Spain           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Spain           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Switzerland Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Switzerland           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Belgium Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Belgium           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Belgium           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Luxembourg Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Luxembourg           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Austria Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Austria           | Toll-Free** | -        | -        | Public Preview | Public Preview\* |
| Austria           | Local**    | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Austria can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Customers with Portugal Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Portugal           | Toll-Free** | -        | -        | Public Preview | Public Preview\* |
| Portugal           | Local**     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Portugal can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Customers with Slovakia Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Slovakia           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Norway Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Norway           | Local**     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Norway can only be purchased for own use. Reselling or suballocating to another party is not allowed.


## Customers with Netherlands Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Netherlands           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Germany Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Germany           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Germany           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Next steps

For more information about Azure Communication Services' telephony options please see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
