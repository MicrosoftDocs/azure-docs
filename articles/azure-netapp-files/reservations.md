---
title: Reserved capacity for Azure NetApp Files
description: Learn how to optimize total cost of ownership (TCO) with Azure NetApp Files reservations. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/17/2024
ms.author: anfdocs
---
# Reserved capacity for Azure NetApp Files

You can save money on the storage costs for Azure NetApp Files with reservations. Azure NetApp Files reservations offer a discount on capacity for storage costs when you commit to a reservation for one or three years, optimizing your total cost of ownership (TCO). A reservation provides a fixed amount of storage capacity for the term of the reservation.

Azure NetApp Files reservations can significantly reduce your capacity costs for storing data in your Azure NetApp Files volumes. How much you save depends on the total capacity you choose to reserve, and the [service level](azure-netapp-files-service-levels.md) chosen. 

For pricing information about reservations in Azure NetApp Files, see [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Reservation terms for Azure NetApp Files  

This section describes the terms of an Azure NetApp Files reservation.

>[!NOTE]
>Azure NetApp Files reservations cover matching capacity pools in the selected service level and region. When using capacity pools configured with [cool access](manage-cool-access.md), only "hot" tier consumption is covered by the reservation benefit.

### Reservation quantity

You can purchase a reservation in 100-TiB and 1-PiB units per month for a one- or three-year term for a particular service level within a region.

### Reservation scope

A reservation applies to your usage within the purchased scope. It can't be limited to a specific NetApp account, capacity pool, container, or object within the subscription.

When you purchase the reservation, you choose the subscription scope. You can change the scope after the purchase. The scope options are:

- **Single resource group scope:** The reservation discount applies to the selected resource group only. 
- **Single subscription scope:** The reservation discount applies to the matching resources in the selected subscription. 
- **Shared scope:** The reservation discount applies to matching resources in eligible subscriptions in the billing context. If a subscription moves to a different billing context, the benefit no longer applies to the subscription. The benefit continues to apply to other subscription in the billing context. 
    - If you're an enterprise customer, the billing context is the EA enrollment. The reservation shared scope includes multiple Microsoft Entra tenants in an enrollment. 
    - If you're a Microsoft Customer Agreement customer, the billing scope is the billing profile.
    - If you're a pay-as-you-go customer, the shared scope is all pay-as-you-go subscriptions created by the account administrator. 
- **Management group:** the reservation discount applies to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. The management group scope applies to all subscriptions throughout the entire management group hierarchy. To buy a reservation for a management group, you must have read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription. 

Any reservation for Azure NetApp Files covers only the capacity pools within the service level selected. Add-on features such as cross-region replication and backup aren't included in the reservation. As soon as you buy a reservation, the capacity charges that match the reservation attributes are charged at the discount rates instead of the pay-as-you go rates. 

For more information on Azure reservations, see [What are Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md).

### Supported service level options

Azure NetApp Files reservations are available for Standard, Premium, and Ultra service levels in units of 100 TiB and 1 PiB.

### Requirements for purchase

To purchase a reservation:
* You must be in the **Owner** role for at least one Enterprise or individual subscription with pay-as-you-go rates.
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the EA portal. Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure NetApp Files reservations.

## Determine required capacity before purchase

When you purchase an Azure NetApp Files reservation, you must choose the region and tier for the reservation. Your reservation is valid only for data stored in that region and tier. For example, suppose you purchase a reservation for Azure NetApp Files *Premium* service level in US East. That reservation applies to neither *Premium* capacity pools for that subscription in US West nor capacity pools for other service levels (for example, *Ultra* service level in US East). Additional reservations can be purchased. 

Reservations are available in 100-TiB or 1-PiB increments; higher discounts are available for 1-PiB increments. When you purchase a reservation in the Azure portal, Microsoft might provide you with recommendations based on your previous usage to help determine which reservation you should purchase.

Purchasing an Azure NetApp Files reservation doesn't automatically increase your regional capacity. Azure NetApp Files reservations aren't an on-demand capacity guarantee. If your reservation requires a quota increase, it's recommended you complete that before making the reservation. For more information, see [Regional capacity in Azure NetApp Files](regional-capacity-quota.md).

## Purchase an Azure NetApp Files reservation

You can purchase Azure NetApp Files reservation through the [Azure portal](https://portal.azure.com/). You can pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

To purchase a reservation:

1. Log in to the Azure portal.
1. To buy a new reservation, select **All services** > **Reservations** then **Azure NetApp Files**.

    :::image type="content" source="./media/reservations/reservations-services.png" alt-text="Screenshot of the reservations services menu." lightbox="./media/reservations/reservations-services.png":::
    
1. Select a subscription. Use the subscription list to choose the subscription used to pay for the reservation. The payment method of the subscription is charged the cost of the reservation. The subscription type must be an enterprise agreement (offer numbers MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or pay-as-you-go (offer numbers MS-AZR-0003P or MS-AZR-0023P).
    1. For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously known as monetary commitment) balance or charged as overage. 
    1. For a pay-as-you-go subscription, the charges are billed to the credit card or invoice payment method on the subscription. 
1. Select a scope.
1. Select the Azure region to be covered by the reservation. 

    :::image type="content" source="./media/reservations/subscription-scope.png" alt-text="Screenshot of the subscription choices." lightbox="./media/reservations/subscription-scope.png":::

1. Select **Add to cart**. 
1. In the cart, choose the quantity of provisioned throughput units you want to purchase. For example, choosing 64 covers up to 64 deployed provisioned throughput units every hour. 
1. Select **Next: Review + Buy** to review your purchase choices and their prices. 
1. Select **Buy now**. 
1. After purchase, you can select **View this reservation** to review your purchase status. 

After you purchase a reservation, it's automatically applied to any existing [Azure NetApp Files capacity pools](azure-netapp-files-set-up-capacity-pool.md) that match the terms of the reservation. If you haven't created any Azure NetApp Files capacity pools, the reservation applies when you create a resource that matches the terms of the reservation. In either case, the term of the reservation begins immediately after a successful purchase.

## Exchange or refund a reservation 

You can exchange or refund a reservation, with certain limitations. For more information about Azure Reservations policies, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Expiration of a reservation 

When a reservation expires, any Azure NetApp Files capacity you're using under that reservation is billed at the pay-as-you go rate. By default, reservations are set to renew automatically at time of purchase. You can modify the renewal option at the time or purchase or after. 

An email notification is sent 30 days prior to the expiration of the reservation, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

* [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
* [Understand how reservation discounts are applied to Azure storage services](../cost-management-billing/reservations/understand-storage-charges.md)
