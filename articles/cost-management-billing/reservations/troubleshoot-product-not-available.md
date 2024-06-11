---
title: Troubleshoot Azure reservation type not available
description: This article helps you understand and troubleshoot reserved instances appearing as not available in the Azure portal.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: banders
ms.reviewer: primittal
ms.topic: troubleshooting
ms.date: 03/21/2024
---

# Troubleshoot reservation type not available

This article helps you understand and troubleshoot reserved instances appearing as not available in the Azure portal.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to **Reservations**.
2. Select **+ Add** and then select a product.
3. Select the **All Products** tab.
4. In the list of products select one. You might see one of the following messages:
    - `Product unavailable for the selected subscription or region. Contact support.`  
        :::image type="content" source="./media/troubleshoot-product-not-available/product-unavailable-message.png" alt-text="Screenshot showing the Product unavailable for the selected subscription or region message." lightbox="./media/troubleshoot-product-not-available/product-unavailable-message.png" :::
    - `The selected subscription does not have enough core quota remaining to purchase this product. Request quota increase`  
        :::image type="content" source="./media/troubleshoot-product-not-available/not-enough-core-quota-message.png" alt-text="Screenshot showing the not enough core quota message." lightbox="./media/troubleshoot-product-not-available/not-enough-core-quota-message.png" :::

## Cause

Some reservations aren't available for purchase because:

- Not every reserved instance product is available for purchase in every region
- Your subscription has a quota restriction

### Cause 1

Not all reserved instance products are available for purchase. Azure decides to allow or not allow some products based on the costs associated with providing the monetary discount to customers. In other cases, Azure doesn't offer some products dues to capacity conditions in specific datacenters. Additionally, some Azure product development groups might now allow certain products because they want to retire an older product.

In other cases, Azure puts capacity restrictions on various products based on the demand for those resources in some regions. For example, such a restriction might be made when the demand for a certain VM size runs out in a data center. In this example, Azure can't guarantee the capacity to customers that bought a reservation for that size in that region. Finally, there are some products that are unique for various reasons. Such products are only made available to a small, selected set of customers.

Since some reservations aren't available for purchase, why are they shown in the Azure portal? The answer is because users create support requests stating that they can't find the products that they want. The Azure Reservation development team determined that showing all products with the `Product unavailable` message results in fewer support requests than not showing them.

### Cause 2

Your subscription has a quota restriction. Subscriptions have limits on how many CPU cores they can consume. The limit applies to some reserved instance products, most notably virtual machines. Azure wants to ensure that people who purchase a reserved instance can make use it. Azure does a simple, cursory check in the Azure portal to make sure that you have enough free cores in your subscription to deploy the VM and get a benefit from the reservation purchase.

The check to allow you to add a particular product to your cart and purchase a reservation is simple. Azure evaluates the total number of CPU cores available to your subscription and checks whether the number is greater than the number of cores for the selected item.

Azure doesn't check the quota for **Shared** scope or **management group** scope reserved instances. The reserved instance benefit for the shared scope applies to all the subscriptions in the enrollment. The reserved instance benefit for the management group scope applies to all the subscriptions that are part of the both the management group and billing scope. Azure can't determine whether you have enough free cores across all of your subscriptions to deploy the resource. Whatever the quota, Azure always lets you select a VM size when the selected scope is set to shared or management group.

Additionally, Azure doesn't do a quota check for **Recommended** purchases. Recommendations are based on active usage. Azure assumes that you have enough cores to run a specific VM size because you've already generated the usage required to create the recommendation.

## Solution

Depending on the error message you received, use one of the following solutions for your problem.

### Solution 1

If you see a _Product unavailable_ message, select the **Contact support** link in the error message to request to add an exception for your subscription. Exceptions aren't always granted.

### Solution 2

If you see a _Not enough core quota_ message, you can change the scope to **Shared**. After you buy the reservation, you can change the reservation scope from **Shared** to **Single**.

Or, select the **Request quota increase** link in the error message to request additional CPU core quota for your subscription.

## Next steps

- For more information about reservation scope options, see [Scope reservations](prepare-buy-reservation.md#scope-reservations).