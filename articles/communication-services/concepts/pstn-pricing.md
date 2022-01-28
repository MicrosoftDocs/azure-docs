---
title: Pricing for PSTN
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services' SMS Pricing Model.
author: prakulka
ms.author: prakulka
ms.date: 11/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
zone_pivot_groups: acs-pstn-phonenumbers
---
# PSTN Pricing

> [!IMPORTANT]
> Number Retention and Portability: Phone numbers that are assigned to you during any preview program will be returned to Microsoft at the end of the preview program unless otherwise agreed by Microsoft.  During private preview and public preview, telephone numbers are not eligible for porting. [Details on offers in Public Preview / GA](../concepts/numbers/sub-eligibility-number-capability.md)

Numbers are available for purchase on a per month basis, and pricing differs based on the type of a number and the source (country) of the number. Once a number is purchased, Customers can make / receive calls using that number and are billed on a per minute basis. PSTN call pricing is based on the location in which a call is terminated (destination).

In most cases, only customers with Azure subscriptions that match the offer location will be able to buy a number. Please see here for details on [in-country and cross-country purchases](../concepts/numbers/sub-eligibility-number-capability.md).

All prices shown below are in USD.

## United States Telephony Offers

### Phone Number Leasing Charges
|Number type   |Monthly fee   |
|--------------|-----------|
|Geographic     |USD 1.00/mo        |
|Toll-Free     |USD 2.00/mo        |

### Usage Charges
|Number type   |To make calls   |To receive calls|
|--------------|-----------|------------|
|Geographic     |Starting at USD 0.0130/min       |USD 0.0085/min        |
|Toll-free |Starting at USD 0.0130/min   | USD 0.0220/min |

For additional destinations, please refer to details [here](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)

## United Kingdom Telephony Offers

### Phone Number Leasing Charges
|Number type   |Monthly fee   |
|--------------|-----------|
|Geographic     |USD 1.00/mo        |
|Toll-Free     |USD 2.00/mo        |

### Usage Charges
|Number type   |To make calls   |To receive calls|
|--------------|-----------|------------|
|Geographic     |Starting at USD 0.0110/min       |USD 0.0090/min        |
|Toll-free |Starting at USD 0.0110/min   |Starting at USD 0.0290/min |

For additional destinations, please refer to details [here](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)

## Denmark Telephony Offers

### Phone Number Leasing Charges
|Number type   |Monthly fee   |
|--------------|-----------|
|Geographic     |USD 0.82/mo        |
|Toll-Free     |USD 25.00/mo        |

### Usage Charges
|Number type   |To make calls   |To receive calls|
|--------------|-----------|------------|
|Geographic     |Starting at USD 0.0100/min       |USD 0.0100/min        |
|Toll-free |Starting at USD 0.0190/min   |Starting at USD 0.0343/min |

For additional destinations, please refer to details [here](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv)

Note: Pricing is subject to change as pricing is market-based and depends on third-party suppliers of telephony services.

## Next steps

In this quickstart, you learned how PSTN Offers are priced for Azure Communication Services.

> [!div class="nextstepaction"]
> [Learn more about Telephony](../concepts/telephony/telephony-concept.md)

The following documents may be interesting to you:
- Get an Telephony capable [phone number](../quickstarts/telephony/get-phone-number.md)
- [Phone number types in Azure Communication Services](../concepts/telephony/plan-solution.md)
