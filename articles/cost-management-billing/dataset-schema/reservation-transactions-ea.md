---
title: Enterprise Agreement reservation transactions file schema
description: Learn about the data fields available in the Enterprise Agreement reservation transactions file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Enterprise Agreement reservation transactions file schema

This article lists all of the data fields available in the Enterprise Agreement reservation transactions file. The reservation transaction file is a data file that contains all of the reservation transactions for the Azure reservations that you bought.

## Version 2023-05-01

| Column |Fields|Description|
|---|------|------|
| 1 |AccountName|The name of the account that made the transaction.|
| 2 |AccountOwnerEmail|The email address of the account owner that made the transaction.|
| 3 |Amount|The charge of the transaction.|
| 4 |ArmSkuName|The Azure Resource Manager SKU name. It can be used to join with the `serviceType` field in `additionalinfo` in usage records.|
| 5 |BillingFrequency|The billing frequency, which can be either one-time or recurring.|
| 6 |BillingMonth|The billing month (yyyyMMdd), when the event initiated.|
| 7 |CostCenter|The cost center of this department if it's a department and a cost center is provided.|
| 8 |Currency|The ISO currency in which the transaction is charged, for example, USD.|
| 9 |CurrentEnrollmentId|The current enrollment.|
| 10 |DepartmentName|The department name.|
| 11 |Description|The description of the transaction.|
| 12 |EventDate|The date of the transaction.|
| 13 |EventType|The type of the transaction (`Purchase`, `Cancel`, or `Refund`).|
| 14 |MonetaryCommitment|The Azure prepayment, previously called monetary commitment, amount at the enrollment scope.|
| 15 |Overage|The overage amount at the enrollment scope.|
| 16 |PurchasingSubscriptionGuid|The subscription GUID that made the transaction.|
| 17 |PurchasingSubscriptionName|The subscription name that made the transaction.|
| 18 |PurchasingEnrollment|The purchasing enrollment.|
| 19 |Quantity|The quantity of the transaction.|
| 20 |Region|The region of the transaction.|
| 21 |ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
| 22 |ReservationOrderName|The name of the reservation order.|
| 23 |Term|The term of the transaction.|
