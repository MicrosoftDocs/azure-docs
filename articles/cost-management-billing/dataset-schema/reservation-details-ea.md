---
title: Enterprise Agreement reservation details file schema
description: Learn about the data fields available in the Enterprise Agreement reservation details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Enterprise Agreement reservation details file schema

This article lists all of the data fields available in the Enterprise Agreement reservation details file. The reservation details file is a data file that contains all of the reservation details for the Azure services that were used and were unused.

## Version 2023-03-01

| Column |Fields|Description|
|---|------|------|
| 1 |InstanceFlexibilityGroup|The instance Flexibility Group.|
| 2 |InstanceFlexibilityRatio|The instance Flexibility Ratio.|
| 3 |InstanceId|This identifier is the name of the resource or the fully qualified Resource ID.|
| 4 |Kind|The reservation kind.|
| 5 |ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
| 6 |ReservationId|The reservation ID is the identifier of a reservation within a reservation order. Each reservation is the grouping for applying the benefit scope. It also specifies the number of instances where the reservation benefit can be applied.|
| 7 |ReservedHours|The total hours reserved for the day. For example, if a reservation for one instance was made at 1:00 PM, the value is 11 hours for that day and 24 hours on subsequent days.|
| 8 |RIUsedHours|The total hours used by the instance.|
| 9 |SkuName|The Azure Resource Manager SKU name. It can be used to join with the `serviceType` field in `additional info` in usage records.|
| 10 |TotalReservedQuantity|The total count of instances that are reserved for the `reservationId`.|
| 11 |UsageDate|The date when consumption occurred.|
| 12 |UsedHours|The total hours used by the instance.|
