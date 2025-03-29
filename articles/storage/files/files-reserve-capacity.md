---
title: Reduce costs for Azure Files with reservations
titleSuffix: Azure Files 
description: Learn how to save costs on Azure file share deployments by using Azure Files reservations, also called reserved instances. Get a discount on capacity when you commit to a reservation for either one year or three years.
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 05/08/2024
ms.author: kendownie
recommendations: false
---

# Optimize costs with Azure Files reservations

You can save money on the storage costs for Azure file shares with Azure Files reservations. Azure Files reservations (also referred to as *reserved instances*) offer you a discount on capacity for storage costs when you commit to a reservation for either one year or three years. A reservation provides a fixed amount of storage capacity for the term of the reservation.

Azure Files reservations can significantly reduce your capacity costs for storing data in Azure file shares. How much you save will depend on the duration of your Reservation, the total storage capacity you choose to reserve, and the tier and redundancy settings that you've chosen for your Azure file shares. Reservations provide a billing discount and don't affect the state of your Azure file shares. Reservations have no effect on performance.

For pricing information about Azure Files reservations, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Reservation terms for Azure Files

The following sections describe the terms of an Azure Files Reservation.

### Reservation units and terms

You can purchase Azure Files reservations in units of 10 TiB and 100 TiB per month for a one-year or three-year term.

### Reservation scope

Azure Files reservations are available for a single subscription, multiple subscriptions (shared scope), and management groups. When scoped to a single subscription, the reservation discount is applied to the selected subscription only. When scoped to multiple subscriptions, the reservation discount is shared across those subscriptions within the customer's billing context. When scoped to a management group, the reservation discount is applied to subscriptions that are a part of both the management group and billing scope. A reservation applies to your usage within the purchased scope and can't be limited to a specific storage account, container, or object within the subscription.

An Azure Files reservation covers only the amount of data that is stored in a subscription or shared resource group. Transaction, bandwidth, data transfer, and metadata storage charges aren't included in the reservation. As soon as you buy a reservation, the capacity charges that match the reservation attributes are charged at the discount rates instead of the pay-as-you go rates. For more information, see [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md).

### Reservations and snapshots

If you're taking snapshots of Azure file shares, there are differences in how reservations work for pay-as-you-go file shares versus provisioned v1 file shares. If you're taking snapshots of pay-as-you-go file shares, then the snapshot differentials count against the reservation and are billed as part of the normal used storage meter. However, if you're taking snapshots of provisioned v1 file shares, then the snapshots are billed using a separate meter and don't count against the reservation.

### Supported tiers and redundancy options

Azure Files reservations are available for SSD file shares using the provisioned v1 model and for HDD file shares using the pay-as-you-go model (hot and cool access tiers only). Reservations aren't available for Azure file shares for the provisioned v2 model. All storage redundancies support reservations. For more information about redundancy options, see [Azure Files redundancy](storage-files-planning.md#redundancy).

### Security requirements for purchase

To purchase a reservation:

- To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the EA portal. Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure Files Reservations.

## Determine required capacity before purchase

When you purchase an Azure Files reservation, you must choose the region, tier, and redundancy option for the reservation. Your reservation is valid only for data stored in that region, tier, and redundancy level. For example, suppose you purchase a reservation for data in West US for the HDD pay-as-you-go hot access tier using zone-redundant storage (ZRS). That reservation will not apply to data in US East, data in the HDD pay-as-you-go cool tier, or data in geo-redundant storage (GRS). However, you can purchase another reservation for any additional needs.  

Reservations are available for 10 TiB or 100 TiB blocks, with higher discounts for 100 TiB blocks. When you purchase a reservation in the Azure portal, Microsoft may provide you with recommendations based on your previous usage to help determine which reservation you should purchase.

## Purchase Azure Files reservations

