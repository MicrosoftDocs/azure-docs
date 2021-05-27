---
title: Change an Azure reservation directory
description: This article helps reservation owners transfer a reservation order from one Azure Active Directory tenant (directory) to another.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: banders
ms.reviewer: yashar
ms.topic: troubleshooting
ms.date: 04/27/2021
---

# Change an Azure reservation directory between tenants

This article helps reservation owners change a reservation order's directory from one Azure Active Directory tenant (directory) to another. When you change a reservation order's directory, it removes any Azure RBAC access to the reservation order and dependent reservations. Only you will have access after the change. Changing the directory doesn't change billing ownership for the reservation order. The directory is changed for the parent reservation order and dependent reservations.

A reservation exchange and cancellation isn't needed to change a reservation order's directory.

After you change the directory of a reservation to another tenant, you might also want to add additional owners to the reservation. For more information, see [Who can manage a reservation by default](view-reservations.md#who-can-manage-a-reservation-by-default).

When you change a reservation order's directory, all reservations under the order are transferred with it.

## Change a reservation order's directory

Use the following steps to change a reservation order's directory and it's dependent reservations to another tenant.

1. Sign into the [Azure portal](https://portal.azure.com).
1. If you're not a billing administrator but you are a reservation owner, navigate to **Reservations** and then skip to step 5.
1. Navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. The complete list of reservations for your EA enrollment or billing profile is shown.
1. Select the reservation that you want to transfer.
1. In the reservation details, select the Reservation order ID.
1. In the reservation order, select **Change directory**.
1. In the Change directory pane, select the Azure AD directory that you want to transfer the reservation to and then select **Confirm**.

## Next steps

- For more information about reservations, see [What are Azure Reservations?](save-compute-costs-reservations.md).