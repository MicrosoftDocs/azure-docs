---
title: Phone Number Management for Italy
titleSuffix: An Azure Communication Services concept document
description: Learn about subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Italy.
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/30/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Phone number management for Italy
Use the below tables to find all the relevant information on number availability, eligibility and restrictions for phone numbers in Italy.

## Number types and capabilities availability

| Number Type | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| Toll-Free***    |-  | - | General Availability | General Availability\* |
| Local***        | -                    | -                    | General Availability | General Availability\* |
|Alphanumeric Sender ID\**|General Availability      |-|-|-|

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

\*** Phone numbers from Italy can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired by Azure free credits. Also, due to regulatory reasons phone number availability is dependent on your Azure subscription billing location.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic/National) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement*, Pay-As-You-Go |
| Alphanumeric Sender ID            | Modern Customer Agreement (Field Led and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement**, Pay-As-You-Go                                      |

\* In some countries/regions, number purchases are only allowed for own use. Reselling or suballcoating to another parties is not allowed. Due to this, purchases for CSP and LSP customers is not allowed.

\** Applications from all other subscription types are reviewed and approved on a case-by-case basis. Reach out to acstns@microsoft.com for assistance with your application.


## Azure subscription billing locations where Italy phone numbers are available
| Country/Region |
| :---------- |
|Canada|
|Denmark|
|Ireland|
|Italy|
|Puerto Rico|
|Sweden|
|United Kingdom|
|United States|

## Azure subscription billing locations where Italy alphanumeric sender IDs are available
| Country/Region |
| :---------- |
| Australia |
| Austria |
| Denmark |
| France |
| Germany |
| India |
| Ireland |
| Italy |
| Netherlands |
| Poland |
| Portugal |
| Puerto Rico |
| Spain |
| Sweden |
| Switzerland |
| United Kingdom |
| United States |

## Find information about other countries/regions

[!INCLUDE [Country Dropdown](../../includes/country-dropdown.md)]

## Next steps

For more information about Azure Communication Services' telephony options, see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
