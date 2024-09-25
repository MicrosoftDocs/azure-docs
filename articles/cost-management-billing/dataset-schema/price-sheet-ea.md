---
title: Enterprise Agreement price sheet schema
description: Learn about the data fields available in the Enterprise Agreement price sheet.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Enterprise Agreement price sheet schema

This article lists all of the data fields available in the Enterprise Agreement (EA) price sheet. It's a data file that contains all of the prices for your Azure services.

## Version 2023-05-01

The latest EA price sheet includes prices for Azure Reserved Instances (RI) only for the current billing period. We recommend downloading an Azure Price Sheet for when entering a new billing period if you want to keep a record of past RI pricing.

Heres the list of all of the data fields found in your price sheet.

| **Column** | **Fields** | **Description** |
| --- | --- | --- |
| 1   | BasePrice | The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. |
| 2   | CurrencyCode | Currency in which the EA was signed. |
| 3   | EffectiveEndDate | Effective end date of the price sheet. |
| 4   | EffectiveStartDate | Effective start date of the price sheet. |
| 5   | IncludedQuantity | Quantities of a specific service to which a customer is entitled to consume without incremental charges. |
| 6   | MarketPrice | The current list price for a given product or service. The price is without any negotiations and is based on your Microsoft Agreement type. For PriceType _Consumption_, marketPrice is reflected as the pay-as-you-go price. For PriceType _Savings Plan_, market price reflects the Savings plan benefit on top of pay-as-you-go price for the corresponding commitment term. For PriceType _ReservedInstance_, marketPrice reflects the total price of the one or three-year commitment. For EA customers with no negotiations, MarketPrice might appear rounded to a different decimal precision than UnitPrice. |
| 7   | MeterId | Unique identifier for the meter. |
| 8   | MeterCategory | Name of the classification category for the meter. For example, _Cloud services_, and _Networking_. |
| 9   | MeterName | Name of the meter. The meter represents the deployable resource of an Azure service. |
| 10  | MeterSubCategory | Name of the meter subclassification category. |
| 11  | MeterRegion | Name of the region where the meter for the service is available. Identifies the location of the datacenter for certain services that are priced based on datacenter location. |
| 12  | MeterType | Name of the meter type. |
| 13  | PartNumber | Part number associated with the meter. |
| 14  | priceType | Price type for a product. For example, an Azure resource has its pay-as-you-go rate with priceType as _Consumption_. If the resource is eligible for a savings plan, it also has its savings plan rate with another priceType as _SavingsPlan_. Other priceTypes include _ReservedInstance_. |
| 15  | Product | Name of the product accruing the charges. For example, Basic SQL DB vs Standard SQL DB. |
| 16  | ProductID | Unique identifier for the product whose meter is consumed. |
| 17  | ServiceFamily | Type of Azure service. For example, Compute, Analytics, and Security. |
| 18  | SkuID | Unique identifier of the SKU. |
| 19  | Term | Duration associated with priceType. For example, _SavingsPlan_ priceType has two commitment options: one year and three years. The term is _P1Y_ for a one-year commitment and _P3Y_ for a three-year commitment. |
| 20  | UnitOfMeasure | Identifies the units of measure for billing for the service. For example, compute services are billed per hour. |
| 21  | UnitPrice | The per-unit price at the time of billing for a given product or service. It includes any negotiated discounts on top of the market price. For PriceType _ReservedInstance_, unitPrice reflects the total cost of the one or three-year commitment including discounts. **Note**: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers. If services have multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers, where each tier has a specific unit price. |