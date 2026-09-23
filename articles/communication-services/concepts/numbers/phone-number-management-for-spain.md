---
title: Phone Number Management for Spain
titleSuffix: An Azure Communication Services concept document
description: Learn about subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Spain.
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/30/2023
ms.topic: reference
ms.service: azure-communication-services
ms.custom: references_regions
---

# Phone number management for Spain

> [!IMPORTANT]
> Effective **September 15, 2026**, Microsoft will no longer provide Dynamic or Preregistered alphanumeric sender IDs for SMS to **Spain** phone numbers. After September 15, 2026, sender IDs will no longer be allowed in Spain, and messages will be blocked.
>
> Developers are encouraged to find an alternate product on the [Microsoft Marketplace](https://aka.ms/acs-marketplace) where customers may wish to explore third-party providers,  including [Infobip](https://aka.ms/acs-infobip) and [Telesign](https://aka.ms/acs-telesign).

Use the below tables to find all the relevant information on number availability, eligibility and restrictions for phone numbers in Spain.

## Number types and capabilities availability

| Number Type | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| Toll-Free   |-  | - | General Availability | General Availability\* |
| Local       | -                    | -                    | General Availability | General Availability\* |
|Alphanumeric Sender ID\**|-|-|-|-|

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** As of September 15, 2026 Microsoft will no longer provide alphanumeric sender IDs for SMS to Spain.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired by Azure free credits. Also, due to regulatory reasons phone number availability is dependent on your Azure subscription billing location.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic/National) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement, Pay-As-You-Go |
| Alphanumeric Sender ID            | As of September 15, 2026 Microsoft will no longer provide alphanumeric sender IDs for SMS to Spain.              |

\** Applications from all other subscription types are reviewed and approved on a case-by-case basis. Create a ticket to https://pstnsd.powerappsportals.com/ for assistance.


## Azure subscription billing locations where Spain phone numbers are available
| Country/Region |
| :---------- |
|Australia|
|Canada|
|France|
|Germany|
|Italy|
|Japan|
|Netherlands|
|Spain|
|Switzerland|
|United Kingdom|
|United States|

[!INCLUDE [Azure Prepayment](../../includes/azure-prepayment.md)]



## Find information about other countries/regions

[!INCLUDE [Country Dropdown](../../includes/country-dropdown.md)]

## Next steps

For more information about Azure Communication Services' telephony options, see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
