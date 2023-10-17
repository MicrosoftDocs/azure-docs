---
title: Terms in your Enterprise Agreement price sheet - Azure
description: Learn how to read and understand your usage and bill for an Enterprise Agreement.
author: bandersmsft
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 10/17/2023
ms.author: banders
ms.reviewer: paagraw
---

# Terms in your Enterprise Agreement price sheet

This article applies to an Azure billing account for an Enterprise Agreement (EA). [Check if you have access to Enterprise Agreement](#check-access-to-an-enterprise-agreement).

Depending on the policies set for your organization by the Enterprise Admin, only certain administrative roles provide access to your organization's EA pricing information. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

Starting January 2023 and later, a new version of the Azure Price Sheet is available for download. The new version features a new schema. It's a .ZIP file to support large amounts of data.

Azure reservation pricing is available in the Azure Price Sheet for the current billing period. If you want to maintain an ongoing record of Azure reservation pricing, we recommend that you download your Azure Price Sheet for each billing period.

## Terms and descriptions in your price sheet

The following section describes the terms shown in your Microsoft Enterprise Agreement price sheet.

| **Field Name** | **Description** |
| --- | --- |
| basePrice | The market price at the time the customer signs on or the market price at the time the service meter launches if it is after sign-on. |
| CurrencyCode | Currency in which the EA was signed. |
| effectiveEndDate | End date of the price sheet billing period. |
| effectiveStartDate | Start date of the price sheet billing period. |
| includedQuantity | Quantities of a specific service to which a customer is entitled to consume without incremental charges. |
| marketPrice | EA list price for this service. |
| meterId | Unique identifier for the meter. |
| meterCategory | Name of the classification category for the meter. For example, _Cloud services_, and _Networking_. |
| meterName | Name of the meter. The meter represents the deployable resource of an Azure service. |
| meterSubCategory | Name of the meter subclassification category. |
| meterType | Name of the meter type. |
| meterRegion | Name of the region where the meter for the service is available. Identifies the location of the datacenter for certain services that are priced based on datacenter location. |
| partNumber | Part number associated with the meter |
| priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with `priceType` as _Consumption_. If the resource is eligible for a savings plan, it also has its savings plan rate with another priceType as _SavingsPlan_. Other `priceTypes` include _ReservedInstance_. |
| Product | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB. |
| productId | Unique identifier for the product whose meter is consumed. |
| serviceFamily | Type of Azure service. For example, Compute, Analytics, and Security. |
| SkuId | Unique identifier for the SKU. |
| Term | Duration associated with priceType. For example, _SavingsPlan_ priceType has two commitment options: one year and three years. The term is _P1Y_ for a one-year commitment and _P3Y_ for a three-year commitment. |
| unitOfMeasure | Identifies the units of measure for billing for the service. For example, compute services are billed per hour. |
| unitPrice | Price per unit at the time of billing (not the effective blended price) as specific to a meter and product order name.<br><br> **Note**: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers (where each tier has a specific unit price). |

## Check access to an Enterprise Agreement

Use the following steps to check the agreement type to determine whether you have access to a billing account for an Enterprise Agreement.

1. Go to the Azure portal to check for billing account access. Search for and select **Cost Management + Billing**.  
    :::image type="content" source="./media/ea-understand-pricesheet/search-cost-management.png" alt-text="Screenshot showing search." lightbox="./media/ea-understand-pricesheet/search-cost-management.png" :::
1. If you have access to just one billing scope, select **Properties** from the menu. You have access to a billing account for an Enterprise Agreement if the billing account type is **Enterprise Agreement**.  
    :::image type="content" source="./media/ea-understand-pricesheet/enrollment-properties.png" alt-text="Screenshot showing the enrollment billing account properties." lightbox="./media/ea-understand-pricesheet/enrollment-properties.png" :::
1. If you have access to multiple billing scopes, check the type in the billing account column. You have access to a billing account for an Enterprise Agreement if the billing account type for any of the scopes is **Enterprise Agreement**.  
    :::image type="content" source="./media/ea-understand-pricesheet/select-billing-scope.png" alt-text="Screenshot showing billing scopes." lightbox="./media/ea-understand-pricesheet/select-billing-scope.png" :::

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your organization's pricing](ea-pricing.md)