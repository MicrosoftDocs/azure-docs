---
title: Prepay for compute with reserved capacity - Azure Database for MySQL flexible server
description: Prepay for Azure Database for MySQL flexible server compute resources with reserved capacity
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: mksuni
ms.author: sumuth
ms.date: 06/20/2022
---

# Prepay for Azure Database for MySQL - Flexible Server compute resources with reserved instances

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL flexible server now helps you save money by prepaying for compute resources compared to pay-as-you-go prices. With Azure Database for MySQL flexible server reserved instances, you make an upfront commitment on Azure Database for MySQL flexible server for a one or three year period to get a significant discount on the compute costs. To purchase Azure Database for MySQL flexible server reserved capacity, you need to specify the Azure region, deployment type, performance tier, and term.

## How does the instance reservation work?
You don't need to assign the reservation to specific Azure Database for MySQL flexible server instances. An already running Azure Database for MySQL flexible server instance or ones that are newly deployed automatically get the benefit of reserved pricing. By purchasing a reservation, you're pre-paying for the compute costs for a period of one or three years. As soon as you buy a reservation, the Azure Database for MySQL flexible server compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. A reservation doesn't cover software, networking, or storage charges associated with Azure Database for MySQL flexible server. At the end of the reservation term, the billing benefit expires, and Azure Database for MySQL flexible server is billed at the pay-as-you go price. Reservations don't auto-renew. For pricing information, see the [Azure Database for MySQL flexible server reserved capacity offering](https://azure.microsoft.com/pricing/details/mysql/).

You can buy Azure Database for MySQL flexible server reserved capacity in the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](../../cost-management-billing/reservations/prepare-buy-reservation.md). To buy the reserved capacity:

* You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Database for MySQL flexible server reserved capacity. </br>

The details on how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [understand Azure reservation usage for your Pay-As-You-Go subscription](../../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Reservation exchanges and refunds

You can exchange a reservation for another reservation of the same type. You can also exchange a reservation from Azure Database for MySQL - Single Server with one for Azure Database for MySQL flexible server. It's also possible to refund a reservation, if you no longer need it. The Azure portal can be used to exchange or refund a reservation. For more information, see [Self-service exchanges and refunds for Azure Reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Reservation discount

You may save up to 67% on compute costs with reserved instances. In order to find the discount for your case, please visit the [Reservation blade on the Azure portal](https://aka.ms/reservations) and check the savings per pricing tier and per region. Reserved instances help you manage your workloads, budget, and forecast better with an upfront payment for a one-year or three-year term. You can also exchange or cancel reservations as business needs change.


## Determine the right database size before purchase

The size of reservation should be based on the total amount of compute used by the existing or soon-to-be-deployed server within a specific region and using the same performance tier and hardware generation.</br>

For example, let's suppose that you're running one general purpose, Gen5 – 32 vCore Azure Database for MySQL flexible server database, and two memory optimized, Gen5 – 16 vCore Azure Database for MySQL flexible server databases. Further, let's supposed that you plan to deploy within the next month an additional general purpose, Gen5 – 32 vCore database server, and one memory optimized, Gen5 – 16 vCore database server. Let's suppose that you know that you'll need these resources for at least 1 year. In this case, you should purchase a 64 (2x32) vCores, 1 year reservation for single database general purpose - Gen5 and a 48 (2x16 + 16) vCore 1 year reservation for single database memory optimized - Gen5.


## Buy Azure Database for MySQL reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the Purchase reservations pane, select **Azure Database for MySQL** to purchase a new reservation for your Azure Database for MySQL flexible server databases.
4. Fill-in the required fields. Existing or new databases that match the attributes you select qualify to get the reserved capacity discount. The actual number of your Azure Database for MySQL flexible server instances that get the discount depend on the scope and quantity selected.


:::image type="content" source="media/concepts-reserved-pricing/mysql-reserved-price.png" alt-text="Overview of reserved pricing":::


The following table describes required fields.

| Field | Description |
| :------------ | :------- |
| Subscription   | The subscription used to pay for the Azure Database for MySQL flexible server reserved capacity reservation. The payment method on the subscription is charged the upfront costs for the Azure Database for MySQL flexible server reserved capacity reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.
| Scope | The vCore reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select: </br></br> **Shared**, the vCore reservation discount is applied to Azure Database for MySQL flexible server instances running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</br></br> **Single subscription**, the vCore reservation discount is applied to Azure Database for MySQL flexible server instances in this subscription. </br></br> **Single resource group**, the reservation discount is applied to Azure Database for MySQL flexible server instances in the selected subscription and the selected resource group within that subscription.
| Region | The Azure region that's covered by the Azure Database for MySQL flexible server reserved capacity reservation.
| Deployment Type | The Azure Database for MySQL flexible server resource type that you want to buy the reservation for.
| Performance Tier | The service tier for the Azure Database for MySQL flexible server instances.
| Term | One year or three years
| Quantity | The amount of compute resources being purchased within the Azure Database for MySQL reserved capacity reservation. The quantity is a number of vCores in the selected Azure region and Performance tier that are being reserved and will get the billing discount. For example, if you're running or planning to run Azure Database for MySQL flexible server instances with the total compute capacity of Gen5 16 vCores in the East US region, then you would specify quantity as 16 to maximize the benefit for all servers.

## Reserved instances API support

Use Azure APIs to programmatically get information for your organization about Azure service or software reservations. For example, use the APIs to:

- Find reservations to buy
- Buy a reservation
- View purchased reservations
- View and manage reservation access
- Split or merge reservations
- Change the scope of reservations

For more information, see [APIs for Azure reservation automation](../../cost-management-billing/reservations/reservation-apis.md).

## vCore size flexibility

vCore size flexibility helps you scale up or down within a performance tier and region, without losing the reserved capacity benefit. 

## How to view reserved instance purchase details

You can view your reserved instance purchase details via the [Reservations menu on the left side of the Azure portal](https://aka.ms/reservations). For more information, see [How a reservation discount is applied to Azure Database for MySQL flexible server](../../cost-management-billing/reservations/understand-reservation-charges-mysql.md).

## Reserved instance expiration

You receive email notifications, the first one 30 days prior to reservation expiry and the other one at expiration. Once the reservation expires, deployed VMs will continue to run and be billed at a pay-as-you-go rate. For more information, see [Reserved Instances for Azure Database for MySQL flexible server](../../cost-management-billing/reservations/understand-reservation-charges-mysql.md).

## Need help ? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the number of Azure Database for MySQL flexible server instances that match the Azure Database for MySQL flexible server reserved capacity reservation scope and attributes. You can update the scope of the Azure Database for MySQL flexible server reserved capacity reservation through the Azure portal, PowerShell, Azure CLI, or through the API. 

To learn more about Azure Reservations, see the following articles:

* [What are Azure Reservations](../../cost-management-billing/reservations/save-compute-costs-reservations.md)?
* [Manage Azure Reservations](../../cost-management-billing/reservations/manage-reserved-vm-instance.md)
* [Understand Azure Reservations discount](../../cost-management-billing/reservations/understand-reservation-charges.md)
* [Understand reservation usage for your Pay-As-You-Go subscription](../../cost-management-billing/reservations/understand-reservation-charges-mysql.md)
* [Understand reservation usage for your Enterprise enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
* [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
