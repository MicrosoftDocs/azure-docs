---
title: Save costs with Microsoft Azure AI Foundry Provisioned Throughput Reservations
description: Save costs with Microsoft Azure AI Foundry Provisioned Throughput Reservations by committing to a reservation for your provisioned throughput units.
author: pri-mittal
ms.reviewer: benshy, primittal, liuyizhu
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 07/08/2025
ms.author: primittal
# customer intent: As a billing administrator, I want to learn about saving costs with Microsoft Azure AI Foundry Provisioned Throughput Reservations and buy one.
---

# Save costs with Microsoft Azure AI Foundry Provisioned Throughput Reservations

You can save money on Azure AI Foundry Provisioned Throughput by committing to a reservation for your provisioned throughput units (PTUs) usage for models available in Azure AI Foundry Models for a duration of one month or one year. This article explains how you can save money with Azure AI Foundry Provisioned Throughput Reservations.

To purchase an Azure AI Foundry Provisioned Throughput Reservation, you choose an Azure region, quantity, and the deployment type that you want covered. Then add the Azure AI Foundry Provisioned Throughput SKU (Global, Data Zone, or Regional) to your cart. Then verify the quantity of Azure AI Foundry Provisioned Throughput units that you want to purchase and complete your order.

When you purchase a reservation, the Azure AI Foundry Provisioned Throughput usage that matches the reservation attributes is no longer charged at the hourly rates.

>[!NOTE]
>Reservations for Global, Data Zone, and Regional deployments aren't interchangeable. You need to purchase a separate reservation for each deployment type. As an example, if you purchase a reservation for Global the benefit will only apply to Global deployments and not to Data Zone or Regional.
>
>You can exchange or cancel reservations for Global, Data Zone, and Regional deployment with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

## Reservation application

A reservation applies to provisioned deployments only and doesn't include other offerings such as standard deployments or fine tuning. Azure AI Foundry Provisioned Throughput Reservations also don't guarantee capacity availability. To ensure capacity availability, the recommended best practice is to create your deployments before you buy your reservation.

When the reservation expires, Azure AI Foundry Provisioned Throughput deployments continue to run but are billed at the hourly rate. 

## Renewal options

You can choose to enable automatic renewal of reservations by selecting the option in the renewal settings or at time of purchase. With Azure AI Foundry Provisioned Throughput Reservation auto renewal, the reservation renews using the same reservation order ID, and a new reservation doesn't get purchased. You can also choose to replace this reservation with a new reservation purchase in renewal settings, and a replacement reservation is purchased when the reservation expires. By default, the replacement reservation has the same attributes as the expiring reservation but will be set to auto-renew off by default. You can optionally change the name, billing frequency, term, or quantity in the renewal settings. Any user with owner access on the reservation and the subscription used for billing can set up renewal. When the reservation is set to auto-renew on same reservation order ID, the auto-renew of this reservation is set to auto-renew on until you choose to set it off. At time of purchase, if you have chosen to set auto-renewal on, for 1-month term the reservation automatically renews on same reservation order ID, while 1-year term will result in purchasing a replacement reservation.

## Prerequisites

You can buy an Azure AI Foundry Provisioned Throughput reservation in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). To buy a reservation:

- You must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies). If the setting is disabled, you must be an EA Admin to enable it.
- Direct Enterprise customers can update the **Reserved Instances** policy settings in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure AI Foundry Provisioned Throughput Reservations.

For more information about how enterprise customers and pay-as-you-go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md).

## Choose the right size and deployment type before purchase

The Azure AI Foundry Provisioned Throughput reservation size should be based on the total provisioned throughput units that you consume via deployments by models available in Azure AI Foundry Models. Reservation purchases are made in one provisioned throughput unit increments.

For example, assume you deployed 100 units of the Provisioned Regional deployment type and 50 units of Provisioned Global deployment type. In this example, you should purchase a Provisioned Managed Regional reservation for a quantity of 100 units and a Provisioned Managed Global reservation for a quantity of 50 units to cover all your deployed PTUs.

