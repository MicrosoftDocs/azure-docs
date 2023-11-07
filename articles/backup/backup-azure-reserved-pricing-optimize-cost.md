---
title: Optimize costs for Azure Backup Storage with reserved capacity
description: This article explains about how to optimize costs for Azure Backup Storage with reserved capacity.
ms.topic: how-to
ms.service: backup
ms.date: 09/03/2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Optimize costs for Azure Backup Storage with reserved capacity

You can save money on backup storage costs for the vault-standard tier using Azure Backup Storage reserved capacity. Azure Backup Storage reserved capacity offers you a discount on capacity for backup data stored for the vault-standard tier when you commit to a reservation for either one year or three years. A reservation provides a fixed amount of backup storage capacity for the term of the reservation.

Azure Backup Storage reserved capacity can significantly reduce your capacity costs for Azure Backup data. The cost savings achieved depend on the duration of your reservation, the total capacity you choose to reserve, and the vault tier, and type of redundancy you've chosen for your vault. Reserved capacity provides a billing discount and doesn't affect the state of your Azure Backup Storage resources.

For information about Azure Backup pricing, see [Azure Backup pricing page](https://azure.microsoft.com/pricing/details/backup/).

## Reservation terms for Azure Storage

The following sections describe the terms of an Azure Backup Storage reservation.

#### Reservation capacity

You can purchase Azure Backup Storage reserved capacity in units of 100 TiB and 1 PiB per month for a one-year or three-year term.

#### Reservation scope

Azure Backup Storage reserved capacity is available for a single subscription, multiple subscriptions (shared scope), and management groups.

- When scoped to a single subscription, the reservation discount is applied only to the selected subscription. 
- When scoped to multiple subscriptions, the reservation discount is shared across those subscriptions within your billing context. 
- When scoped to management group, the reservation discount is shared across the subscriptions that are a part of management group and billing scope.

When you purchase Azure Backup Storage reserved capacity, you can use your reservation for backup data stored in the vault-standard tier only. A reservation is applied to your usage within the purchased scope and can’t be limited to a specific storage account, container, or object within the subscription.

An Azure Backup Storage reservation covers only the amount of data that's stored in a subscription or shared resource group. Early deletion, operations, bandwidth, and data transfer charges aren’t included in the reservation. As soon as you purchase a reservation, you're charged for the capacity charges that match the reservation attributes at the discount rates, instead of pay-as-you-go rates. For more information on Azure reservations, see [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)

#### Supported account types, tiers, and redundancy options

Azure Backup Storage reserved capacity is available for backup data stored in the vault-standard tier.

LRS, GRS, RA-GRS, and ZRS redundancies are supported for reservations. For more information about redundancy options, see [Azure Storage redundancy](../storage/common/storage-redundancy.md).

>[!Note]
>Azure Backup Storage reserved capacity isn't applicable for Protected Instance cost. It's also not applicable to vault-archive tier.

#### Security requirements for purchase

To purchase reserved capacity:

- You must be in the Owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, the policy to add reserved instances must be enabled. For direct EA agreements, the Reserved Instances policy must be enabled in the Azure portal. For indirect EA agreements, the Add Reserved Instances policy must be enabled in the EA portal. Or, if those policy settings are disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can purchase Azure Backup Blob Storage reserved capacity.

## Determine required capacity before purchase

When you purchase an Azure Backup Storage reservation, you must choose the reservation’s region, vault tier, and redundancy option. Your reservation is valid only for data stored in that region, vault tier, and redundancy level. For example, you purchase a reservation for data in US West for the vault-standard tier using geo-redundant storage (GRS). You can't use the same reservation for data in US East, or data in locally redundant storage (LRS). However, you can purchase another reservation for your additional needs.

Reservations are currently available for 100 TiB or 1 PiB blocks, with higher discounts for 1 PiB blocks. When you purchase a reservation in the Azure portal, Microsoft may provide you with recommendations based on your previous usage to help determine which reservation you should purchase.

## Purchase Azure Backup Storage reserved capacity

You can purchase Azure Backup Storage reserved capacity through the [Azure portal](https://portal.azure.com/). Pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

For help with identifying the reservation terms that are right for your scenario, see [Understand how reservation discounts are applied to Azure Backup storage](backup-azure-reserved-pricing-overview.md).

To purchase reserved capacity, follow these steps:

1. Go to the [Purchase reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/Browse_AddCommand) pane in the Azure portal.

1. Select **Azure Backup** to purchase a new reservation.

1. Enter required information as described in the following table:

   :::image type="content" source="./media/backup-azure-reserved-pricing/purchase-reserved-capacity-enter-information.png" alt-text="Screenshot showing the information to enter to purchase reservation capability for Azure Backup Storage.":::

   | Field | Description |
   | --- | --- |
   | Scope | Indicates the number of subscriptions you can use for the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br><br> If you select Shared, the reservation discount is applied to Azure Backups Storage capacity in any subscription within your billing context. The billing context is based on how you signed up for Azure. If you're an enterprise customer, the shared scope is the enrollment and includes all subscriptions within the enrollment. If you're a pay-as-you-go customer, the shared scope includes all individual subscriptions with pay-as-you-go rates created by the account administrator. <br><br> If you select Single subscription, the reservation discount is applied to Azure Backup Storage capacity in the selected subscription. <br><br> If you select Single resource group, the reservation discount is applied to Azure Backup Storage capacity in the selected subscription and the selected resource group within that subscription. <br><br> If you select Management group, the reservation discount is applied to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. To buy a reservation for a management group, you must have at least read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription.  <br><br> You can change the reservation scope after you purchase the reservation. |
   | Subscription | The subscription that's used to pay for the Azure Backup Storage reservation. The payment method on the selected subscription is used in charging the costs. The subscription must be one of the following types:  <br><br> - **Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P)**: For an Enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. <br><br> - **Individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P)**: For an individual subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription. <br><br> - Microsoft Customer Agreement subscriptions <br><br> - CSP subscriptions. |
   | Region | The region where the reservation is in effect. |
   | Vault tier | The vault tier for which the reservation is in effect. Currently, only reservations for vault-standard tier are supported. |
   | Redundancy | The redundancy option for the reservation. Options include LRS,  GRS, RA-GRS and ZRS. For more information about redundancy options, see [Azure Storage redundancy](../storage/common/storage-redundancy.md). |
   | Billing frequency | Indicates how often the account is billed for the reservation. Options include Monthly or Upfront. |
   | Size | The amount of capacity to reserve. |
   | Term | One year or three years. |

1. After you select the parameters for your reservation, the Azure portal displays the cost. The portal also shows the discount percentage over pay-as-you-go billing.

1. In the **Purchase reservations** pane, review the total cost of the reservation.

   You can also provide a name for the reservation.

   :::image type="content" source="./media/backup-azure-reserved-pricing/purchase-reserved-capacity-review-total-cost-inline.png" alt-text="Screenshot showing the Purchase reservation pane to review the total cost of the reservation." lightbox="./media/backup-azure-reserved-pricing/purchase-reserved-capacity-review-total-cost-expanded.png":::

After you purchase a reservation, it's automatically applied to any existing Azure Backup Storage data that matches the terms of the reservation. If you haven't created any Azure Backup Storage data yet, the reservation will apply whenever you create a resource that matches the terms of the reservation. In either case, the term of the reservation begins immediately after a successful purchase.

## Exchange or refund a reservation

You can exchange or refund a reservation, with certain limitations. These limitations are described in the following sections.

To exchange or refund a reservation, follow these steps:

1. Go to the reservation details in the Azure portal.

1. Select **Exchange or Refund**, and follow the instructions to submit a support request.

You'll receive an email confirmation when the request is processed. For more information about Azure Reservations policies, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Exchange a reservation

Exchanging a reservation enables you to receive a prorated refund based on the unused portion of the reservation. You can then apply the refund to the purchase price of a new Azure Backup Storage reservation.

There's no limit on the number of exchanges you can make. Additionally, there's no fee associated with an exchange. The new reservation that you purchase must be of equal or greater value than the prorated credit from the original reservation. An Azure Backup Storage reservation can be exchanged only for another Azure Backup Storage reservation, and not for a reservation for any other Azure service.

## Refund a reservation

You may cancel an Azure Backup Storage reservation at any time. When you cancel, you'll receive a prorated refund based on the remaining term of the reservation. The maximum refund per year is *$50,000*.

Cancelling a reservation immediately terminates the reservation and returns the remaining months to Microsoft. The remaining prorated balance, minus the fee, will be refunded to your original form of purchase.

## Expiration of a reservation

When a reservation expires, any Azure Backup Storage capacity that you've used under that reservation is billed at the pay-as-you go rate. Reservations don't renew automatically.

You'll receive an email notification 30 days prior to the expiration of the reservation, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

>[!Note]
>If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Understand how reservation discounts are applied to Azure Backup storage](backup-azure-reserved-pricing-overview.md).

