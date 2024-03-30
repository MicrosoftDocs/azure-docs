---
title: Save for Azure App Service with reserved capacity
description: Learn how you can save costs for Azure App Service Premium v3 and Isolated v2 reserved instances and Isolated Stamp Fees.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 02/14/2024
ms.author: banders
ms.custom: references_regions
---

# Save costs with Azure App Service reserved instances

This article explains how you can save with Azure App Service reserved instances for Premium v3 and Isolated v2 instances and Isolated Stamp Fees.

## Save with Premium v3 reserved instances

When you commit to an Azure App Service Premium v3 reserved instance you can save money. The reservation discount is applied automatically to the number of running instances that match the reservation scope and attributes. You don't need to assign a reservation to an instance to get the discounts.

## Determine the right reserved instance size before you buy

Before you buy a reservation, you should determine the size of the Premium v3 reserved instance that you need. The following sections will help you determine the right Premium v3 reserved instance size.

### Use reservation recommendations

You can use reservation recommendations to help determine the reservations you should purchase.

- Purchase recommendations and recommended quantities are shown when you purchase a Premium v3 reserved instance in the Azure portal.
- Azure Advisor provides purchase recommendations for individual subscriptions.
- You can use the APIs to get purchase recommendations for both shared scope and single subscription scope. For more information, see [Reserved instance purchase recommendation APIs for enterprise customers](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation).
- For Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) customers, purchase recommendations for shared and single subscription scopes are available with the [Azure Consumption Insights Power BI content pack](/power-bi/service-connect-to-azure-consumption-insights).

### Analyze your usage information

Analyze your usage information to help determine which reservations you should purchase. Usage data is available in the usage file and APIs. Use them together to determine which reservation to purchase. Check for Premium v3 instances that have high usage on daily basis to determine the quantity of reservations to purchase.

Your usage file shows your charges by billing period and daily usage. For information about downloading your usage file, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md). Then, by using the usage file information, you can [determine what reservation to purchase](determine-reservation-purchase.md).

## Buy a Premium v3 reserved instance

You can buy a reserved Premium v3 reserved instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). These requirements apply to buying a Premium v3 reserved instance:

- You must be in an Owner role for at least one EA subscription or a subscription with a pay-as-you-go rate.
- For EA subscriptions, the **Reserved Instances** option must be enabled in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can buy reservations.

To buy an instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** to purchase a new reservation and then select **Instance**.
4. Enter required fields. Running Premium v3 reserved instances that match the attributes you select qualify for the reservation discount. The actual number of your Premium v3 reserved instances that get the discount depend on the scope and quantity selected.

If you have an EA agreement, you can use the **Add more option** to quickly add additional instances. The option isn't available for other subscription types.

| **Field** | **Description** |
|---|---|
| Subscription | The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P). The charges are deducted from the monetary commitment balance, if available, or charged as overage. For a subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription. |
| Scope | The reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>**Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only. </li><li>**Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.</li><li>**Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.</li><li>**Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.</li></ul> |
| Region | The Azure region that's covered by the reservation. |
| Premium v3 reserved instance size | The size of the Premium v3 reserved instances. |
| Term | One year or three years. There's also a 5-year term available only for HBv2 Premium v3 reserved instances. |
| Quantity | The number of instances being purchased within the reservation. The quantity is the number of running Premium v3 reserved instances that can get the billing discount. For example, if you are running 10 Standard\_D2 Premium v3 reserved instances in the East US, then you would specify quantity as 10 to maximize the benefit for all running Premium v3 reserved instances. |

## Buy an Isolated v2 reserved instance

You can buy a reserved Isolated v2 reserved instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). These requirements apply to buying a Isolated v2 reserved instance:

- You must be in an Owner role for at least one EA subscription or a subscription with a pay-as-you-go rate.
- For EA subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can buy reservations.

To buy an instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** to purchase a new reservation and then select **Instance**.
4. Enter required fields. Running Isolated v2 reserved instances that match the attributes you select qualify for the reservation discount. The actual number of your Isolated v2 reserved instances that get the discount depend on the scope and quantity selected.

If you have an EA agreement, you can use the **Add more option** to quickly add additional instances. The option isn't available for other subscription types.

