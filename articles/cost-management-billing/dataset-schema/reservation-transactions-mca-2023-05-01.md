---
title: Microsoft Customer Agreement reservation transactions file schema - version 2023-05-01
description: Learn about the data fields available in the Microsoft Customer Agreement reservation transactions file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 02/16/2024
ms.author: banders
---

# Microsoft Customer Agreement reservation transactions file schema

This article lists all of the data fields available in the Microsoft Customer Agreement reservation transactions file. The reservation transaction file is a data file that contains all of the reservation transactions for the Azure reservations that you bought.

## Reservation transactions data fields

Version: 2023-05-01

|Fields|Description|
|------|------|
|Amount|The charge of the transaction.|
|ArmSkuName|The Azure Resource Manager SKU name. It can be used to join with the `serviceType` field in `additionalinfo` in usage records.|
|BillingFrequency|The billing frequency, which can be either one-time or recurring.|
|BillingProfileId|Billing profile ID.|
|BillingProfileName|Billing profile name.|
|Currency|The ISO currency in which the transaction is charged, for example, USD.|
|Description|The description of the transaction.|
|EventDate|The date of the transaction.|
|EventType|The type of the transaction (`Purchase`, `Cancel`, or `Refund`).|
|Invoice|Invoice Number.|
|InvoiceId|Invoice ID as on the invoice where the specific transaction appears.|
|InvoiceSectionId|Invoice Section ID.|
|InvoiceSectionName|Invoice Section Name.|
|PurchasingSubscriptionGuid|The subscription guid that makes the transaction.|
|PurchasingSubscriptionName|The subscription name that makes the transaction.|
|Quantity|The quantity of the transaction.|
|Region|The region of the transaction.|
|ReservationOrderId|The reservation order ID is the identifier for a reservation purchase. Each reservation order ID represents a single purchase transaction. A reservation order contains reservations. The reservation order specifies the VM size and region for the reservations.|
|ReservationOrderName|The name of the reservation order.|
|Term|The term of the transaction.|
