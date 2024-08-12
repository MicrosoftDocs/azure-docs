---
title: Save costs with Microsoft Azure OpenAI Service Provisioned Reservations
description: Learn about how to save costs with Microsoft Azure OpenAI Service Provisioned Reservations.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: concept-article
ms.date: 08/08/2024
ms.author: banders
# customer intent: As a billing administrator, I want to learn about saving costs with Microsoft Azure OpenAI Service Provisioned Reservations and buy one.
---

# Save costs with Microsoft Azure OpenAI Service Provisioned Reservations

You can save money on Azure OpenAI provisioned throughput by committing to a reservation for your provisioned throughput units (PTUs) usage for a duration of one month or one year. This article explains how you can save money with Azure OpenAI Service Provisioned Reservations. For more information about Azure OpenAI PTUs, see [Provisioned throughput units onboarding](https://aka.ms/oai/docs/ptum-onboarding). 

To purchase an Azure OpenAI reservation, you choose an Azure region, quantity, and then add the Azure OpenAI SKU to your cart. Then you choose the quantity of provisioned throughput units that you want to purchase.

When you purchase a reservation, the Azure OpenAI provisioned throughput usage that matches the reservation attributes is no longer charged at the pay-as-you-go rates.

A reservation applies to provisioned deployments only and doesn't include other offerings such as standard deployments or fine tuning. Azure OpenAI Service Provisioned Reservations also don't guarantee capacity availability. To ensure capacity availability, the recommended best practice is to create your deployments before you buy your reservation.

When the reservation expires, Azure OpenAI deployments continue to run but are billed at the pay-as-you-go rate.

You can choose to enable automatic renewal of reservations by selecting the option in the renewal settings or at time of purchase. With Azure OpenAI reservation auto renewal, the reservation renews using the same reservation order ID, and a new reservation doesn't get purchased. You can also choose to replace this reservation with a new reservation purchase in renewal settings and a replacement reservation is purchased when the reservation expires. By default, the replacement reservation has the same attributes as the expiring reservation. You can optionally change the name, billing frequency, term, or quantity in the renewal settings. Any user with owner access on the reservation and the subscription used for billing can set up renewal.

For pricing information, see the [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) page.

You can buy an Azure OpenAI reservation in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). To buy a reservation:

- You must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies). If the setting is disabled, you must be an EA Admin to enable it.
- Direct Enterprise customers can update the **Reserved Instances** policy settings in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure OpenAI Service Provisioned Reservations.

For more information about how enterprise customers and pay-as-you-go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md).

## Choose the right size before purchase

The Azure OpenAI reservation size should be based on the total provisioned throughput units that you consume via deployments. Reservation purchases are made in one provisioned throughput unit increments.

For example, assume that your total consumption of provisioned throughput units is 64 units. You want to purchase a reservation for all of it, so you should purchase 64 of reservation quantity.

## Buy a Microsoft Azure OpenAI reservation

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations** and then select **Azure OpenAI**  
    :::image type="content" source="./media/azure-openai/purchase-openai.png" border="true" alt-text="Screenshot showing the Purchase reservations page." lightbox="./media/azure-openai/purchase-openai.png" :::
3. Select a subscription. Use the Subscription list to choose the subscription that gets used to pay for the reservation. The payment method of the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or pay-as-you-go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For a pay-as-you-go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
4. Select a scope. Use the Scope list to choose a subscription scope. You can change the reservation scope after purchase.
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. If a subscription is moved to different billing context, the benefit no longer applies to the subscription. It continues to apply to other subscriptions in the billing context.
        - For enterprise customers, the billing context is the EA enrollment. The reservation shared scope would include multiple Microsoft Entra tenants in an enrollment.
        - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
        - For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions created by the account administrator.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. The management group scope applies to all subscriptions throughout the entire management group hierarchy. To buy a reservation for a management group, you must have at least read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription.
5. Select a region to choose an Azure region that gets covered by the reservation and select **Add to cart**.  
    :::image type="content" source="./media/azure-openai/select-provisioned-throughput.png" border="true" alt-text="Screenshot showing the Select product to purchase page." lightbox="./media/azure-openai/select-provisioned-throughput.png" :::
