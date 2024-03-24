---
title: Troubleshoot no eligible subscriptions in the Azure portal
description: This article helps you troubleshoot the No eligible subscriptions error message in the Azure portal when you try to purchase a reservation.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: banders
ms.reviewer: primittal
ms.topic: troubleshooting
ms.date: 03/21/2024
---

# Troubleshoot no eligible subscriptions

This article helps you troubleshoot the *No eligible subscriptions* error message in the Azure portal when you try to purchase a reservation.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Reservations**.
1. Select **Add** and then select a service.
1. You see the following error message:
   ```
    No eligible subscriptions
    
    You do not have any eligible subscriptions to purchase reservations. To purchase a reservation, you should have owner or reservation purchaser permission on at least one subscription of the following type: Pay-as-you-go, CSP, Microsoft Enterprise or Microsoft Customer Agreement.
    ```
1. In the **Select the product you want to purchase** area, expand the **Billing subscription** list to see the reason why a specific subscription isn't eligible to purchase a reserved instance. The following image shows examples why a reservation can't be purchased.  
    :::image type="content" source="./media/troubleshoot-no-eligible-subscriptions/select-product-to-purchase.png" alt-text="Screenshot showing why a reservation can't be purchased." lightbox="./media/troubleshoot-no-eligible-subscriptions/select-product-to-purchase.png" :::

## Cause

To buy an Azure reserved instance, you must have at least one subscription that meets the following requirements:

- The subscription must be a supported offer type. Supported offer types are: Pay-as-you-go, Cloud Solution Provider (CSP), Microsoft Azure Enterprise, or Microsoft Customer Agreement.
- You must be an owner or reservation purchaser on the subscription.

When you don't have a subscription that meets the requirements, you'll get the `No eligible subscriptions` error.

### Cause 1

The subscription must be a supported offer type. Supported offer types are: Pay-as-you-go, CSP, Microsoft Azure Enterprise, or Microsoft Customer Agreement. Your subscription type isn't one that's supported. When you select a subscription that has an offer type that doesn't support reservations, you see the following error.

```
Subscription not eligible for purchase

This subscription is not eligible for reservation benefit an cannot be used to purchase a reservation.
```

:::image type="content" source="./media/troubleshoot-no-eligible-subscriptions/subscription-not-eligible.png" alt-text="Screenshot showing the Subscription not eligible for purchase error message." :::

>[!NOTE]
> Reservations aren't supported by the China legacy Online Service Premium Agreement (OSPA) platform. For more information, see [Microsoft Azure operated by 21Vianet OSPA purchase](https://go.microsoft.com/fwlink/?linkid=2239835).

### Cause 2

You must be an owner or reservation purchaser on the subscription. When you don't have sufficient permissions, you see the following error.

```
You do not have owner or reservation purchaser access on the subscription

You can only purchase reservations using subscriptions on which you have owner or reservation purchaser access.
```

## Solution

- If your current offer doesn't support reservations, you need to create a new Azure subscription.
- If you don't have access to an existing reservation, you can get access to it from the current owner.

### Solution 1

To buy a reservation, you need to create a new Azure subscription that supports reservations.

- If you have an Azure Free trial, you can [upgrade your subscription](../manage/upgrade-azure-subscription.md).
- You can create a new Azure subscription with [pay-as-you-go rates](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/).
- Sign up for a [Microsoft Customer Agreement](https://azure.microsoft.com/pricing/purchase-options/microsoft-customer-agreement/) and create a new subscription.
- Purchase a new subscription with a [CSP](https://www.microsoft.com/solution-providers/home) and create a new subscription.

### Solution 2

To get owner access to a reservation, you must get access to either:

- The reservation order that the reservation was purchased with
- The reservation itself

The current reservation order owner or reservation owner can delegate access to you using the following steps.

To allow other people to manage reservations, you have two options:

- Delegate access management for an individual reservation order by assigning the Owner role to a user at the resource scope of the reservation order. If you want to give limited access, select a different role.  
     For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
    - For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all reservation orders that apply to the Enterprise Agreement. Users with the _Enterprise Administrator (read only)_ role can only view the reservation. Department admins and account owners can't view reservations _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).

        _Enterprise Administrators can take ownership of a reservation order and they can add other users to a reservation using Access control (IAM)._
    - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations.
    For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

For more information, see [Add or change users who can manage a reservation](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).

## Next steps

- Review [Add or change users who can manage a reservation](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default) if you need to have a reservation owner grant you access.
