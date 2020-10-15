---
title: Troubleshoot no eligible subscriptions
description: This article helps you troubleshoot the No eligible subscriptions error message in the Azure portal when you try to purchase a reservation.
author: banders
ms.author: bandersmsft
ms.reviewer: yashar
ms.topic: troubleshooting
ms.date: 10/14/2020
---

# Troubleshoot no eligible subscriptions

This article helps you troubleshoot the *No eligible subscriptions* error message in the Azure portal when you try to purchase a reservation.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Reservations**.
1. Select **Add** and then select a service.
1. You see the following error message:
   ```
    No eligible subscriptions
    
    You do not have any eligible subscriptions to purchase reservations. To purchase a reservation, you should be an owner on at least one subscription of the following type: Pay-as-you-go, CSP, Microsoft Enterprise or Microsoft Customer Agreement.
    ```
1. In the **Select the product you want to purchase** area, expand the **Billing subscription** list to see the reason why a specific subscription isn't eligible to purchase a reserved instance. The following image shows examples why a reservation can't be purchased.  
    :::image type="content" source="./media/troubleshoot-no-eligible-subscriptions/select-product-to-purchase.png" alt-text="Example showing why a reservation can't be purchased" :::

## Cause

To buy an Azure reserved instance, you must have at least one subscription that meets the following requirements:

- The subscription must be a supported offer type. Supported offer types are: Pay-as-you-go, Cloud Solution Provider (CSP), Microsoft Azure Enterprise, or Microsoft Customer Agreement.
- You must be an owner of the subscription.

When you don't have a subscription that meets the requirements, you'll get the `No eligible subscriptions` error.

### Cause 1

The subscription must be a supported offer type. Supported offer types are: Pay-as-you-go, CSP, Microsoft Azure Enterprise, or Microsoft Customer Agreement. Your subscription type isn't one that's supported. When you select a subscription that has an offer type that doesn't support reservations, you see the following error.

```
Subscription not eligible for purchase

This subscription is not eligible for reservation benefit an cannot be used to purchase a reservation.
```

:::image type="content" source="./media/troubleshoot-no-eligible-subscriptions/subscription-not-eligible.png" alt-text="Example showing the Subscription not eligible for purchase error message" :::

### Cause 2

You must be an owner of the subscription. You're not an owner of the subscription. When you select a subscription that you're not an owner of, you see the following error.

```
You do not have owner access on the subscription

You can only purchase reservations using subscriptions on which you have owner access.
```

:::image type="content" source="./media/troubleshoot-no-eligible-subscriptions/no-owner-access.png" alt-text="Example showing the You do not have owner access on the subscription error message" :::

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

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services** > **Reservation** to list reservations that you have access to.
1. Select the reservation that you want to delegate access to other users.
1. Select **Access control (IAM)**.
1. Select **Add role assignment** > **Role** > **Owner**. Or, if you want to give limited access, select a different role.
1. Type the email address of the user you want to add as owner.
1. Select the user, and then select **Save**.

For more information, see [Add or change users who can manage a reservation](manage-reserved-vm-instance.md#add-or-change-users-who-can-manage-a-reservation).