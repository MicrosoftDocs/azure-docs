---
title: Terms in your Microsoft Customer Agreement price sheet - Azure
description: Learn how to read and understand your usage and bill for a Microsoft Customer Agreement.
author: bandersmsft
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 02/03/2023
ms.author: banders
---

# Terms in your Microsoft Customer Agreement price sheet

This article applies to an Azure billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

If you're a billing profile Owner, Contributor, Reader, or Invoice Manager you can download your organization's price sheet from the Azure portal. See [View and download your organization's pricing](ea-pricing.md).

## Terms and descriptions in your price sheet

The following section describes the important terms shown in your Microsoft Customer Agreement price sheet.

| **Field Name**   | **Description**   |
| --- | --- |
| basePrice  | The market price at the time the customer signs on or the market price at the time the service meter launches if it is after sign-on.   |
| billingAccountId  | Unique identifier for the billing account.   |
| billingAccountName  | Name of the billing account.  |
| billingCurrency | Currency in which charges are posted |
| billingProfileId  | Unique identifier for the billing profile.   |
| billingProfileName  | Name of the billing profile that is set up to receive invoices. The prices in the price sheet are associated with this billing profile. |
| currency | Currency in which all the prices are reflected. |
| discount | The price discount offered for Graduation Tier, Free Tier, Included Quantity, or Negotiated discounts when applicable. Represented as a percentage. |
| effectiveEndDate  | End date of the effective price. |
| effectiveStartDate  | Start date when the price becomes effective. |
| includedQuantity | Quantities of a specific service to which a customer is entitled to consume without incremental charges. |
| marketPrice | The current, prevailing market price for a given service. |
| meterId  | Unique identifier for the meter. |
| meterCategory  | Name of the classification category for the meter. For example, _Cloud services_, _Networking_, etc. |
| meterName  | Name of the meter. The meter represents the deployable resource of an Azure service. |
| meterSubCategory  | Name of the meter subclassification category.  |
| meterType  |  Name of the meter type. |
| meterRegion  | Name of the region where the meter for the service is available. Identifies the location of the datacenter for certain services that are priced based on datacenter location.    |
| priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with priceType as *Consumption*. If the resource is eligible for a savings plan, it also has its savings plan rate with another priceType as *SavingsPlan*. |
| Product  | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB.  |
| productId  | Unique identifier for the product whose meter is consumed. |
| productOrderName  | Name of the purchased product plan. |
| serviceFamily  | Type of Azure service. For example, Compute, Analytics, and Security. |
| Term | Duration associated with `priceType`. For example, SavingsPlan priceType has two commitment options: one year and three years. The Term will be *P1Y* for a one-year commitment and *P3Y* for a three-year commitment.  |
| tierMinimumUnits  | Defines the lower bound of the tier range for which prices are defined. For example, if the range is 0 to 100, tierMinimumUnits would be 0.  |
| unitOfMeasure  | Identifies the units of measure for billing for the service. For example, compute services are billed per hour. |
| unitPrice  | Price per unit at the time of billing (not the effective blended price) as specific to a meter and product order name.  Note: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers (where each tier has a specific unit price). |

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your organization's pricing](ea-pricing.md)