6. In the cart, choose the quantity of provisioned throughout units that you want to purchase. For example, a quantity of 64 would cover up to 64 deployed provisioned throughout units every hour.
7. Select **Next: Review + Buy** and review your purchase choices and their prices.
8. Select **Buy now**.
9. After purchase, you can select **View this Reservation** to see your purchase status.

## Cancel, exchange, or refund reservations

You can cancel or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md). However, Exchanges aren't allowed for Azure OpenAI Service Provisioned Reservations.

If you want to request a refund for your Azure OpenAI reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Azure OpenAI reservation that you want to refund and select **Return**.
3. On the Refund reservation page, review the refund amount and select a **Reason for return**.
4. Select **Return reserved instance**.
5. Review the terms and conditions and agree to them.

The refund amount is based on the prorated remaining term and the current price of the reservation. The refund amount is applied as a credit to your Azure account.

After you request a refund, the reservation is canceled and you can view the status of your refund request on the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) page in the Azure portal.

The sum total of all canceled reservation commitment in your billing scope (such as EA, Microsoft Customer Agreement, and Microsoft Partner Agreement) can't exceed USD 50,000 in a 12-month rolling window.

## How reservation discounts apply to Azure OpenAI

After you buy a reservation for Azure OpenAI, the discount associated with the reservation automatically gets applied to any units you deployed in the specified region. As long as they fall within the scope of the reservation. The reservation discount applies to the usage emitted by the provisioned throughput pay-as-you-go meters.

### Reservation discount application

The application of the Azure OpenAI reservation is based on an hourly comparison between the reserved and deployed PTUs. The sum of deployed PTUs up-to the amount reserved are covered (paid for) via the reservation, while any deployed PTUs in excess of the reserved PTUs get charged at the hourly, pay-as-you-go rate. There are a few other points to keep in mind:

- PTUs for partial-hour deployments are pro-rated based on the number of minutes the deployment exists during the hour. For example, a 100 PTU deployment that exists for only 15 minutes of an hour period is considered as a 25 PTU deployment. Specifically, 15 minutes is 1/4 of an hour, so only 1/4 of the deployed PTUs are considered for billing and reservation application during that hour.
- Deployments are matched to reservations based on the reservation scope before the reservation is applied. For example, a reservation scoped to a single subscription only cover deployments within that subscription. Deployments in other subscriptions are charged the hourly, pay-as-you-go rate, unless they're covered by other reservations that have them in scope.

The reservation price assumes a 24x7 deployment of the reserved PTUs. In periods with fewer deployed PTUs than reserved PTUs, all deployed PTUs get covered by the reservation, but the excess reserved PTUs aren't used. These excess reserved PTUs are lost and don't carry over to other periods.

### Discount examples

The following examples show how the Azure OpenAI reservation discount applies, depending on the deployments.

- **Example 1** - A reservation that's exactly the same size as the deployed units. For example, you purchase 100 PTUs on a reservation and you deploy 100 PTUs. In this example, you only pay the reservation price.
- **Example 2** - A reservation that's larger than your deployed units. For example, you purchase 300 PTUs on a reservation and you only deploy 100 PTUs. In this example, the reservation discount is applied to 100 PTUs. The remaining 200 PTUs, in the reservation will go unused, and won't carry forward to future billing periods.
- **Example 3** - A reservation that's smaller than the deployed units. For example, you purchase 200 PTUs on a reservation and you deploy 600 PTUs. In this example, the reservation discount is applied to the 200 PTUs that were used. The remaining 400 PTUs are charged at the pay-as-you-go rate.
- **Example 4** - A reservation that's the same size as the total of two deployments. For example, you purchase 200 PTUs on a reservation and you have two deployments of 100 PTUs each. In this example, the discount is applied to the sum of deployed units.

## Increase the size of an Azure OpenAI reservation

If you want to increase the size of your Azure OpenAI reservation, you can buy more Azure OpenAI Service Provisioned Reservations using the preceding steps.

## Related content

- To learn more about Azure reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)
