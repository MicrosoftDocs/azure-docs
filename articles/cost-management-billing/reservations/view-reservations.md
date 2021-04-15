---
title: Permissions to view and manage reservations
description: Learn how to view and manage Azure reservations in the Azure portal.
author: yashesvi
ms.reviewer: yashar
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 04/15/2021
ms.author: banders
---

# View Azure reservations

This article explains how reservation permissions work and how users can view and manage Azure reservations in the Azure portal.

## Who can manage a reservation by default

By default, the following users can view and manage reservations:

1. The person who buys a reservation and the account administrator of the billing subscription used to buy the reservation are added to the reservation order.
1. Enterprise Agreement and Microsoft Customer Agreement billing administrators.

### How billing Administrators can view or manage reservations

If you are a billing administratos use following steps to view and manage all reservations and reservation transactions.

1. Sign into the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select Products + services>**Reservations**.
1. The complete list of reservations for your EA enrollment or billing profile is shown.
1. Billing administratos can take ownership of a reservation by clicking on it and selecting **Grant access** on screen that comes up.


### How to add billing administrators

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
1. For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all reservation orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage reservations in **Cost Management + Billing**. 
1. Users with the _Enterprise Administrator (read only)_ role can only view the reservation from **Cost Management + Billing**. 
1. Department admins and account owners can't view reservations _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).

        _Enterprise Administrators can take ownership of a reservation order and they can add other users to a reservation using Access control (IAM)._
1. For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations.
    For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Give users RBAC access to individual reservations

Delegate access management for an individual reservation order

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services** > **Reservation** to list reservations that you have access to.
1. Select the reservation that you want to delegate access to other users.
1. From Reservation details, click on the reservation order.
1. Select **Access control (IAM)**.
1. Select **Add role assignment** > **Role** > **Owner**. If you want to give limited access, select a different role.
1. Type the email address of the user you want to add as owner.
1. Select the user, and then select **Save**.


## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).

