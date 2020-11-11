---
title: Save costs with Azure VMware Solution reserved instance
description: Learn how to buy a reserved instance for Azure VMware Solution.
ms.topic: how-to
ms.date: 10/02/2020
---

# Save costs with Azure VMware Solution

When you commit to a reserved instance of [Azure VMware Solution](introduction.md), you save money. The reservation discount is applied automatically to the running Azure VMware Solution hosts that match the reservation scope and attributes. You don't need to assign a reservation to a dedicated host to get the discounts. A reserved instance purchase covers only the compute part of your usage and includes software licensing costs. 


## Purchase restriction considerations

Reserved instances are available with some exceptions.

-   **Clouds** - Reservations are available only in the regions listed on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware) page.

-   **Insufficient quota** - A reservation scoped to a single/shared subscription must have hosts quota available in the subscription for the new reserved instance. You can [create quota increase request](enable-azure-vmware-solution.md) to resolve this issue.

-   **Offer eligibility**- You'll need an [Azure Enterprise Agreement (EA)](../cost-management-billing/manage/ea-portal-agreements.md) with Microsoft.

-   **Capacity restrictions** - In rare circumstances, Azure limits the purchase of new reservations for Azure VMware Solution host SKUs because of low capacity in a region.

## Buy a reservation

You can buy a reserved instance of an Azure VMware Solution host instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D).

Pay for the reservation [up front or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

These requirements apply to buying a reserved dedicated host instance:

-   You must be in an Owner role for at least one EA subscription or a subscription with a pay-as-you-go rate.

-   For EA subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin for the subscription.

To buy an instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **All services** > **Reservations**.

3. Select **Add** to purchase a new reservation and then select **Azure VMware Solution**.

4. Enter the required fields. Running Azure VMware Solution hosts that match the attributes, you select qualify to get the reservation discount. The actual number of your Azure VMware Solution hosts that get the discount depending on the scope and quantity selected.

   If you have an EA agreement, you can use the **Add more option** to add additional instances quickly. The option isn't available for other subscription types.

   | Field        |  Description |
   | ------------ | ------------ |
   | Subscription | The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P). The charges are deducted from the monetary commitment balance, if available, or charged as overage. For a subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription. |
   | Scope        | The reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select:<br><ul><li><b>Single resource group scope—Applies the reservation discount to the matching resources in the selected resource group only.</li><li><b>Single subscription scope—Applies the reservation discount to the matching resources in the selected subscription.</li><li><b>Shared scope—Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.</li></ul>       |
   | Region       | The Azure region that’s covered by the reservation.   |
   | Host Size    | AV36    |
   | Term         | One year or three years.  |
   | Quantity     | The number of instances being purchased within the reservation. The quantity is the number of running Azure VMware Solution hosts that can get the billing discount.    |

## Usage data and reservation usage

Your usage that gets a reservation discount has an effective price of zero. You can see which Azure VMware Solution instance received the reservation discount for each reservation.

For more information about how reservation discounts appear in usage data:

- For EA customers, see [Understand Azure reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
- For individual subscriptions, see [Understand Azure reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md)

## Change a reservation after purchase

You can make the following types of changes to a reservation after purchase:

-   Update reservation scope

-   Instance size flexibility (if applicable)

-   Ownership

You can also split a reservation into smaller chunks or merge reservations. None of the changes cause a new commercial transaction or change the end date of the reservation.

>[!NOTE]
>Once you've purchased your reservation, you will not be able to make the following types of changes directly:
>
> - An existing reservation’s region
> - SKU
> - Quantity
> - Duration
>
>However, you can *exchange* a reservation if you want to make changes.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For
more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).