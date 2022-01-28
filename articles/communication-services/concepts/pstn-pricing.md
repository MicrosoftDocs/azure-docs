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
> Volume Licensing Customers: Notwithstanding the terms in the your volume licensing agreement, fixed pricing does not apply to Azure Communication Services ("ACS").  ACS pricing is market-based and depends on third-party suppliers of telco services.  The available pricing at the time of each purchase is subject to change at any time. You can refer to the Azure portal for pricing adjustments.
 
> [!IMPORTANT]
> Number Retention and Portability: Phone numbers that are assigned to you during any preview program must be returned to Microsoft at the end of the preview program unless otherwise agreed by Microsoft.  During private preview and public preview, telephone numbers are not eligible for porting.

Numbers are available for purchase on a per month basis, and pricing differs based on the type of a number and the source (country) of the number. Once a number is purchased, Customers can make / receive calls using that number and are billed on a per minute basis. PSTN call pricing is based on the location in which a call is terminated (destination).

::: zone pivot="pstntollfree"
[!INCLUDE [Toll-Free](./includes/pstn-tollfree-pricing.md)]
::: zone-end

::: zone pivot="pstngeographic"
[!INCLUDE [Geographic](./includes/sms-shortcode-pricing.md)]
::: zone-end

## Next steps

In this quickstart, you learned how PSTN Offers are priced for Azure Communication Services.

> [!div class="nextstepaction"]
> [Learn more about Telephony](../concepts/telephony/telephony-concept.md)

The following documents may be interesting to you:
- Get an Telephony capable [phone number](../quickstarts/telephony/get-phone-number.md)
- [Phone number types in Azure Communication Services](../concepts/telephony/plan-solution.md)
