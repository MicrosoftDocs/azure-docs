---
title: Phone Number Management for United States
titleSuffix: An Azure Communication Services concept document
description: Learn about Country Availability, Subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Communication Services.
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/30/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Phone number management for United States
Use the below tables to find all the relevant information on number availability, eligibility and restrictions for phone numbers in United States.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic/National) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement*, Pay-As-You-Go |
| Short-Codes                      | Modern Customer Agreement (Field Led), Enterprise Agreement**, Pay-As-You-Go                                      |

\* In some countries/regions, number purchases are only allowed for own use. Reselling or suballcoating to another parties isn't allowed. Due to this restriction, purchases for CSP and LSP customers aren't allowed.

\** Applications from all other subscription types are reviewed and approved on a case-by-case basis. Reach out to acstns@microsoft.com for assistance with your application.


## Customers with United States Azure billing addresses

| Number            | Type        | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------------- | :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| USA & Puerto Rico | Toll-Free   | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local       | -                    | -                    | General Availability | General Availability\* |
| USA               | Short-Codes\** | General Availability | General Availability | -        | -          |
| UK                 | Toll-Free      | -        | -        | General Availability   | General Availability\* |
| UK                 | Local          | -        | -        |
| Canada             | Toll-Free      | General Availability       | General Availability       | General Availability   | General Availability\* |
| Canada             | Local          | -        | -        | General Availability   | General Availability\* |
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
|  Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia | Alphanumeric Sender ID\** | Public Preview       | -       | -        | -          |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

**Use the drop-down to select the country/region where you're getting numbers. You'll find information about availability, restrictions and other related info on the country specific page**
> [!div class="op_single_selector"]
>
> - [United States](../numbers/phone-number-management-for-united-states.md)
> - [Canada](../numbers/phone-number-management-for-canada.md)
> - [Country](../numbers/phone-number-management-for-canada.md)
> - [Country2](../numbers/phone-number-management-for-canada.md)
> - [Country3](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)
> - [Country4](../numbers/phone-number-management-for-canada.md)


## Next steps

For more information about Azure Communication Services' telephony options, see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
