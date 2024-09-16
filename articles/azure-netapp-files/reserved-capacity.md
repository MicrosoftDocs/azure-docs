---
title: Reserved capacity for Azure NetApp Files
description: Learn how to optimize TCO with capacity reservations in Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/16/2024
ms.author: anfdocs
---
# Reserved capacity for Azure NetApp Files

You can save money on the storage costs for Azure NetApp Files with capacity reservations. Azure NetApp Files reserved capacity offers you a discount on capacity for storage costs when you commit to a reservation for one or three years, optimizing your TCO. A reservation provides a fixed amount of storage capacity for the term of the reservation.

Azure NetApp Files reserved capacity can significantly reduce your capacity costs for storing data in your Azure NetApp Files volumes. How much you save depends on the total capacity you choose to reserve, and the [service level](azure-netapp-files-service-levels.md) chosen. 

For pricing information about reservation capacity for Azure NetApp Files, see [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Reservation terms for Azure NetApp Files  

This section describes the terms of an Azure NetApp Files capacity reservation.

>[!NOTE]
>Azure NetApp Files reserved capacity covers matching capacity pools in the selected service level and region. When using capacity pools configured with [Standard storage with cool access](manage-cool-access.md), only "hot" tier consumption is covered by the reserved capacity benefit.

### Reservation capacity

You can purchase Azure NetApp Files reserved capacity in units of 100 TiB and 1 PiB per month for a one- or three-year term for a particular service level within a region.

### Reservation scope

Azure NetApp Files reserved capacity is available for a single subscription and multiple subscriptions (shared scope). When scoped to a single subscription, the reservation discount is applied to the selected subscription only. When scoped to multiple subscriptions, the reservation discount is shared across those subscriptions within the customer's billing context.

A reservation applies to your usage within the purchased scope and cannot be limited to a specific NetApp account, capacity pools, container, or object within the subscription.

Any capacity reservation for Azure NetApp Files covers only the capacity pools within the service level selected. Add-on features such as cross-region replication and backup are not included in the reservation. As soon as you buy a reservation, the capacity charges that match the reservation attributes are charged at the discount rates instead of the pay-as-you go rates. 

For more information on Azure reservations, see [What are Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md).

### Supported service level options

Azure NetApp Files reserved capacity is available for Standard, Premium, and Ultra service levels in units of 100 TiB and 1 PiB.

### Requirements for purchase

To purchase reserved capacity:
* You must be in the **Owner** role for at least one Enterprise or individual subscription with pay-as-you-go rates.
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the EA portal. Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure NetApp Files reserved capacity.

## Determine required capacity before purchase

When you purchase an Azure NetApp Files reservation, you must choose the region and tier for the reservation. Your reservation is valid only for data stored in that region and tier. For example, suppose you purchase a reservation for Azure NetApp Files *Premium* service level in US East. That reservation applies to neither *Premium* capacity pools for that subscription in US West nor capacity pools for other service levels (for example, *Ultra* service level in US East). Additional reservations can be purchased. 

Reservations are available for 100-TiB or 1-PiB increments, with higher discounts for 1-PiB increments. When you purchase a reservation in the Azure portal, Microsoft might provide you with recommendations based on your previous usage to help determine which reservation you should purchase.

Purchasing an Azure NetApp Files reserved capacity does not automatically increase your regional capacity. Azure reservations for Azure NetApp Files are not an on-demand capacity guarantee. If you're capacity reservation requires a quota increase, it's recommended you complete that before making the reservation. For more information, see [Regional capacity in Azure NetApp Files](regional-capacity-quota.md).

## Purchase Azure NetApp Files reserved capacity 

You can purchase Azure NetApp Files reserved capacity through the [Azure portal](https://portal.azure.com/). You can pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

To purchase reserved capacity:

1. Navigate to the [**Purchase reservations**](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/Browse_AddCommand) blade in the Azure portal.

2. Select **Azure NetApp Files** to buy a new reservation.

3. Fill in the required fields as described in the table that appears.

4. After you select the parameters for your reservation, the Azure portal displays the cost. The portal also shows the discount percentage over pay-as-you-go billing.

5. In the **Purchase reservations** blade, review the total cost of the reservation. You can also provide a name for the reservation.

After you purchase a reservation, it is automatically applied to any existing [Azure NetApp Files capacity pools](azure-netapp-files-set-up-capacity-pool.md) that match the terms of the reservation. If you haven't created any Azure NetApp Files capacity pools, the reservation applies when you create a resource that matches the terms of the reservation. In either case, the term of the reservation begins immediately after a successful purchase.

## Exchange or refund a reservation 

You can exchange or refund a reservation, with certain limitations. For more information about Azure Reservations policies, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

<!-- 
### Exchange a reservation  

Exchanging a reservation enables you to receive a prorated refund based on the unused portion of the reservation. You can then apply the refund to the purchase price of a new Azure NetApp Files reservation.

There's no limit on the number of exchanges you can make. Also, there's no fee associated with an exchange. The new reservation that you purchase must be of equal or greater value than the prorated credit from the original reservation. An Azure NetApp Files reservation can be exchanged only for another Azure NetApp Files reservation, and not for a reservation for any other Azure service.

### Refund a reservation

You can cancel an Azure NetApp Files reservation at any time. When you cancel, you'll receive a prorated refund based on the remaining term of the reservation, minus a 12% early termination fee. The maximum refund per year is $50,000.

Cancelling a reservation immediately terminates the reservation and returns the remaining months to Microsoft. The remaining prorated balance, minus the fee, will be refunded to your original form of purchase. -->

## Expiration of a reservation 

When a reservation expires, any Azure NetApp Files capacity that you are using under that reservation is billed at the pay-as-you go rate. Reservations don't renew automatically.

An email notification is sent 30 days prior to the expiration of the reservation, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

* [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
* [Understand how reservation discounts are applied to Azure storage services](../cost-management-billing/reservations/understand-storage-charges.md)
