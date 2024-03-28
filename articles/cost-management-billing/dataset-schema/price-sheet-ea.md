---
title: Enterprise Agreement price sheet schema
description: Learn about the data fields available in the Enterprise Agreement price sheet.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/26/2024
ms.author: banders
---

# Enterprise Agreement price sheet schema

This article lists all of the data fields available in the Enterprise Agreement price sheet. It's a data file that contains all of the prices for your Azure services.

## Version 2023-05-01

Heres the list of all of the data fields found in your price sheet.

| Column | Fields | Description |
|---|------|------|
| 1 |EnrollmentNumber|The ID associated with the EA agreement for which the price sheet is being downloaded.|
| 2 |MeterID|Unique identifier of the meter.|
| 3 |MeterName|Name of the meter as it was set up initially. Used to identify each product.|
| 4 |MeterType|Meter type|
| 5  |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 6 |MeterSubCategory|Name of the subcategory the meter is under. For example, a meter in Storage might have two different subcategories for a flat namespace and a hierarchical namespace. In another example, a virtual machine series has multiple subcategories for Windows, Linux, and so on.|
| 7 |ServiceFamily|Service family that the service belongs to.|
| 8 |Product|Name of product.|
| 9 |SkuID|SKU ID of the product.|
| 10 |ProductID|MISSING.|
| 11 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 12 |UnitOfMeasure|MISSING.|
| 13 |PartNumber|Identifier used to get specific meter pricing.|
| 14 |EffectiveStartDate|MISSING.|
| 15 |EffectiveEndDate|MISSING.|
| 16 |UnitPrice|The price per unit for the charge.|
| 17 |BasePrice| The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. The  field shows the baseline price for Azure products, third-party products, and reservation pricing.|
| 18 |MarketPrice|The current, prevailing market price for a given service. The field shows the list price for Azure products, third-party products, and reservation pricing. The EA list price isn't available before January 2023. |
| 19 |CurrencyCode|Currency in which charges are posted. For Microsoft Customer Agreements, it's always USD.|
| 20 |IncludedQuantity|Quantities of a specific service where you're entitled to use without incremental charges.|
| 21 |OfferID|Offer ID associated with the meter.|
| 22 |Term|Displays the term for the validity of the offer. For example, for reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, the Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 23 |PriceType|Currently supported values are `Consumption` and `Savings Plan`. <br><br>Future Supported values: <br><br>· `Consumption`<br><br>· `SavingsPlan`<br><br>· `Reservation`<br><br>· `Entitlement` **(Spot will not be supported in PS download experience.)**|
