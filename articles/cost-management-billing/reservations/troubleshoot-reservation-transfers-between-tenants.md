---
title: Change an Azure reservation directory
description: This article helps reservation owners transfer a reservation order from one Microsoft Entra tenant (directory) to another.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: banders
ms.reviewer: bshy
ms.topic: troubleshooting
ms.date: 11/17/2023
---

# Change an Azure reservation directory between tenants

This article helps reservation owners change a reservation order's directory from one Microsoft Entra tenant (directory) to another. When you change a reservation order's directory, it removes any Azure RBAC access to the reservation order and dependent reservations. Only you have access after the change. Changing the directory doesn't change billing ownership for the reservation order. The directory is changed for the parent reservation order and dependent reservations.

A reservation exchange and cancellation isn't needed to change a reservation order's directory.

After you change the directory of a reservation to another tenant, you might also want to add other owners to the reservation. For more information, see [Who can manage a reservation by default](view-reservations.md#who-can-manage-a-reservation-by-default).

When you change a reservation order's directory, all reservations under the order are transferred with it.

## Change a reservation order's directory

Use the following steps to change a reservation order's directory and its dependent reservations to another tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you're not a billing administrator but you're a reservation owner, navigate to **Reservations,** and then skip to step 5.
1. Navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. The complete list of reservations for your EA enrollment or billing profile is shown.
1. Select the reservation that you want to transfer.
1. In the reservation details, select the Reservation order ID.
1. In the reservation order, select **Change directory**.
1. In the Change directory pane, select the Microsoft Entra directory that you want to transfer the reservation to and then select **Confirm**.

## Update reservation scope

After the reservation moves the new tenant, you can change the reservation target scope to a *shared* or *management group scope*. For more information about changing the scope, see [Change the reservation scope](manage-reserved-vm-instance.md#change-the-reservation-scope). The following example explains how changing the scope might work.

Currently, a reservation covers subscriptions A1 and A2. The reservation scope is set to either a shared scope or a management group scope.

| Initial reservation location | Final reservation location |
| --- | ---|
| Tenant A | Tenant B |
| Subscription A-1 | Subscription B-1 |
| Subscription A-2 | Subscription B-2 |

Assume that the reservation is set to a shared scope. When subscriptions B1 and B2 are under the same billing profile (for MCA) or enrollment (for EA), then B1 and B2 already receive the reservation benefit. Changing the tenant doesn’t change the scope. In this situation, you don’t have to change the scope after you change the reservation tenant.

Assume that the reservation is set to a management group scope. After you change the reservation tenant, you need to change the reservation’s scope to a management group scope that targets subscriptions B1 and B2.

## Next steps

- For more information about reservations, see [What are Azure Reservations?](save-compute-costs-reservations.md).
