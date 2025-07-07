---
title: Save for Azure App Service with reserved capacity
description: Learn how you can save costs for Azure App Service Premium v3 and Isolated v2 reserved instances.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 03/26/2025
ms.author: primittal
ms.custom: references_regions
---

# Save costs with Azure App Service reserved instances

This article explains how you can save with Azure App Service reserved instances for Premium v3 and Isolated v2 instances.

## Save with reserved instances

When you commit to an Azure App Service Premium v3 or Isolatec v2 reserved instance you can save money. The reservation discount is applied automatically to the number of running instances that match the reservation scope and attributes. You don't need to assign a reservation to an instance to get the discounts.

## Determine the right reserved instance size before you buy

Before you buy a reservation, you should determine the size of the reserved instance that you need. The following sections will help you determine the right reserved instance size.

### Use reservation recommendations

You can use reservation recommendations to help determine the reservations you should purchase.

- Purchase recommendations and recommended quantities are shown when you purchase a Premium v3 reserved instance in the Azure portal.
- Azure Advisor provides purchase recommendations for individual subscriptions.
- You can use the APIs to get purchase recommendations for both shared scope and single subscription scope.
- For Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) customers, purchase recommendations for shared and single subscription scopes are available with the [Azure Consumption Insights Power BI content pack](/power-bi/service-connect-to-azure-consumption-insights).

### Analyze your usage information

Analyze your usage information to help determine which reservations you should purchase. Usage data is available in the usage file and APIs. Use them together to determine which reservation to purchase. Check for instances that have high usage on daily basis to determine the quantity of reservations to purchase.

Your usage file shows your charges by billing period and daily usage. For information about downloading your usage file, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md). Then, by using the usage file information, you can [determine what reservation to purchase](determine-reservation-purchase.md).

## Buy a Premium v3 reserved instance

You can buy a reserved Premium v3 reserved instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). These requirements apply to buying a Premium v3 reserved instance:

- To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.
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
| Term | One year or three years. |
| Quantity | The number of instances being purchased within the reservation. The quantity is the number of running Premium v3 reserved instances that can get the billing discount. For example, if you are running 10 Premium v3 reserved instances in the East US, then you would specify quantity as 10 to maximize the benefit for all running Premium v3 reserved instances. |

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
| Term | One year or three years. |
| Quantity | The number of instances being purchased within the reservation. The quantity is the number of running Isolated v2 reserved instances that can get the billing discount. For example, if you are running 10 Isolated v2 reserved instances in the East US, then you would specify quantity as 10 to maximize the benefit for all running Isolated v2 reserved instances. |

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
