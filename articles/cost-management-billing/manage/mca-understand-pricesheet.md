---
title: Terms in your Microsoft Customer Agreement price sheet - Azure
description: Learn how to read and understand your usage and bill for a Microsoft Customer Agreement.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 12/08/2023
ms.author: banders
ms.reviewer: paagraw
---

# Terms in your Microsoft Customer Agreement price sheet

This article applies to an Azure billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

If you're a billing profile Owner, Contributor, Reader, or Invoice Manager you can download your organization's price sheet from the Azure portal. See [View and download your organization's pricing](ea-pricing.md).

## Terms and descriptions in your price sheet

The following section describes the important terms shown in your Microsoft Customer Agreement price sheet.

| **Field Name**   | **Description**   |
| --- | --- |
| basePrice  | The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. |
| billingAccountId  | Unique identifier for the billing account.   |
| billingAccountName  | Name of the billing account.  |
| billingCurrency | Currency in which charges are posted |
| billingProfileId  | Unique identifier for the billing profile.   |
| billingProfileName  | Name of the billing profile that is set up to receive invoices. The prices in the price sheet are associated with this billing profile. |
| currency | Currency in which all the prices are reflected. |
| discount | The price discount offered for Graduation Tier, Free Tier, Included Quantity, or Negotiated discounts when applicable. Represented as a percentage. Not available in the updated version of the price sheet. |
| effectiveEndDate  | End date of the price sheet billing period. |
| effectiveStartDate  | Start date of the price sheet billing period. |
| includedQuantity | Quantities of a specific service to which a customer is entitled to consume without incremental charges. Not available in the updated version of the price sheet. |
| marketPrice | The current list price for a given product or service. The price is without any negotiations and is based on your Microsoft Agreement type. For `PriceType` _Consumption_, marketPrice is reflected as the pay-as-you-go price. For `PriceType`  _Savings Plan_, market price reflects the Savings plan benefit on top of pay-as-you-go price for the corresponding commitment term. For `PriceType` _ReservedInstance_, marketPrice reflects the total price of the one or three-year commitment. |
| meterId  | Unique identifier for the meter. |
| meterCategory  | Name of the classification category for the meter. For example, _Cloud services_, and _Networking_ |
| meterName  | Name of the meter. The meter represents the deployable resource of an Azure service. |
| meterSubCategory  | Name of the meter subclassification category.  |
| meterType  |  Name of the meter type. |
| meterRegion  | Name of the region where the meter for the service is available. Identifies the location of the datacenter for certain services that are priced based on datacenter location.    |
| priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with `priceType` as *Consumption*. If the resource is eligible for a savings plan, it also has its savings plan rate with another `priceType` as *SavingsPlan*. Other `priceTypes` include *ReservedInstance*. |
| Product  | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB.  |
| productId  | Unique identifier for the product whose meter is consumed. |
| productOrderName  | Name of the purchased product plan. Not applicable for price sheets dated December 2022 and later.|
| serviceFamily  | Type of Azure service. For example, Compute, Analytics, and Security. |
| SkuID | Unique identifier of the SKU. |
| Term | Duration associated with `priceType`. For example, SavingsPlan priceType has two commitment options: one year and three years. The Term is *P1Y* for a one-year commitment and *P3Y* for a three-year commitment.  |
| tierMinimumUnits  | Defines the lower bound of the tier range for which prices are defined. For example, if the range is 0 to 100, tierMinimumUnits would be 0.  |
| unitOfMeasure  | Identifies the units of measure for billing for the service. For example, compute services are billed per hour. |
| unitPrice  | The per-unit price at the time of billing for a given product or service. It includes any negotiated discounts on top of the market price. For `PriceType` *ReservedInstance*, `unitPrice` reflects the total cost of the one or three-year commitment including discounts. **Note**: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers, where each tier has a specific unit price.|

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

- [View and download your organization's pricing](ea-pricing.md)
