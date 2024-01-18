---
title: Enterprise Agreement reservation transactions file schema
description: Learn about the data fields available in the Enterprise Agreement reservation transactions file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Enterprise Agreement reservation transactions file schema

This article lists all of the data fields available in the Enterprise Agreement reservation transactions file. The reservation transaction file is a CSV file that contains all of the reservation transactions for the Azure reservations that you bought. The reservation transactions file is available for download in the Azure portal. You can also download the reservation transactions file by using the [X API](LINK).

## Reservation transactions data fields

|Fields|Description|
|------|------|
|AccountName|The name of the account that makes the transaction.|
|AccountOwnerEmail|The email of the account owner that makes the transaction.|
|Amount|The charge of the transaction.|
|ArmSkuName|The Azure Resource Manager SKU name. It can be used to join with the `serviceType` field in `additionalinfo` in usage records.|
|BillingFrequency|The billing frequency, which can be either one-time or recurring.|
|BillingMonth|The billing month(yyyyMMdd), on which the event initiated.|
|CostCenter|The cost center of this department if it's a department and a cost center is provided.|
|Currency|The ISO currency in which the transaction is charged, for example, USD.|
|CurrentEnrollmentId|The current enrollment.|
|DepartmentName|The department name.|
|Description|The description of the transaction.|
|EventDate|The date of the transaction.|
|EventType|The type of the transaction (`Purchase`, `Cancel`, or `Refund`).|
|MonetaryCommitment|The monetary commitment amount at the enrollment scope.|
|Overage|The overage amount at the enrollment scope.|
|PurchasingSubscriptionGuid|The subscription guid that makes the transaction.|
|PurchasingSubscriptionName|The subscription name that makes the transaction.|
|PurchasingEnrollment|The purchasing enrollment.|
|Quantity|The quantity of the transaction.|
|Region|The region of the transaction.|
|ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
|ReservationOrderName|The name of the reservation order.|
|Term|The term of the transaction.|
