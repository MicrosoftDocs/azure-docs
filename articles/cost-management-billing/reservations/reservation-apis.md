---
title: APIs for Azure reservation automation
description: Learn about the Azure APIs that you can use to programmatically get reservation information.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2024
ms.author: banders
---

# APIs for Azure reservation automation

Use Azure APIs to programmatically get information for your organization about Azure service or software reservations.

## Find reservation plans to buy

Use the Reservation recommendation API to get recommendations on which reservations plan to buy based on your organization's usage. For more information, see [Reservation Recommendations](/rest/api/consumption/reservation-recommendations).

You can also analyze your resource usage by using the Consumption API Usage Detail. For more information, see [Usage Details - List For Billing Period By Billing Account](/rest/api/consumption/usagedetails/list#billingaccountusagedetailslistforbillingperiod-legacy). The Azure resources that you use consistently are usually the best candidate for a reservation.

## Buy a reservation

You can purchase Azure reservations and software plans programmatically by using REST APIs. To learn more, see [Reservation Order - Purchase API](/rest/api/reserved-vm-instances/reservationorder/purchase).

Here's a sample request to purchase by using the REST API:

```http
PUT https://management.azure.com/providers/Microsoft.Capacity/reservationOrders/<GUID>?api-version=2019-04-01
```

Request body:

```json
{
 "sku": {
    "name": "standard_D1"
  },
 "location": "westus",
 "properties": {
    "reservedResourceType": "VirtualMachines",
    "billingScopeId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
    "term": "P1Y",
    "quantity": "1",
    "displayName": "TestReservationOrder",
    "appliedScopes": null,
    "appliedScopeType": "Shared",
    "reservedResourceProperties": {
      "instanceFlexibility": "On"
    }
  }
}
```

You can also buy a reservation in the Azure portal. For more information, see the following articles:

Service plans:
- [Virtual machine](/azure/virtual-machines/prepay-reserved-vm-instances?toc=/azure/cost-management-billing/reservations/toc.json)
- [Azure Cosmos DB](/azure/cosmos-db/cosmos-db-reserved-capacity?toc=/azure/cost-management-billing/reservations/toc.json)
- [SQL Database](/azure/azure-sql/database/reserved-capacity-overview?toc=/azure/cost-management-billing/reservations/toc.json)

Software plans:
- [SUSE Linux software](/azure/virtual-machines/linux/prepay-suse-software-charges?toc=/azure/cost-management-billing/reservations/toc.json)

## Get reservations

If you're an Azure customer with an Enterprise Agreement (EA customer), you can get the reservations your organization bought by using the [Reservation Transactions - List](/rest/api/consumption/reservation-transactions/list). For other subscriptions, get the list of reservations you bought and have permissions to view by using the API [Reservation Order - List](/rest/api/reserved-vm-instances/reservationorder/list). By default, the account owner or person that bought the reservation has permissions to view the reservation.

## See reservation usage

If you're an EA customer, you can programmatically view how the reservations in your organization are being used. For more information, see
[Reservation Transactions - List](/rest/api/consumption/reservation-transactions/list). For other subscriptions, use the API [Reservations Summaries - List By Reservation Order And Reservation](/rest/api/consumption/reservationssummaries/listbyreservationorderandreservation).

If you find that your organization's reservations are being under-used:

- Make sure the virtual machines that your organization creates match the VM size that's on the reservation.
- Make sure instance size flexibility is on. For more information, see [Manage reservations - Change optimize setting for Reserved VM Instances](manage-reserved-vm-instance.md#change-optimize-setting-for-reserved-vm-instances).
- Change the scope of reservation to shared so that it applies more broadly. For more information, see [Manage reservations - Change the scope for a reservation](manage-reserved-vm-instance.md#change-the-reservation-scope).
- Exchange the unused quantity. For more information, see [Manage reservations](manage-reserved-vm-instance.md).

## Give access to reservations

Get the list of all reservations that a user has access to by using the [Reservation - Operation - List API](/rest/api/reserved-vm-instances/reservationorder/list). To give access to a reservation programmatically, see one of the following articles:

- [Add or remove Azure role assignments using the REST API](../../role-based-access-control/role-assignments-rest.md)
- [Add or remove Azure role assignments using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md)
- [Add or remove Azure role assignments using Azure CLI](../../role-based-access-control/role-assignments-cli.md)

## Split or merge reservation

After you buy more than one resource instance within a reservation, you may want to assign instances within that reservation to different subscriptions. You can change the reservation scope so that it applies to all subscriptions within the same billing context. But for cost management or budgeting purposes, you may want to keep the scope as "single subscription" and assign reservation instances to a specific subscription.

To split a reservation, use the API [Reservation - Split](/rest/api/reserved-vm-instances/reservation/split). You can also split a reservation by using PowerShell. For more information, see [Manage reservations - Split reservation into two reservations](manage-reserved-vm-instance.md#split-a-single-reservation-into-two-reservations).

To merge two reservations into one reservation, use the API [Reservation - Merge](/rest/api/reserved-vm-instances/reservation/merge).

## Change scope for a reservation

The scope of a reservation can be single subscription, single resource group or all subscriptions in your billing context. If you set the scope to single subscription or single resource group, the reservation is matched to running resources in the selected subscription. If you delete or move the subscription or the resource group, the reservation will not be utilized.  If you set the scope to shared, Azure matches the reservation to resources that run in all the subscriptions within the billing context. The billing context is dependent on the subscription you used to buy the reservation. You can select the scope at purchase or change it anytime after purchase. For more information, see [Manage Reservations - Change the scope](manage-reserved-vm-instance.md#change-the-reservation-scope).

To change the scope programmatically, use the API [Reservation - Update](/rest/api/reserved-vm-instances/reservation/update).

## Related content

- [What are reservations for Azure](save-compute-costs-reservations.md)
- [Understand how the VM reservation discount is applied](../manage/understand-vm-reservation-charges.md)
- [Understand how the SUSE Linux Enterprise software plan discount is applied](understand-suse-reservation-charges.md)
- [Understand how other reservation discounts are applied](understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)
- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