> [!CAUTION]
> Capacity availability for model deployments is dynamic and changes frequently across regions and models. To prevent buying a reservation for more PTUs than you can use, create deployments first. Then buy the reservation to cover the PTUs you deployed. This best practice ensures that you maximize the reservation discount and helps to prevent you from purchasing a term commitment that you can’t fully use.

## Buy a Microsoft Azure AI Foundry Provisioned Throughput reservation

When you buy a reservation, the current UTC date and time are used to record the transaction.

To buy an Azure AI Foundry Provisioned Throughput reservation, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations** and then select **Azure AI Foundry Provisioned Throughput**  
    :::image type="content" source="./media/azure-openai/purchase-azure-ai.png" border="true" alt-text="Screenshot showing the Purchase reservations page." lightbox="./media/azure-openai/purchase-azure-ai.png" :::
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
5. Select a region to choose an Azure region that gets covered by the reservation.
6. Select the products to cover your deployment type (Global, Data Zone, or Regional) and select **Add to cart**.  
    :::image type="content" source="./media/azure-openai/select-provisioned-throughput.jpeg" border="true" alt-text="Screenshot showing the Select product to purchase page." lightbox="./media/azure-openai/select-provisioned-throughput.jpeg" :::
7. In the cart, choose the quantity of provisioned throughput units that you want to purchase. For example, a quantity of 64 would cover up to 64 deployed provisioned throughput units every hour.
8. Select **Next: Review + Buy** and review your purchase choices and their prices.
9. Select **Buy now**.
10. After purchase, you can select **View this Reservation** to see your purchase status.

## Cancel, exchange, or refund reservations

You can exchange or cancel reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

When you exchange an Azure AI Foundry Provisioned Throughput reservation, you can change the following attributes:
- **Region**: Exchange a reservation from one Azure region to another
- **Deployment type**: Exchange between Global, Data Zone, or Regional deployment types
- **Term**: Change from one-month to one-year term, or from one-year to one-month term
- **Payment option**: Change between upfront and monthly payment options

>[!NOTE]
>When exchanging for a different region, deployment type, term, or payment option, the term is reset for the new reservation.

If you want to exchange your Azure AI Foundry Provisioned Throughput reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Azure AI Foundry Provisioned Throughput reservation that you want to refund and select **Exchange**.
3. Select the new reservation to purchase.
4. Review the terms and conditions and agree to them.

If you want to request a refund for your Azure AI Foundry Provisioned Throughput reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Azure AI Foundry Provisioned Throughput reservation that you want to refund and select **Return**.
3. On the Refund reservation page, review the refund amount and select a **Reason for return**.
4. Select **Return reserved instance**.
5. Review the terms and conditions and agree to them.

The refund amount is based on the prorated remaining term and the current price of the reservation. The refund amount is applied as a credit to your Azure account.

After you request a refund, the reservation is canceled and you can view the status of your refund request on the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) page in the Azure portal.

The sum total of all canceled reservation commitment in your billing scope (such as EA, Microsoft Customer Agreement, and Microsoft Partner Agreement) can't exceed USD 50,000 in a 12-month rolling window.

## How reservation discounts apply to models available in Azure AI Foundry Models

After you buy a reservation for Azure AI Foundry Provisioned Throughput, the discount associated with the reservation automatically gets applied to any units that are deployed in the specified region of the models available in Azure AI Foundry Models, as long as they fall within the scope of the reservation. The reservation discount applies to the usage emitted by the provisioned throughput pay-as-you-go meters.

>[!NOTE]
>Reservations for Global, Data Zone, and Regional deployments aren't interchangeable. You must purchase a separate reservation for each deployment type.

### Reservation discount application

