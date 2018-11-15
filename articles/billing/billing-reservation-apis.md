---
title: Reservation APIs for Azure resources | Microsoft Docs
description: Learn about the Azure APIs that you can use to programmatically pull reservation information.
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashesvi
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/14/2018
ms.author: cwatson

---
# Reservation APIs for Azure resources

Use Azure APIs to programmatically get information for your organization about Azure service or software reservations.

## Identify reservation plans to buy

Use the Reservation recommendation API to get recommendations on which reservations plan to buy based on your organization's usage. For more information, see [Get reservation recommendations](../rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation.md).

You can also analyze your resource usage by using the Consumption API Usage Detail. For more information, see [Usage Details - List For Billing Period By Billing Account](../rest/api/consumption/usagedetails/listforbillingperiodbybillingaccount.md). The Azure resources that you use consistently are usually the best candidate for a reservation.

## Buy a reservation

You can't currently buy a reservation programmatically. To buy a reservation, see the following articles:

Service plans:
- [Virtual machine](../virtual-machines/windows/prepay-reserved-vm-instances.md?toc=/azure/billing/TOC.json)
-  [Cosmos DB](../cosmos-db/cosmos-db-reserved-capacity.md?toc=/azure/billing/TOC.json)
- [SQL Database](../sql-database/sql-database-reserved-capacity.md?toc=/azure/billing/TOC.json)

Software plans:
- [SUSE Linux software](../virtual-machines/linux/prepay-suse-software-charges.md?toc=/azure/billing/TOC.json)

## View reservations

If you're an Azure customer with an Enterprise Agreement (EA customer), you can view the reservations your organization bought by using the [Get Reserved Instance transaction charges API](../rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges.md).  

## See reservation usage

If you're an EA customer, you can programmatically view how the reservations in your organization are being used. For more information, see
[Get Reserved Instance usage for enterprise customers](../rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage.md). 

If you find that your organization's reservations are being under-used:

- Make sure the virtual machines that your organization creates match the VM size that's on the reservation.
- Make sure instance size flexibility is on. For more information, see [Manage reservations - Change optimize setting for Reserved VM Instances](billing-manage-reserved-vm-instance.md#change-optimize-setting-for-reserved-vm-instances).
- Change the scope of reservation to shared so that it applies more broadly. For more information, see [Manage reservations - Change the scope for a reservation](billing-manage-reserved-vm-instance.md#change-the-scope-for-a-reservation).
- Exchange the unused quantity. For more information, see [Manage reservations - Cancellations and exchanges](billing-manage-reserved-vm-instance.md#cancellations-and-exchanges).

## Give access to reservations

Get the list of all reservations that a user has access to by using the [Reservation - Operation - List API](../rest/api/reserved-vm-instances/reservationorder/list.md). To give access to a reservation, see one of the following articles:

- [Manage access using RBAC and the REST API](../role-based-access-control/role-assignments-res.md)
- [Manage access using RBAC and Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Manage access using RBAC and Azure CLI](../role-based-access-control/role-assignments-cli.md)

## Learn more

- [What are reservations for Azure](billing-save-compute-costs-reservations.md)
- [Understand how the VM reservation discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand how the SUSE Linux Enterprise software plan discount is applied](../billing/billing-understand-suse-reservation-charges.md)
- [Understand how other reservation discounts are applied](billing-understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](billing-reserved-instance-windows-software-costs.md)
