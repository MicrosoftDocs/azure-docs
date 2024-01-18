---
title: Enterprise Agreement reservation details file schema
description: Learn about the data fields available in the Enterprise Agreement reservation details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Enterprise Agreement reservation details file schema

This article lists all of the data fields available in the Enterprise Agreement reservation details file. The reservation details file is a CSV file that contains all of the reservation details for the Azure services that were used and were unused. The reservation details file is available for download in the Azure portal. You can also download the reservation details file by using the [X API](LINK).

## Reservation details data fields

|Fields|Description|
|------|------|
|InstanceFlexibilityGroup|The instance Flexibility Group.|
|InstanceFlexibilityRatio|The instance Flexibility Ratio.|
|InstanceId|This identifier is the name of the resource or the fully qualified Resource ID.|
|Kind|The reservation kind.|
|ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
|ReservationId|The reservation ID is the identifier of a reservation within a reservation order. Each reservation is the grouping for applying the benefit scope. It also specifies the number of instances where the reservation benefit can be applied.|
|ReservedHours|The total hours reserved for the day. For example, if a reservation for one instance was made at 1:00 PM, the value is 11 hours for that day and 24 hours on subsequent days.|
|RIUsedHours|The total hours used by the instance.|
|SkuName|The Azure Resource Manager SKU name. It can be used to join with the serviceType field in `additional info` in usage records.|
|TotalReservedQuantity|The total count of instances that are reserved for the reservationId.|
|UsageDate|The date when consumption occurred.|
|UsedHours|The total hours used by the instance.|