The application of the Azure AI Foundry Provisioned Throughput reservation is based on an hourly comparison between the reserved and deployed PTUs of the models available in Azure AI Foundry Models. The sum of deployed PTUs up-to the amount reserved are covered (paid for) via the reservation, while any deployed PTUs more than the reserved PTUs get charged at the hourly, pay-as-you-go rate. There are a few other points to keep in mind:

- PTUs for partial-hour deployments are pro-rated based on the number of minutes the deployment exists during the hour. For example, a 100 PTU deployment that exists for only 15 minutes of an hour period is considered as a 25 PTU deployment. Specifically, 15 minutes is 1/4 of an hour, so only 1/4 of the deployed PTUs are considered for billing and reservation application during that hour.
- Deployments are matched to reservations based on the reservation scope before the reservation is applied. For example, a reservation scoped to a single subscription only covers deployments within that subscription. Deployments in other subscriptions are charged at the hourly pay-as-you-go rate, unless they're covered by other reservations that have them in scope.

The reservation price assumes a 24x7 deployment of the reserved PTUs. In periods with fewer deployed PTUs than reserved PTUs, all deployed PTUs get covered by the reservation, but the excess reserved PTUs aren't used. These excess reserved PTUs are lost and don't carry over to other periods.

>[!NOTE]
>The application of the Azure AI Foundry Provisioned Throughput reservation works on models available in Azure AI Foundry Models (e.g. Azure OpenAI Service, DeepSeek, etc.) For the list of the Azure AI Foundry Models, please refer to [Azure AI Foundry Models pricing page](https://azure.microsoft.com/pricing/details/phi-3/#pricing). 

### Discount examples

The following examples show how the Azure AI Foundry Provisioned Throughput reservation discount applies, depending on the deployments.

**Example 1** - A regional reservation that's exactly the same size as the regional deployed units. For example, you purchase 100 PTUs on a regional reservation and you deploy 100 regional PTUs. In this example, you only pay the reservation price.

**Example 2** - A global reservation that's larger than your global deployed units. For example, you purchase 300 PTUs on a global reservation and you only deploy 100 global PTUs. In this example, the global reservation discount is applied to 100 global PTUs. The remaining 200 PTUs, in the global reservation will go unused, and won't carry forward to future billing periods.

**Example 3** - A data zone reservation that's smaller than the data zone deployed units. For example, you purchase 200 PTUs on a data zone reservation and you deploy 600 data zone PTUs. In this example, the data zone reservation discount is applied to the 200 data zone PTUs that were used. The remaining 400 data zone  PTUs are charged at the pay-as-you-go rate.

**Example 4** - A regional reservation that's the same size as the total of two regional  deployments. For example, you purchase 200 regional PTUs on a reservation and you have two deployments of 100 regional PTUs each. In this example, the discount is applied to the sum of deployed units.

## Increase Azure AI Foundry Provisioned Throughput reservation

You can't change the size of a purchased reservation. If you want to increase your Azure AI Foundry Provisioned Throughput reservation capacity to cover more hourly PTUs, you can buy more Azure AI Foundry Provisioned Throughput reservations or exchange the existing reservation with the quantity you need.

## Monthly amortized costs

Your amortized reservation cost is based on each calendar month. So, based on each month of the year, your daily amortized cost can change. Here's an example that explains how your monthly amortized cost might differ:

**Example 1** - If you buy a reservation January 10, the renewal is as follows:
- Month 1: January 10 - February 9 (inclusive)
- Month 2: February 10 – March 9 (inclusive), and so on

**Example 2** - If you buy a reservation on December 29, 30, or 31 then the renewal date changes over the course of a year. For example, assume that you buy a reservation on December 30.
- Month 1: December 30 - January 29 (inclusive)
- Month 2: January 30 – February 27 (inclusive) – for a non leap year
- Month 3: February 28 – March 27 (inclusive), and so on

If your cost for a monthly reservation is $200 and:
- The reservation was purchased in May, then you see daily the amortized cost of $200/*31*.
- The reservation was purchased in February, then you see a daily amortized cost of $200/*28*.

## Related content

- To learn more about Azure reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)
