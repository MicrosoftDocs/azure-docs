---
title: Microsoft Customer Agreement price sheet schema
description: Learn about the data fields available in the Microsoft Customer Agreement price sheet.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/26/2024
ms.author: banders
---

# Microsoft Customer Agreement price sheet schema

This article lists all of the data fields available in the Microsoft Customer Agreement price sheet. Its a data file that contains all of the prices for your Azure services.

## Version 2023-05-01

Heres the list of all of the data fields found in your price sheet.

| Column |Fields|Description|
|---|------|------|
| 1 |BillingAccountId|Unique identifier for the root billing account.|
| 2 |BillingAccountName|Name of the billing account.|
| 3 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 4 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 5 |ServiceFamily|Service family that the service belongs to.|
| 6 |Product|Name of the product.|
| 7 |ProductId|Unique identifier for the product.|
| 8 |SkuId|MISSING|
| 9 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 10 |MeterId|The unique identifier for the meter.|
| 11 |MeterName|The name of the meter.|
| 12 |MeterType|MISSING.|
| 13 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 14 |MeterSubCategory|Name of the meter subclassification category.|
| 15 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 16 |TierMinimumUnits|MISSING.|
| 17 |EffectiveStartDate|MISSING.|
| 18 |EffectiveEndDate|MISSING.|
| 19 |UnitPrice|The price per unit for the charge.|
| 20 |BasePrice|MISSING.|
| 21 |MarketPrice|MISSING.|
| 22 |Currency|See `BillingCurrency`.|
| 23 |BillingCurrency|Currency associated with the billing account.|
| 24 |Term|Displays the term for the validity of the offer. For example, for reserved instances, it displays 12 months as the `Term`. For one-time purchases or recurring purchases, the `Term` is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 25 |PriceType|MISSING.|
