---
title: Understand the terms in your price sheet for a Microsoft Customer Agreement - Azure
description: Learn how to read and understand your usage and bill for a Microsoft Customer Agreement.
author: bandersmsft
manager: jureid
tags: billing
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/01/2019
ms.author: banders
---
# Terms in your Microsoft Customer Agreement price sheet

This article applies to an Azure billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

If you are a billing profile Owner, Contributor, Reader, or Invoice Manager you can download your organization's price sheet from the Azure portal. See [View and download your organization's pricing](billing-ea-pricing.md).

## Terms and descriptions in your price sheet

The following section describes the important terms shown in your Microsoft Customer Agreement price sheet.

| **Field Name**   | **Description**   |
| --- | --- |
| billingAccountId  | Unique identifier for the billing account.   |
| billingAccountName  | Name of the billing account.  |
| billingProfileId  | Unique identifier for the billing profile.   |
| billingProfileName  | Name of the billing profile that is set up to receive invoices. The prices in the price sheet are associated with this billing profile. |
| productOrderName  | Name of the purchased product plan. |
| serviceFamily  | Type of Azure service.Ex: Compute, Analytics, Security |
| Product  | Name of the product accruing the charges.Ex: Basic SQL DB vs Standard SQL DB  |
| productId  | Unique identifier for the product whose meter is consumed. |
| unitOfMeasure  | Identifies the units of measure for billing for the service. For example, compute services are billed per hour. |
| meterId  | Unique identifier for the meter. |
| meterName  | Name of the meter. The meter represents the deployable resource of an Azure service. |
| meterCategory  | Name of the classification category for the meter. For example, _Cloud services_, _Networking_, etc. |
| meterType  |  Name of the meter type. |
| meterSubCategory  | Name of the meter sub-classification category.  |
| meterRegion  | Name of the region where the meter for the service is available. Identifies the location of the datacenter for certain services that are priced based on datacenter location.    |
| tierId  | Identifies the pricing tier when applicable. This works in conjunction with tierMinimumUnits for setting tiered prices when prices vary based on the number of units consumed.    |
| tierMinimumUnits  | Defines the lower bound of the tier range for which prices are defined. For example, if the range is 0 to 100, tierMinimumUnits would be 0.  |
| effectiveStartDate  | Start date when the price becomes effective. |
| effectiveEndDate  | End date of the effective price. |
| unitPrice  | Price per unit at the time of billing (not the effective blended price) as specific to a meter and product order name.  Note: The unit price is not the same as the effective price in usage details downloads in case of services that have differential prices across tiers.  In case of services with multi-tiered pricing, the effective price is a blended rate across the tiers and does not show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers (where each tier has a specific unit price). |
| basePrice  | The market price at the time the customer signs on or the market price at the time the service meter launches if it is after sign-on.   |

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your organization's pricing](billing-ea-pricing.md)
