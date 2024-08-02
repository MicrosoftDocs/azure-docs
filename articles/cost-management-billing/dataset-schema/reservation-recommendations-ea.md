---
title: Enterprise Agreement reservation recommendations file schema
description: Learn about the data fields available in the Enterprise Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
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
| 8 |MeterId|The meter ID (GUID).|
| 9 |NetSavings|Total estimated savings with reserved instances.|
| 10 |NormalizedSize|The normalized Size.|
| 11 |RecommendedQuantity|Recommended quantity for reserved instances.|
| 12 |RecommendedQuantityNormalized|The normalized recommended quantity.|
| 13 |ResourceType|The Azure resource type.|
| 14 |Scope|Shared or single recommendation.|
| 15 |SubscriptionId|  |
| 16 |SkuProperties|List of SKU properties.|
| 17 |Term|Reservation recommendations in one or three-year terms.|
| 18 |TotalCostWithReservedInstances|The total amount of cost with reserved instances.|
