---
title: Country/regional availability of telephone numbers and subscription eligibility
titleSuffix: An Azure Communication Services concept document
description: Learn about Country/Regional Availability, Subscription Eligibility and Number Capabilities for PSTN and SMS Numbers in Communication Services.
author: krkutser
manager: rcole
services: azure-communication-services

ms.author: krkutser
ms.date: 03/04/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Country/regional availability of telephone numbers and subscription eligibility

Numbers can be purchased on eligible Azure subscriptions and in geographies where Communication Services is legally eligible to provide them.

## Subscription eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

More details on eligible subscription types are as follows:

| Number Type                      | Eligible Azure Agreement Type                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| Toll-Free and Local (Geographic) | Modern Customer Agreement (Field and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement*, Pay-As-You-Go |
| Short-Codes                      | Modern Customer Agreement (Field Led), Enterprise Agreement**, Pay-As-You-Go                                      |
| Alphanumeric Sender ID            | Modern Customer Agreement (Field Led and Customer Led), Modern Partner Agreement (CSP), Enterprise Agreement**, Pay-As-You-Go                                      |

\* In some countries/regions, number purchases are only allowed for own use. Reselling or suballcoating to another parties is not allowed. Due to this, purchases for CSP and LSP customers is not allowed.

\** Applications from all other subscription types will be reviewed and approved on a case-by-case basis. Create a support ticket or reach out to acstns@microsoft.com for assistance with your application.

## Number capabilities and availability

The capabilities and numbers that are available to you depend on the country/region that you're operating within, your use case, and the phone number type that you've selected. These capabilities vary by country/region due to regulatory requirements.

The following tables summarize current availability:

## Customers with Australia Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
|  Australia, Germany, Netherlands, United Kingdom, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \* | Public Preview      | -        | -  | - |

\* Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Austria Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Austria           | Toll-Free** | -        | -        | Public Preview | Public Preview\* |
| Austria           | Local**    | -        | -        | Public Preview | Public Preview\* |
|  Austria, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \***  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Austria can only be purchased for own use. Reselling or suballocating to another party is not allowed.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Belgium Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Belgium           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Belgium           | Local     | -        | -        | Public Preview | Public Preview\* |

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
|  Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

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
| Italy   | Toll-Free** | - | - | General Availability | General Availability\* |
| Italy   | Local**     | - | - | General Availability | General Availability\* |
| Sweden            | Toll-Free | -        | -        | General Availability | General Availability\* |
| Sweden            | Local     | -        | -        | General Availability | General Availability\* |
| Ireland           | Toll-Free | -        | -        | General Availability       | General Availability\* |
| Ireland           | Local     | -        | -        | General Availability       | General Availability\* |
| Denmark, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

## Customers with Estonia Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Estonia, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia              | Alphanumeric Sender ID  \* | Public Preview      | -        | -  | - |

\* Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with France Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| France            | Local**     | -        | -        | Public Preview | Public Preview\* |
| France           | Toll-Free**     | -        | -        | Public Preview | Public Preview\* |
| Norway           | Local**     | -        | -        | Public Preview | Public Preview\* |
| Norway           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
|  France, Germany, Netherlands, United Kingdom, Australia, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \***  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in France can only be purchased for own use. Reselling or suballocating to another party is not allowed.

\*** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Germany Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Germany           | Local     | -        | -        | Public Preview | Public Preview\* |
| Germany           | Toll-Free     | -        | -        | Public Preview | Public Preview\* |
|  Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Alphanumeric sender ID in Netherlands can only be purchased for own use. Reselling or suballocating to another party is not allowed. Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

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
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
| Italy   | Toll-Free** | - | - | General Availability | General Availability\* |
| Italy   | Local**     | - | - | General Availability | General Availability\* |
| Sweden            | Toll-Free | -        | -        | General Availability | General Availability\* |
| Sweden            | Local     | -        | -        | General Availability | General Availability\* |
|  Ireland, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

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
| Sweden            | Toll-Free | -        | -        | General Availability | General Availability\* |
| Sweden            | Local     | -        | -        | General Availability | General Availability\* |
| Ireland           | Toll-Free | -        | -        | General Availability       | General Availability\* |
| Ireland           | Local     | -        | -        | General Availability       | General Availability\* |
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
| France   | Local**     | - | - | Public Preview | Public Preview\* |
| France   | Toll-Free** | - | - | Public Preview | Public Preview\* |
| Italy, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \***  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers from Italy, France can only be purchased for own use. Reselling or suballocating to another party is not allowed.

\*** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Latvia Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
|  Latvia, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Estonia              | Alphanumeric Sender ID  \* | Public Preview      | -        | -  | - |

\* Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Lithuania Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
|  Lithuania, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Latvia, Estonia              | Alphanumeric Sender ID  \* | Public Preview      | -        | -  | - |

\* Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Luxembourg Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Luxembourg           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Luxembourg           | Local     | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Netherlands Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Netherlands           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Netherlands           | Local     | -        | -        | Public Preview | Public Preview\* |
| USA & Puerto Rico | Toll-Free   | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local       | -                    | -                    | General Availability | General Availability\* |
|  Netherlands, Germany, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Alphanumeric sender ID in Netherlands can only be purchased for own use. Reselling or suballocating to another party is not allowed. Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Norway Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Norway           | Local**     | -        | -        | Public Preview | Public Preview\* |
| Norway           | Toll-Free | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Norway can only be purchased for own use. Reselling or suballocating to another party is not allowed.

## Customers with Poland Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Poland, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \* | Public Preview      | -        | -  | - |

\* Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Portugal Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Portugal           | Toll-Free** | -        | -        | Public Preview | Public Preview\* |
| Portugal           | Local**     | -        | -        | Public Preview | Public Preview\* |
|  Portugal, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \***  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Phone numbers in Portugal can only be purchased for own use. Reselling or suballocating to another party is not allowed.

\*** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Slovakia Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Slovakia           | Local     | -        | -        | Public Preview | Public Preview\* |
| Slovakia           | Toll-Free | -        | -        | Public Preview | Public Preview\* |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

## Customers with Spain Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Spain           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Spain           | Local     | -        | -        | Public Preview | Public Preview\* |
|  Spain, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Sweden Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Sweden            | Toll-Free | -        | -        | General Availability | General Availability\* |
| Sweden            | Local     | -        | -        | General Availability | General Availability\* |
| Canada            | Toll-Free | General Availability | General Availability | General Availability  | General Availability\* |
| Canada            | Local     | -        | -        | General Availability       | General Availability\* |
| USA & Puerto Rico | Toll-Free | General Availability | General Availability | General Availability | General Availability\* |
| USA & Puerto Rico | Local     | -        | -        | General Availability | General Availability\* |
| Ireland           | Toll-Free | -        | -        | General Availability       | General Availability\* |
| Ireland           | Local     | -        | -        | General Availability       | General Availability\* |
| Denmark           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Denmark           | Local     | -        | -        | Public Preview | Public Preview\* |
| Italy   | Toll-Free** | - | - | General Availability | General Availability\* |
| Italy   | Local**     | - | - | General Availability | General Availability\* |
| Norway           | Local**     | -        | -        | Public Preview | Public Preview\* |
| Norway           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
|  Sweden, Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with Switzerland Azure billing addresses

| Number            | Type      | Send SMS             | Receive SMS          | Make Calls     | Receive Calls    |
| :---------------- | :-------- | :------------------- | :------------------- | :------------- | :--------------- |
| Switzerland           | Toll-Free | -        | -        | Public Preview | Public Preview\* |
| Switzerland           | Local     | -        | -        | Public Preview | Public Preview\* |
| Switzerland, Germany, Netherlands, United Kingdom, Australia, France, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia              | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |

\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

## Customers with United Kingdom Azure billing addresses

| Number             | Type           | Send SMS             | Receive SMS          | Make Calls       | Receive Calls    |
| :----------------- | :------------- | :------------------- | :------------------- | :--------------- | :--------------- |
| UK                 | Toll-Free      | -        | -        | General Availability   | General Availability\* |
| UK                 | Local          | -        | -        | General Availability   | General Availability\* |
| USA & Puerto Rico  | Toll-Free      | General Availability | General Availability | General Availability   | General Availability\* |
| USA & Puerto Rico  | Local          | -        | -        | General Availability   | General Availability\* |
| Canada             | Toll-Free      | General Availability       | General Availability       | General Availability   | General Availability\* |
| Canada             | Local          | -        | -        | General Availability   | General Availability\* |
| United Kingdom, Germany, Netherlands, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia            | Alphanumeric Sender ID  \**  | Public Preview      | -        | -  | - |


\* Please refer to [Inbound calling capabilities page](../telephony/inbound-calling-capabilities.md) for details.

\** Please refer to [SMS Concepts page](../sms/concepts.md) for supported destinations for this service.

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

## Next steps

For more information about Azure Communication Services' telephony options please see the following pages:

- [Learn more about Telephony](../telephony/telephony-concept.md)
- Get a Telephony capable [phone number](../../quickstarts/telephony/get-phone-number.md)
