---
title: Microsoft Customer Agreement reservation transactions file schema
description: Learn about the data fields available in the Microsoft Customer Agreement reservation transactions file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Microsoft Customer Agreement reservation transactions file schema

This article lists all of the data fields available in the Microsoft Customer Agreement reservation transactions file. The reservation transaction file is a data file that contains all of the reservation transactions for the Azure reservations that you bought.

## Version 2023-05-01

|Column|Fields|Description|
|---|------|------|
| 1 |Amount|The charge of the transaction.|
| 2 |ArmSkuName|The Azure Resource Manager SKU name. It can be used to join with the `serviceType` field in `additionalinfo` in usage records.|
| 3 |BillingFrequency|The billing frequency, which can be either one-time or recurring.|
| 4 |BillingProfileId|Billing profile ID.|
| 5 |BillingProfileName|Billing profile name.|
| 6 |Currency|The ISO currency in which the transaction is charged, for example, USD.|
| 7 |Description|The description of the transaction.|
| 8 |EventDate|The date of the transaction.|
| 9 |EventType|The type of the transaction (`Purchase`, `Cancel`, or `Refund`).|
| 10 |Invoice|Invoice Number.|
| 11 |InvoiceId|Invoice ID as on the invoice where the specific transaction appears.|
| 12 |InvoiceSectionId|Invoice Section ID.|
| 13 |InvoiceSectionName|Invoice Section Name.|
| 14 |PurchasingSubscriptionGuid|The subscription GUID that made the transaction.|
| 15 |PurchasingSubscriptionName|The subscription name that made the transaction.|
| 16 |Quantity|The quantity of the transaction.|
| 17 |Region|The region of the transaction.|
| 18 |ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
| 19 |ReservationOrderName|The name of the reservation order.|
| 20 |Term|The term of the transaction.|