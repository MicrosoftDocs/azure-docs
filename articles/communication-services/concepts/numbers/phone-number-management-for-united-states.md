---
title: Phone Number Management for United States
titleSuffix: An Azure Communication Services concept document
description: Learn about subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in United States.
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

## Number types and capabilities availability

| Number Type | Send SMS             | Receive SMS          | Make Calls           | Receive Calls          |
| :---------- | :------------------- | :------------------- | :------------------- | :--------------------- |
| Toll-Free   |General Availability  | General Availability | General Availability | General Availability\* |
| Local       | Public Preview       | Public Preview       | General Availability | General Availability\* |
| Short code       |General Availability                    |General Availability                    | - | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired by Azure free credits. Also, due to regulatory reasons phone number availability is dependent on your Azure subscription billing location.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement*, Pay-As-You-Go |
| Short-Codes                      | Modern Customer Agreement (Field Led), Enterprise Agreement**, Pay-As-You-Go                                      |

\** Applications from all other subscription types are reviewed and approved on a case-by-case basis. Reach out to acstns@microsoft.com for assistance with your application.

## Azure subscription billing locations where United States phone numbers are available for 10DLC SMS
| Country/Region |
| :---------- |
|Canada|
|United States|

## Azure subscription billing locations where United States phone numbers are available for calling
| Country/Region |
| :---------- |
|Australia|
|Canada|
|Denmark|
|France|
|Germany|
|Ireland|
|Italy|
|Japan|
|Netherlands|
|Puerto Rico|
|Spain|
|Sweden|
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
