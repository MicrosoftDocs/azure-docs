---
title: Enterprise Agreement price sheet schema
description: Learn about the data fields available in the Enterprise Agreement price sheet.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Enterprise Agreement price sheet schema

This article lists all of the data fields available in the Enterprise Agreement price sheet. The price sheet is your Customer Price Sheet (CPS). It's a CSV file that contains all of the prices for your Azure services. The price sheet is available for download in the Azure portal. You can also download the price sheet by using the [Azure Resource RateCard API](https://docs.microsoft.com/rest/api/cost-management/retail-prices/azure-retail-prices).

## Price sheet data fields

Heres the list of all of the data fields found in your price sheet.


|Fields|Description|
|------|------|
|EnrollmentNumber|The ID associated with the EA agreement for which the price sheet is being downloaded.|
|MeterID|Unique identifier of the meter.|
|MeterName|Name of the meter as it was set up initially. Used to identify each product.|
|MeterType|Meter type|
|MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|MeterSubCategory|Name of the subcategory the meter is under. For example, a meter in Storage might have two different subcategories for a flat namespace and a hierarchical namespace. In another example, a virtual machine series has multiple subcategories for Windows, Linux, and so on.|
|ServiceFamily|Service family that the service belongs to.|
|Product|Name of product.|
|SkuID|SKU ID of the product.|
|ProductID|MISSING.|
|MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|UnitOfMeasure|MISSING.|
|PartNumber|Identifier used to get specific meter pricing.|
|EffectiveStartDate|MISSING.|
|EffectiveEndDate|MISSING.|
|UnitPrice|The price per unit for the charge.|
|BasePrice| The unit price at the time the customer signs the agreement. Or, the unit price at the time that the service meter becomes generally available (GA) if GA is after the agreement is signed. The  field shows the baseline price for Azure products, third-party products, and reservation pricing.|
|MarketPrice|The current, prevailing market price for a given service. The field shows the list price for Azure products, third-party products, and reservation pricing. |
|CurrencyCode|Currency in which charges are posted. For Microsoft Customer Agreements, it's always USD.|
|IncludedQuantity|Quantities of a specific service where you're entitled to use without incremental charges.|
|OfferID|Offer ID associated with the meter.|
|Term|Displays the term for the validity of the offer. For example, for reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, the Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|PriceType|Currently supported values are `Consumption` and `Savings Plan`. <br><br>**Future Supported values: <br><br>·    Consumption <br><br>·    SavingsPlan <br><br>·    Reservation <br><br>·    Entitlement (Spot will not be supported in PS download experience)**|
