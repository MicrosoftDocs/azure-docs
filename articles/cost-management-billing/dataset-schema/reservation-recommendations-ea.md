---
title: Enterprise Agreement reservation recommendations file schema
description: Learn about the data fields available in the Enterprise Agreement reservation recommendations file.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 06/26/2025
ms.author: vikdesai
---

# Enterprise Agreement reservation recommendations file schema

This article lists all of the data fields available in the Enterprise Agreement reservation recommendations file. The reservation recommendations file is a data file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

## Version 2023-05-01

| Column |Fields|Description|
|---|------|------|
| 1 |SKU|The recommended SKU.|
| 2 |Location|The location (region) of the resource.|
| 3 |CostWithNoReservedInstances|The total amount of cost without reserved instances.|
| 4 |FirstUsageDate|The usage date for looking back.|
| 5 |InstanceFlexibilityRatio|The instance Flexibility Ratio.|
| 6 |InstanceFlexibilityGroup|The instance Flexibility Group.|
| 7 |LookBackPeriod|The number of days of usage to look back for recommendation.|
| 8 |MeterId|The unique identifier for the meter.|
| 9 |NetSavings|Total estimated savings with reserved instances.|
| 10 |NormalizedSize|The normalized Size.|
| 11 |RecommendedQuantity|Recommended quantity for reserved instances.|
| 12 |RecommendedQuantityNormalized|The normalized recommended quantity.|
| 13 |ResourceType|Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 14 |Scope|Shared or single recommendation.|
| 15 |SubscriptionId|Unique identifier for the Azure subscription. The field will be shown only for 'single' scoped requests and will be empty if the scope is 'shared', as recommendations will be returned at the billing account scope. |
| 16 |SkuProperties|List of SKU properties.|
| 17 |Term|Reservation recommendations in one or three-year terms.|
| 18 |TotalCostWithReservedInstances|The total amount of cost with reserved instances.|
