---
title: Microsoft Customer Agreement price sheet schema
description: Learn about the data fields available in the Microsoft Customer Agreement price sheet.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Microsoft Customer Agreement price sheet schema

This article lists all of the data fields available in the Microsoft Customer Agreement price sheet. The price sheet is your Customer Price Sheet (CPS). Its a CSV file that contains all of the prices for your Azure services. The price sheet is available for download in the Azure portal. You can also download the price sheet by using the [Azure Resource RateCard API](https://docs.microsoft.com/rest/api/cost-management/retail-prices/azure-retail-prices).

## Price sheet data fields

Heres the list of all of the data fields found in your price sheet.

|Fields|Description|
|------|------|
|BillingAccountId|Unique identifier for the root billing account.|
|BillingAccountName|Name of the billing account.|
|BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|ServiceFamily|Service family that the service belongs to.|
|Product|Name of the product.|
|ProductId|Unique identifier for the product.|
|SkuId||
|UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|MeterId|The unique identifier for the meter.|
|MeterName|The name of the meter.|
|MeterType|MISSING.|
|MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|MeterSubCategory|Name of the meter subclassification category.|
|MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|TierMinimumUnits|MISSING.|
|EffectiveStartDate|MISSING.|
|EffectiveEndDate|MISSING.|
|UnitPrice|The price per unit for the charge.|
|BasePrice|MISSING.|
|MarketPrice|MISSING.|
|Currency|See `BillingCurrency`.|
|BillingCurrency|Currency associated with the billing account.|
|Term|Displays the term for the validity of the offer. For example, for reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, the Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|PriceType|MISSING.|
