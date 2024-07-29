---
title: Microsoft Customer Agreement reservation recommendations file schema
description: Learn about the data fields available in the Microsoft Customer Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Microsoft Customer Agreement reservation recommendations file schema

This article lists all of the data fields available in the Microsoft Customer Agreement reservation recommendations file. The reservation recommendations file is a data file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

## Version 2023-05-01

|Column|Fields|Description|
|---|------|------|
| 1 |Cost With No ReservedInstances|The total amount of cost without reserved instances.|
| 2 |First UsageDate|The usage date for looking back.|
| 3 |Instance Flexibility Ratio|The instance Flexibility Ratio.|
| 4 |Instance Flexibility Group|The instance Flexibility Group.|
| 5 |Location|Resource location.|
| 6 |LookBackPeriod|The number of days of usage to look back for recommendation.|
| 7 |MeterID|The meter ID (GUID).|
| 8 |Net Savings|Total estimated savings with reserved instances.|
| 9 |Normalized Size|The normalized Size.|
| 10 |Recommended Quantity|Recommended quantity for reserved instances.|
| 11 |Recommended Quantity Normalized|The recommended quantity that is normalized.|
| 12 |ResourceType|The Azure resource type.|
| 13 |scope|Shared or single recommendation.|
| 14 |SkuName|The Azure Resource Manager SKU name.|
| 15 |Sku Properties|List of SKU properties|
| 16 |SubscriptionId|  |
| 17 |Term|Reservation recommendations in one or three-year terms.|
| 18 |Total Cost With ReservedInstances|Cost of reservation recommendations in one or three-year terms.|
