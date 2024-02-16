---
title: Enterprise Agreement reservation recommendations file schema - version 2023-05-01
description: Learn about the data fields available in the Enterprise Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 02/16/2024
ms.author: banders
---

# Enterprise Agreement reservation recommendations file schema

This article lists all of the data fields available in the Enterprise Agreement reservation recommendations file. The reservation recommendations file is a data file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

## Enterprise Agreement reservation recommendations data fields

Version: 2023-05-01

|Fields|Description|
|------|------|
|SKU|The recommended SKU.|
|Location|The location (region) of the resource.|
|CostWithNoReservedInstances|The total amount of cost without reserved instances.|
|FirstUsageDate|The usage date for looking back.|
|InstanceFlexibilityRatio|The instance Flexibility Ratio.|
|InstanceFlexibilityGroup|The instance Flexibility Group.|
|LookBackPeriod|The number of days of usage to look back for recommendation.|
|MeterId|The meter ID (GUID).|
|NetSavings|Total estimated savings with reserved instances.|
|NormalizedSize|The normalized Size.|
|RecommendedQuantity|Recommended quantity for reserved instances.|
|RecommendedQuantityNormalized|The recommended Quantity Normalized.|
|ResourceType|The Azure resource type.|
|Scope|Shared or single recommendation.|
|SubscriptionId|MISSING.|
|SkuProperties|List of SKU properties.|
|Term|RI recommendations in one or three year terms.|
|TotalCostWithReservedInstances|The total amount of cost with reserved instances.|
