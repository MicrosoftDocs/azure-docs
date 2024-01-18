---
title: Enterprise Agreement reservation recommendations file schema
description: Learn about the data fields available in the Enterprise Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Enterprise Agreement reservation recommendations file schema

This article lists all of the data fields available in the Enterprise Agreement reservation recommendations file. The reservation recommendations file is a CSV file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

Azure reserved instance (RI) purchase recommendations are provided through the [Azure Consumption Reservation Recommendation API](https://learn.microsoft.com/en-us/rest/api/consumption/reservationrecommendations), [Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations#reserved-instances), and through the reservation purchase experience in the Azure portal.

## Enterprise Agreement reservation recommendations data fields

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