You can purchase Azure Files reservations through the [Azure portal](https://portal.azure.com). Pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](../../cost-management-billing/reservations/prepare-buy-reservation.md).

For help identifying the Reservation terms that are right for your scenario, see [Understand Azure Storage reservation discounts](../../cost-management-billing/reservations/understand-storage-charges.md).

Follow these steps to purchase a reservation:

1. Navigate to the [Purchase reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/Browse_AddCommand) blade in the Azure portal.  
1. Select **Azure Files** to buy a new Reservation.  
1. Fill in the required fields as described in the following table:

    ![Screenshot showing how to purchase Reservations.](./media/files-reserve-capacity/select-reserved-capacity.png)

   |Field  |Description  |
   |---------|---------|
   |**Scope**   |  Indicates how many subscriptions can use the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br/><br/> If you select **Shared**, the reservation discount is applied to Azure Files capacity in any subscription within your billing context. The billing context is based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For non-enterprise customers, the shared scope includes all individual subscriptions with rates created by the account administrator.  <br/><br/>  If you select **Single subscription**, the reservation discount is applied to Azure Files capacity in the selected subscription. <br/><br/> If you select **Single resource group**, the reservation discount is applied to Azure Files capacity in the selected subscription and the selected resource group within that subscription. <br/><br/> You can change the reservation scope after you purchase the reservation.  |
   |**Subscription**  | The subscription that's used to pay for the Azure Files reservation. The payment method on the selected subscription is used in charging the costs. The subscription must be one of the following types: <br/><br/>  Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P): For an Enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. <br/><br/> Individual subscription with "pay-as-you-go" rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P): For an individual subscription with "pay-as-you-go" rates, the charges are billed to the credit card or invoice payment method on the subscription.    |
   | **Region** | The region where the reservation is in effect. |
   | **Tier** | The access tier for which the reservation is in effect. Options include *Premium* (using the SSD provisioned v1 model), *Hot* (using the HDD pay-as-you-go model), and *Cool* (using the HDD pay-as-you-go model). |
   | **Redundancy** | The redundancy option for the Reservation. Options include *LRS*, *ZRS*, *GRS*, and *GZRS*. For more information about redundancy options, see [Azure Files redundancy](storage-files-planning.md#redundancy). |
   | **Billing frequency** | Indicates how often the account is billed for the Reservation. Options include *Monthly* or *Upfront*. |
   | **Size** | The amount of capacity to reserve. |
   | **Term**  | One year or three years. |

1. After you select the parameters for your reservation, the Azure portal displays the cost. The portal also shows the discount percentage over pay-as-you-go billing.

1. In the **Purchase Reservations** blade, review the total cost of the reservation. You can also provide a name for the reservation.

After you purchase a reservation, it is automatically applied to any existing Azure file shares that match the terms of the reservation. If you haven't created any Azure file shares yet, the reservation will apply whenever you create a resource that matches the terms of the reservation. In either case, the term of the reservation begins immediately after a successful purchase.

## Exchange or refund a reservation

You can exchange or refund a reservation, with certain limitations. These limitations are described in the following sections.

To exchange or refund a Reservation, navigate to the reservation details in the Azure portal. Select **Exchange** or **Refund**, and follow the instructions to submit a support request. When the request has been processed, Microsoft will send you an email to confirm completion of the request.

For more information about Azure reservations policies, see [Self-service exchanges and refunds for Azure reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

### Exchange a reservation

Exchanging a reservation enables you to receive a prorated refund based on the unused portion of the reservation. You can then apply the refund to the purchase price of a new Azure Files reservation.

There's no limit on the number of exchanges you can make. Additionally, there's no fee associated with an exchange. The new reservation that you purchase must be of equal or greater value than the prorated credit from the original reservation. An Azure Files reservation can be exchanged only for another Azure Files reservation, and not for a reservation for any other Azure service.

### Refund reservations

You can refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Expiration of a reservation

When a reservation expires, any Azure Files capacity that you are using under that reservation is billed at the pay-as-you go rate. Reservations don't renew automatically.

You'll receive an email notification 30 days prior to the expiration of the reservation, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Understand how reservation discounts are applied to Azure storage services](../../cost-management-billing/reservations/understand-storage-charges.md)
