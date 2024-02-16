---
title: Microsoft Customer Agreement reservation recommendations file schema - version 2023-05-01
description: Learn about the data fields available in the Microsoft Customer Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 02/16/2024
ms.author: banders
---

# Microsoft Customer Agreement reservation recommendations file schema

This article lists all of the data fields available in the Microsoft Customer Agreement reservation recommendations file. The reservation recommendations file is a data file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

## Microsoft Customer Agreement reservation recommendations data fields

Version: 2023-05-01

|Fields|Description|
|------|------|
|Cost With No ReservedInstances|The total amount of cost without reserved instances.|
|First UsageDate|The usage date for looking back.|
|Instance Flexibility Ratio|The instance Flexibility Ratio.|
|Instance Flexibility Group|The instance Flexibility Group.|
|Location|Resource location.|
|LookBackPeriod|The number of days of usage to look back for recommendation.|
|MeterID|The meter ID (GUID).|
|Net Savings|Total estimated savings with reserved instances.|
|Normalized Size|The normalized Size.|
|Recommended Quantity|Recommended quantity for reserved instances.|
|Recommended Quantity Normalized|The recommended Quantity Normalized.|
|ResourceType|The Azure resource type.|
|scope|Shared or single recommendation.|
|SkuName|The Azure Resource Manager SKU name.|
|Sku Properties|List of SKU properties|
|SubscriptionId|MISSING.|
|Term|RI recommendations in one or three year terms.|
|Total Cost With ReservedInstances|RI recommendations in one or three year terms.|
