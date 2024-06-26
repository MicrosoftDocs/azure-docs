---
title: Prepay for Azure Database for PostgreSQL - Flexible Server compute resources with reserved capacity
description: Learn about reserved compute pricing and how to purchase Azure Database for PostgreSQL flexible server reserved capacity.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Prepay for Azure Database for PostgreSQL - Flexible Server compute resources with reserved capacity

[!INCLUDE [applies-to-postgresql-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL flexible server helps you save money by prepaying for compute resources, compared to pay-as-you-go prices. With Azure Database for PostgreSQL flexible server reserved capacity, you make an upfront commitment on Azure Database for PostgreSQL flexible server for a one-year or three-year period. This commitment gives you a significant discount on the compute costs.

To purchase Azure Database for PostgreSQL flexible server reserved capacity, you need to specify the Azure region, deployment type, performance tier, and term.

## How instance reservations work

You don't need to assign the reservation to specific Azure Database for PostgreSQL flexible server instances. An already running Azure Database for PostgreSQL flexible server instance (or one that's newly deployed) automatically gets the benefit of reserved pricing.

By purchasing a reservation, you're prepaying for the compute costs for one or three years. As soon as you buy a reservation, the Azure Database for PostgreSQL flexible server compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates.

A reservation doesn't cover software, networking, or storage charges associated with the Azure Database for PostgreSQL flexible server instances. At the end of the reservation term, the billing benefit expires, and the vCores that Azure Database for PostgreSQL flexible server instances use are billed at the pay-as-you go price. Reservations don't automatically renew. For pricing information, see the [Azure Database for PostgreSQL reserved capacity offering](https://azure.microsoft.com/pricing/details/postgresql/).

> [!IMPORTANT]
> Reserved capacity pricing is available for [Azure Database for PostgreSQL single server](../single-server/overview-single-server.md) and [Azure Database for PostgreSQL flexible server](overview.md) deployment options.

> Starting July 1st, 2024, new reservations will not be available for Azure Database for PostgreSQL single server. Your existing single server reservations remain valid, and you can still purchase reservations for Azure Database for PostgreSQL flexible server.

You can buy Azure Database for PostgreSQL flexible server reserved capacity in the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](../../cost-management-billing/reservations/prepare-buy-reservation.md). To buy the reserved capacity:

* To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.
* For EA subscriptions, **Add Reserved Instances** must be turned on in the [EA portal](https://ea.azure.com/). Or, if that setting is off, you must be an EA admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Database for PostgreSQL flexible server reserved capacity.

For details on how enterprise customers and pay-as-you-go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise Agreement enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your pay-as-you-go subscription](../../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Reservation exchanges and refunds

You can exchange a reservation for another reservation of the same type. You can also exchange a reservation from Azure Database for PostgreSQL single server with Azure Database for PostgreSQL flexible server. It's also possible to refund a reservation, if you no longer need it.

You can use the Azure portal to exchange or refund a reservation. For more information, see [Self-service exchanges and refunds for Azure reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Reservation discount

You can save up to 65% on compute costs with reserved instances. To find the discount for your case, go to the [Reservation pane on the Azure portal](https://aka.ms/reservations) and check the savings per pricing tier and per region.

Reserved instances help you manage your workloads, budget, and forecast better with an upfront payment for a one-year or three-year term. You can also exchange or cancel reservations as business needs change.

## Determining the right server size before purchase

You should base the size of a reservation on the total amount of compute that the existing or soon-to-be-deployed servers use within a specific region at the same performance tier and hardware generation.

For example, suppose that:

* You're running one general-purpose Gen5 32-vCore PostgreSQL database, and two memory-optimized Gen5 16-vCore PostgreSQL databases.
* Within the next month, you plan to deploy another general-purpose Gen5 8-vCore database server and one memory-optimized Gen5 32-vCore database server.
* You know that you need these resources for at least one year.

In this case, you should purchase both:

* A 40-vCore (32 + 8), one-year reservation for single-database general-purpose Gen5
* A 64-vCore (2x16 + 32) one-year reservation for single-database memory-optimized Gen5

## Procedure for buying Azure Database for PostgreSQL flexible server reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add**. On the **Purchase reservations** pane, select **Azure Database for PostgreSQL** to purchase a new reservation for your Azure Database for PostgreSQL flexible server databases.
4. Fill in the required fields. Existing or new databases that match the attributes you select qualify to get the reserved capacity discount. The actual number of your Azure Database for PostgreSQL flexible server instances that get the discount depends on the selected scope and quantity.

:::image type="content" source="media/concepts-reserved-pricing/postgresql-reserved-price.png" alt-text="Screenshot that shows an overview of reserved pricing.":::

The following table describes the required fields.

| Field | Description |
| :------------ | :------- |
| **Billing subscription**   | The subscription that you use to pay for the Azure Database for PostgreSQL reserved capacity.</br></br> The payment method on the subscription is charged the upfront costs for the Azure Database for PostgreSQL flexible server reserved capacity. The subscription type must be Enterprise Agreement (offer number: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer number: MS-AZR-0003P or MS-AZR-0023P).</br></br> For an EA subscription, the charges are deducted from the enrollment's Azure prepayment (previously called *monetary commitment*) balance or are charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription. |
| **Scope** | The vCore reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select: </br></br>**Shared**, the vCore reservation discount is applied to Azure Database for PostgreSQL flexible server instances running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions that the account administrator created. </br></br>**Management group**, the reservation discount is applied to Azure Database for PostgreSQL flexible server instances running in any subscriptions that are a part of both the management group and the billing scope. </br></br>**Single subscription**, the vCore reservation discount is applied to Azure Database for PostgreSQL flexible server instances in this subscription. </br></br>**Single resource group**, the reservation discount is applied to Azure Database for PostgreSQL flexible server instances in the selected subscription and the selected resource group within that subscription.|
| **Region** | The Azure region that the Azure Database for PostgreSQL flexible server reserved capacity covers.|
| **Deployment Type** | The Azure Database for PostgreSQL flexible server resource type that you want to buy the reservation for.|
| **Performance Tier** | The service tier for the Azure Database for PostgreSQL flexible server instances.|
| **Term** | One year.|
| **Quantity** | The amount of compute resources being purchased within the Azure Database for PostgreSQL flexible server reserved capacity. The quantity is a number of vCores in the selected Azure region and performance tier that are being reserved and that get the billing discount. For example, if you're running or planning to run Azure Database for PostgreSQL flexible server instances with the total compute capacity of Gen5 16 vCores in the East US region, you would specify the quantity as 16 to maximize the benefit for all servers.|

## API support for reserved instances

Use Azure APIs to programmatically get information for your organization about Azure service or software reservations. For example, use the APIs to:

* Find reservations to buy.
* Buy a reservation.
* View purchased reservations.
* View and manage reservation access.
* Split or merge reservations.
* Change the scope of reservations.

For more information, see [APIs for Azure reservation automation](../../cost-management-billing/reservations/reservation-apis.md).

## vCore size flexibility

vCore size flexibility helps you scale up or down within a performance tier and region, without losing the reserved capacity benefit. If you scale to higher vCores than your reserved capacity, you're billed for the excess vCores at pay-as-you-go pricing.

## How to view reserved instance purchase details

You can view your reserved instance purchase details via the [Reservations item on the left side of the Azure portal](https://aka.ms/reservations).

## Reserved instance expiration

You receive an email notification 30 days before a reservation expires and another notification at expiration. After the reservation expires, deployed virtual machines continue to run and be billed at a pay-as-you-go rate.

## Support

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the Azure Database for PostgreSQL flexible server instances that match the Azure Database for PostgreSQL flexible server reserved capacity scope and attributes. You can update the scope of the Azure Database for PostgreSQL flexible server reserved capacity through the Azure portal, PowerShell, the Azure CLI, or the APIs.

To learn more about Azure reservations, see the following articles:

* [What are Azure reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
* [Manage Azure reservations](../../cost-management-billing/reservations/manage-reserved-vm-instance.md)
* [Understand Azure reservation discounts](../../cost-management-billing/reservations/understand-reservation-charges.md)
* [Understand reservation usage for your Enterprise Agreement enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
* [Azure reservations in the Partner Center CSP program](/partner-center/azure-reservations)
