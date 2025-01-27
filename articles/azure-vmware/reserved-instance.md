---
title: Reserved instances of Azure VMware Solution
description: Learn how to buy a reserved instance for Azure VMware Solution. The reserved instance covers only the compute part of your usage and includes software licensing costs.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/4/2024
ms.custom: engagement-fy23
---

# Save costs with reserved instances in Azure VMware Solution

When you commit to a reserved instance of [Azure VMware Solution](introduction.md), you save money. The reservation discount automatically applies to the running Azure VMware Solution hosts that match the reservation scope and attributes. In addition, a reserved instance purchase covers only the compute part of your usage and includes software licensing costs.

## Purchase restriction considerations

Reserved instances are available with some exceptions:

- **Clouds**: Reservations are available only in the regions listed on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware) page.
- **Insufficient quota**: A reservation scoped to a single or shared subscription must have hosts quota available in the subscription for the new reserved instance. You can [create a quota increase request](request-host-quota-azure-vmware-solution.md) to resolve this issue.
- **Offer eligibility**: You need an [Azure Enterprise Agreement (EA)](../cost-management-billing/manage/ea-portal-agreements.md) with Microsoft.
- **Capacity restrictions**: In rare circumstances, Azure limits the purchase of new reservations for Azure VMware Solution host SKUs because of low capacity in a region.

## Buy a reservation

You can buy a reserved instance of an Azure VMware Solution host instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D).

You can pay for the reservation [upfront or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

These requirements apply to buying a reserved dedicated host instance:

-   To buy a reservation, you must have the owner role or reservation purchaser role on an Azure subscription.
-   For EA subscriptions, you must enable the **Add Reserved Instances** option in the [EA portal](https://ea.azure.com/). If disabled, you must be an EA Admin for the subscription to enable it.
-   For a subscription under a Cloud Solution Provider (CSP) Azure plan, the partner must purchase the customer's reserved instances in the Azure portal.

### Buy reserved instances for an EA subscription

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **All services** > **Reservations**.

1. Select **Purchase Now**, and then select **Azure VMware Solution**.

1. Enter the required fields. The selected attributes that match running Azure VMware Solution hosts qualify for the reservation discount. Attributes include the SKU, regions (where applicable), and scope. Reservation scope selects where the reservation savings apply.

   If you have an EA agreement, you can use the **Add more option** to add instances quickly. The option isn't available for other subscription types.

   | Field        |  Description |
   | ------------ | ------------ |
   | Subscription | The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an EA (offer numbers MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or an individual subscription with pay-as-you-go rates (offer numbers MS-AZR-0003P or MS-AZR-0023P). The charges are deducted from the Azure Prepayment (previously called monetary commitment) balance, if available, or charged as overage. For a subscription with pay-as-you-go rates, the charges are billed to the subscription's credit card or an invoice payment method. |
   | Scope        | The reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select:<br><ul><li><b>Single resource group scope</b>: Applies the reservation discount to the matching resources in the selected resource group only.</li><li><b>Single subscription scope</b>: Applies the reservation discount to the matching resources in the selected subscription.</li><li><b>Shared scope</b>: Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. Therefore, the billing scope is all eligible subscriptions created by the account administrator for individual subscriptions with pay-as-you-go rates.<li>**Management group**: Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.</li></li></ul>       |
   | Region       | The Azure region covered by the reservation.   |
   | Host size    | AV36    |
   | Term         | One year or three years.  |
   | Quantity     | The number of instances to purchase within the reservation. The quantity is the number of running Azure VMware Solution hosts that can get the billing discount.    |

### Buy reserved instances for a CSP subscription

CSPs that want to purchase reserved instances for their customers must use the **Admin On Behalf Of** procedure from the [Partner Center documentation](/partner-center/azure-plan-manage). For more information, view the Admin On Behalf Of video.

1. Sign in to [Partner Center](https://partner.microsoft.com).

1. Select **CSP** to access the **Customers** pane.

1. Expand customer details and select **Microsoft Azure Management Portal**.

   :::image type="content" source="media/reserved-instances/csp-partner-center-aobo.png" alt-text="Screenshot that shows the Microsoft Partner Center customer area with Microsoft Azure Management Portal selected." lightbox="media/reserved-instances/csp-partner-center-aobo.png":::

1. In the Azure portal, select **All services** > **Reservations**.

1. Select **Purchase Now** and then select **Azure VMware Solution**.

   :::image type="content" source="media/reserved-instances/csp-buy-reserved-instance-azure-portal.png" alt-text="Screenshot that shows where to purchase Azure VMware Solution reservations in the Azure portal." lightbox="media/reserved-instances/csp-buy-reserved-instance-azure-portal.png":::

1. Enter the required fields. The selected attributes that match running Azure VMware Solution hosts qualify for the reservation discount. Attributes include the SKU, regions (where applicable), and scope. Reservation scope selects where the reservation savings apply.

   | Field        |  Description |
   | ------------ | ------------ |
   | Subscription | The subscription that funds the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an eligible one, which in this case is a CSP subscription.|
   | Scope        | The reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select:<br><ul><li><b>Single resource group scope</b>: Applies the reservation discount to the matching resources in the selected resource group only.</li><li><b>Single subscription scope</b>: Applies the reservation discount to the matching resources in the selected subscription.</li><li><b>Shared scope</b>: Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. Therefore, the billing scope is all eligible subscriptions created by the account administrator for individual subscriptions with pay-as-you-go rates.<li>**Management group**: Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.</li></li></ul>       |
   | Region       | The Azure region covered by the reservation.   |
   | Host size    | AV36    |
   | Term         | One year or three years.  |
   | Quantity     | The number of instances to purchase within the reservation. The quantity is the number of running Azure VMware Solution hosts that can get the billing discount.     |

To learn more about viewing the purchased reservations for your customer, see [View Azure reservations as a Cloud Solution Provider (CSP)](../cost-management-billing/reservations/how-to-view-csp-reservations.md).

## Usage data and reservation usage

Your usage that gets a reservation discount has an effective price of zero. You can see which Azure VMware Solution instance received the reservation discount for each reservation.

For more information about how reservation discounts appear in usage data:

- For EA customers, see [Understand Azure reservation usage for your EA enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md).
- For individual subscriptions, see [Understand Azure reservation usage for your pay-as-you-go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Change a reservation after purchase

You can make these changes to a reservation after purchase:

- Update reservation scope
- Instance size flexibility (if applicable)
- Ownership

You can also split a reservation into smaller chunks or merge reservations. None of the changes causes a new commercial transaction or changes the end date of the reservation.

For more information about CSP-managed reservations, see [Sell Azure reservations to customers by using Partner Center, the Azure portal, or APIs](/partner-center/azure-reservations).

>[!NOTE]
>After you purchase your reservation, you won't be able to make these types of changes directly:
>
> - An existing reservation's region
> - SKU
> - Quantity
> - Duration
>
> However, you can *exchange* a reservation if you want to make changes.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md). *Azure VMware Solution reservations don't fall into this category, so the new exchange rules don't apply.*

CSPs can cancel, exchange, or refund reservations, with certain limitations, purchased for their customer. For more information, see [Manage, cancel, exchange, or refund Azure reservations for customers](/partner-center/azure-reservations-manage).

## Related content

Now that you covered reserved instances of Azure VMware Solution, learn how to:

- [Create an Azure VMware Solution assessment](../migrate/how-to-create-azure-vmware-solution-assessment.md)
- [Configure DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md)
- [Integrate Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