| **Field** | **Description** |
| --- | --- |
| Subscription | The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P). The charges are deducted from the monetary commitment balance, if available, or charged as overage. For a subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription. |
| Scope | The reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select:<UL><LI>**Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.</li><li>**Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.</li><li>**Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.</li><li>**Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.</li></ul> |
| Region | The Azure region that's covered by the reservation. |
| Isolated v2 reserved instance size | The size of the Isolated v2 reserved instances. |
| Term | One year or three years. There's also a 5-year term available only for HBv2 Isolated v2 reserved instances. |
| Quantity | The number of instances being purchased within the reservation. The quantity is the number of running Isolated v2 reserved instances that can get the billing discount. For example, if you are running 10 Standard\_D2 Isolated v2 reserved instances in the East US, then you would specify quantity as 10 to maximize the benefit for all running Isolated v2 reserved instances. |

## Save with Isolated Stamp Fees

You can save money on Azure App Service Isolated Stamp Fees by committing to a reservation for your stamp usage for a duration of three years. To purchase Isolated Stamp Fee reserved capacity, you need to choose the Azure region where the stamp will be deployed and the number of stamps to purchase.

When you purchase a reservation, the Isolated Stamp Fee usage that matches the reservation attributes is no longer charged at the pay-as-you go rates. The reservation is applied automatically to the number of Isolated stamps that match the reserved capacity scope and region. You don't need to assign a reservation to an isolated stamp. The reservation doesn't apply to workers, so any other resources associated with the stamp are charged separately.

When the reserved capacity expires, Isolated Stamps continue to run but they're billed at the pay-as-you go rate. Reservations don't renew automatically.

## Determine the right Isolated Stamp reservation to purchase

By purchasing a reservation, you're committing to using reserved quantities over next three years. Check your usage data to determine how many App Service Isolated Stamps you're consistently using and might use in the future.

Additionally, make sure you understand how the Isolated Stamp emits Linux or Windows meter.

- By default, an empty Isolated Stamp emits the Windows stamp meter. For example, with no workers deployed. It continues to emit this meter if Windows workers are deployed on the stamp.
- The meter changes to the Linux stamp meter if you deploy a Linux worker.
- In cases where both Linux and Windows workers are deployed, the stamp emits the Windows meter.

So, the stamp meter can change between Windows and Linux over the life of the stamp.

Buy Windows stamp reservations if you have one or more Windows workers on the stamp. The only time you should purchase a Linux stamp reservation is if you plan to _only_ have Linux workers on the stamp.

## Buy Isolated Stamp reserved capacity

You can buy Isolated Stamp reserved capacity in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22AppService%22%7D). Pay for the reservation [up front or with monthly payments](./prepare-buy-reservation.md). To buy reserved capacity, you must have the owner role for at least one enterprise subscription or an individual subscription with pay-as-you-go rates.

- For Enterprise subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies). Or, if the setting is disabled, you must be an EA Admin.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Synapse Analytics reserved capacity.

**To Purchase:**

1. Go to the  [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22AppService%22%7D).
1. Select a subscription. Use the **Subscription** list to choose the subscription that's used to pay for the reserved capacity. The payment method of the subscription is charged the costs for the reserved capacity. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (offer numbers: MS-AZR-0003P or MS-AZR-0023P) or a CSP subscription.
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
1. Select a **Scope** to choose a subscription scope.
    - **Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select a **Region** to choose an Azure region that's covered by the reserved capacity and add the reservation to the cart.
1. Select an Isolated Plan type and then select **Select**.  
    :::image type="content" border="true" source="./media/prepay-app-service/app-service-isolated-stamp-select.png" alt-text="Screenshot showing select an isolated plan.":::
1. Enter the quantity of App Service Isolated stamps to reserve. For example, a quantity of three would give you three reserved stamps a region. Select **Next: Review + Buy**.
1. Review and select **Buy now**.

After purchase, go to [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) to view the purchase status and monitor it at any time.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

## Discount application shown in usage data

Your usage data has an effective price of zero for the usage that gets a reservation discount. The usage data shows the reservation discount for each stamp instance in each reservation.

For more information about how reservation discount shows in usage data, see [Get Enterprise Agreement reservation costs and usage](understand-reserved-instance-usage-ea.md) if you're an Enterprise Agreement (EA) customer. Otherwise see, [Understand Azure reservation usage for your individual subscription with pay-as-you-go rates](understand-reserved-instance-usage.md).

## Next steps

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Understand how an Azure App Service Isolated Stamp reservation discount is applied](reservation-discount-app-service.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
