---
title: Pricing – Azure Cosmos DB for PostgreSQL
description: Pricing and how to save with Azure Cosmos DB for PostgreSQL
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 02/02/2022
---

# Pricing for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

For the most up-to-date general pricing information, see the service
[pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/postgresql/).
To see the cost for the configuration you want, the
[Azure portal](https://portal.azure.com/#create/Microsoft.DocumentDB)
shows the monthly cost on the **Configure** tab based on the options you
select. If you don't have an Azure subscription, you can use the Azure pricing
calculator to get an estimated price. On the
[Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)
website, select **Add items**, expand the **Databases** category, and choose
**Azure Cosmos DB for PostgreSQL** to customize the
options.

## Prepay for compute resources with reserved capacity

Azure Cosmos DB for PostgreSQL now helps you save money by prepaying for compute resources compared to pay-as-you-go prices. With Azure Cosmos DB for PostgreSQL reserved capacity, you make an upfront commitment on cluster for a one- or three-year period to get a significant discount on the compute costs. To purchase Azure Cosmos DB for PostgreSQL reserved capacity, you need to specify the Azure region, reservation term, and billing frequency.

You don't need to assign the reservation to specific clusters. An already running cluster or ones that are newly deployed automatically get the benefit of reserved pricing. By purchasing a reservation, you're prepaying for the compute costs for one year or three years. As soon as you buy a reservation, the Azure Cosmos DB for PostgreSQL compute charges that match the reservation attributes are no longer charged at the pay-as-you-go rates. 

A reservation doesn't cover software, networking, or storage charges associated with the clusters. At the end of the reservation term, the billing benefit expires, and the clusters are billed at the pay-as-you go price. Reservations don't autorenew. For pricing information, see the [Azure Cosmos DB for PostgreSQL reserved capacity offering](https://azure.microsoft.com/pricing/details/cosmos-db/postgresql/).

You can buy Azure Cosmos DB for PostgreSQL reserved capacity in the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](../../cost-management-billing/reservations/prepare-buy-reservation.md). To buy the reserved capacity:

* You must be in the owner role for at least one Enterprise Agreement (EA) or individual subscription with pay-as-you-go rates.
* For Enterprise Agreement subscriptions, **Add Reserved Instances** must be enabled in the [EA Portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an Enterprise Agreement admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Cosmos DB for PostgreSQL reserved capacity.

For information on how Enterprise Agreement customers and pay-as-you-go customers are charged for reservation purchases, see:
- [Understand Azure reservation usage for your Enterprise Agreement enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
- [Understand Azure reservation usage for your pay-as-you-go subscription](../../cost-management-billing/reservations/understand-reserved-instance-usage.md)

### Determine the right cluster size before purchase

The size of reservation is based on the total amount of compute used by the existing or soon-to-be-deployed coordinator and worker nodes in clusters within a specific region.

For example, let's suppose you're running one cluster with 16 vCore coordinator and three 8 vCore worker nodes. Further, let's assume you plan to deploy within the next month an additional cluster with a 32 vCore coordinator and two 4 vCore worker nodes. Let's also suppose  you need these resources for at least one year.

In this case, purchase a one-year reservation for:

* Total 16 vCores + 32 vCores = 48 vCores for coordinator nodes
* Total 3 nodes x 8 vCores + 2 nodes x 4 vCores = 24 + 8 = 32 vCores for worker nodes

### Buy Azure Cosmos DB for PostgreSQL reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **All services** > **Reservations**.
1. Select **Add**. In the **Purchase reservations** pane, select **Azure Cosmos DB for PostgreSQL** to purchase a new reservation for your PostgreSQL databases.
1. Select the **Azure Cosmos DB for PostgreSQL Compute** type to purchase, and click **Select**.
1. Review the quantity for the selected compute type on the **Products** tab.
1. Continue to the **Buy + Review** tab to finish your purchase.

The following table describes required fields.

| Field        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subscription | The subscription used to pay for the Azure Cosmos DB for PostgreSQL reserved capacity reservation. The payment method on the subscription is charged the upfront costs for the Azure Cosmos DB for PostgreSQL reserved capacity reservation. The subscription type must be an Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an Enterprise Agreement subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.                                                                                  |
| Scope        | The vCore reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select **Shared**, the vCore reservation discount is applied to clusters running in any subscriptions within your billing context. For Enterprise Agreement customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions created by the account administrator. If you select **Management group**, the reservation discount is applied to clusters running in any subscriptions that are a part of both the management group and billing scope. If you select **Single subscription**, the vCore reservation discount is applied to clusters in this subscription. If you select **Single resource group**, the reservation discount is applied to clusters in the selected subscription and the selected resource group within that subscription. |
| Region       | The Azure region that's covered by the Azure Cosmos DB for PostgreSQL reserved capacity reservation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Term         | One year or three years.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Quantity     | The amount of compute resources being purchased within the Azure Cosmos DB for PostgreSQL reserved capacity reservation. In particular, the number of coordinator or worker node vCores in the selected Azure region that are being reserved and which will get the billing discount. For example, if you're running (or plan to run) clusters with the total compute capacity of 64 coordinator node vCores and 32 worker node vCores in the East US region, specify the quantity as 64 and 32 for coordinator and worker nodes, respectively, to maximize the benefit for all servers.                                                                                                                                                                                                                                                     |



### Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

### vCore size flexibility

vCore size flexibility helps you scale up or down coordinator and worker nodes within a region, without losing the reserved capacity benefit.

### Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the number of clusters that match the Azure Cosmos DB for PostgreSQL reserved capacity reservation scope and attributes. You can update the scope of the Azure Cosmos DB for PostgreSQL reserved capacity reservation through the Azure portal, PowerShell, the Azure CLI, or the API.

To learn more about Azure reservations, see the following articles:

* [What are Azure reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
* [Manage Azure reservations](../../cost-management-billing/reservations/manage-reserved-vm-instance.md)
* [Understand reservation usage for your Enterprise Agreement enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
