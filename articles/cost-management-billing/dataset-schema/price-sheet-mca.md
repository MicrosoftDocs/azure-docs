---
title: Microsoft Customer Agreement (MCA) price sheet schema
description: Learn about the data fields available in the Microsoft Customer Agreement price sheet.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 06/26/2025
ms.author: vikdesai
---
# Microsoft Customer Agreement price sheet schema

Heres the list of all of the data fields found in your price sheet.

| **Column** | **Field Name** | **Description** |
| --- | --- | --- |
| 1   | basePrice | The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. |
| 2   | billingAccountId | Unique identifier for the billing account. |
| 3   | billingAccountName | Name of the billing account. |
| 4   | billingCurrency | Currency in which charges are posted. |
| 5   | billingProfileId | Unique identifier of the EA enrollment, pay-as-you-go subscription or MCA billing profile. |
| 6   | billingProfileName | Name of the billing profile that is set up to receive invoices. The prices in the price sheet are associated with this billing profile. |
| 7   | currency | Currency in which all the prices are reflected. |
| 8   | effectiveEndDate | End date of the price sheet billing period. |
| 9  | effectiveStartDate | Start date of the price sheet billing period. |
| 10  | marketPrice | The current list price for a given product or service. The price is without any negotiations and is based on your Microsoft Agreement type. For PriceType _Consumption_, marketPrice is reflected as the pay-as-you-go price. For PriceType _Savings Plan_, market price reflects the Savings plan benefit on top of pay-as-you-go price for the corresponding commitment term. For PriceType _ReservedInstance_, marketPrice reflects the total price of the one or three-year commitment. |
| 11  | meterId | Unique identifier for the meter. |
| 12  | meterCategory | Name of the classification category for the meter. For example, _Cloud services_, and _Networking_ |
| 13  | meterName | The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned. |
| 14  | meterSubCategory | Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned. |
| 15  | meterType | Name of the meter type. |
| 16  | meterRegion | The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated. |
| 17  | priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with priceType as _Consumption_. If the resource is eligible for a savings plan, it also has its savings plan rate with another priceType as _SavingsPlan_. Other priceTypes include _ReservedInstance_. |
| 18  | Product | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB. |
| 19  | productId | Unique identifier for the product. |
| 20  | productOrderName| Name of the purchased product plan. Indicates if this pricing is standard Azure Plan pricing, Dev/Test pricing etc. |
| 21  | serviceFamily |Service family that the service belongs to. |
| 22  | SkuId | Unique identifier of the SKU. |
| 23  | Term | Duration associated with priceType. For example, SavingsPlan priceType has two commitment options: one year and three years. The Term is _P1Y_ for a one-year commitment and _P3Y_ for a three-year commitment. |
| 24  | tierMinimumUnits | Defines the lower bound of the tier range for which prices are defined. For example, if the range is 0 to 100, tierMinimumUnits would be 0. |
| 25  | unitOfMeasure |The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 26  | unitPrice | The per-unit price at the time of billing for a given product or service. It includes any negotiated discounts on top of the market price. For PriceType _ReservedInstance_, unitPrice reflects the total cost of the one or three-year commitment including discounts. **Note**: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers, where each tier has a specific unit price. |

## Version 2023-05-01

Heres the list of all of the data fields found in your price sheet.

| **Column** | **Field Name** | **Description** |
| --- | --- | --- |
| 1   | basePrice | The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. |
| 2   | billingAccountId | Unique identifier for the billing account. |
| 3   | billingAccountName | Name of the billing account. |
| 4   | billingCurrency | Currency in which charges are posted. |
| 5   | billingProfileId | Unique identifier of the EA enrollment, pay-as-you-go subscription or MCA billing profile. |
| 6   | billingProfileName | Name of the billing profile that is set up to receive invoices. The prices in the price sheet are associated with this billing profile. |
| 7   | currency | Currency in which all the prices are reflected. |
| 8   | discount | The price discount offered for Graduation Tier, Free Tier, Included Quantity, or Negotiated discounts when applicable. Represented as a percentage. Not available in the updated version of the price sheet. |
| 9   | effectiveEndDate | End date of the price sheet billing period. |
| 10  | effectiveStartDate | Start date of the price sheet billing period. |
| 11  | includedQuantity | Quantities of a specific service to which a customer is entitled to consume without incremental charges. Not available in the updated version of the price sheet. |
| 12  | marketPrice | The current list price for a given product or service. The price is without any negotiations and is based on your Microsoft Agreement type. For PriceType _Consumption_, marketPrice is reflected as the pay-as-you-go price. For PriceType _Savings Plan_, market price reflects the Savings plan benefit on top of pay-as-you-go price for the corresponding commitment term. For PriceType _ReservedInstance_, marketPrice reflects the total price of the one or three-year commitment. |
| 13  | meterId | Unique identifier for the meter. |
| 14  | meterCategory | Name of the classification category for the meter. For example, _Cloud services_, and _Networking_ |
| 15  | meterName | The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned. |
| 16  | meterSubCategory | Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned. |
| 17  | meterType | Name of the meter type. |
| 18  | meterRegion | The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated. |
| 19  | priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with priceType as _Consumption_. If the resource is eligible for a savings plan, it also has its savings plan rate with another priceType as _SavingsPlan_. Other priceTypes include _ReservedInstance_. |
| 20  | Product | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB. |
| 21  | productId | Unique identifier for the product. |
| 22  | serviceFamily |Service family that the service belongs to. |
| 23  | SkuId | Unique identifier of the SKU. |
| 24  | Term | Duration associated with priceType. For example, SavingsPlan priceType has two commitment options: one year and three years. The Term is _P1Y_ for a one-year commitment and _P3Y_ for a three-year commitment. |
| 25  | tierMinimumUnits | Defines the lower bound of the tier range for which prices are defined. For example, if the range is 0 to 100, tierMinimumUnits would be 0. |
| 26  | unitOfMeasure |The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 27  | unitPrice | The per-unit price at the time of billing for a given product or service. It includes any negotiated discounts on top of the market price. For PriceType _ReservedInstance_, unitPrice reflects the total cost of the one or three-year commitment including discounts. **Note**: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers, where each tier has a specific unit price. |
