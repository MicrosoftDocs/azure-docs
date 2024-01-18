---
title: Microsoft Customer Agreement reservation recommendations file schema
description: Learn about the data fields available in the Microsoft Customer Agreement reservation recommendations file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Microsoft Customer Agreement reservation recommendations file schema

This article lists all of the data fields available in the Microsoft Customer Agreement reservation recommendations file. The reservation recommendations file is a CSV file that contains all of the reservation recommendation details for savings. The savings are calculated in addition to your negotiated, or discounted, if applicable, prices.

Azure reserved instance (RI) purchase recommendations are provided through the [Azure Consumption Reservation Recommendation API](https://learn.microsoft.com/en-us/rest/api/consumption/reservationrecommendations), [Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations#reserved-instances), and through the reservation purchase experience in the Azure portal.

## Microsoft Customer Agreement reservation recommendations data fields

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
