---
title: Reserved compute pricing - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Prepay for Azure Database for PostgreSQL - Hyperscale (Citus) compute resources with reserved capacity.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 06/15/2020
---

# Prepay for Azure Database for PostgreSQL - Hyperscale (Citus) compute resources with reserved capacity

Azure Database for PostgreSQL – Hyperscale (Citus) now helps you save money by prepaying for compute resources compared to pay-as-you-go prices. With Hyperscale (Citus) reserved capacity, you make an upfront commitment on Hyperscale (Citus) server group for a one- or three-year period to get a significant discount on the compute costs. To purchase Hyperscale (Citus) reserved capacity, you need to specify the Azure region, reservation term, and billing frequency.

> [!IMPORTANT]
> This article is about reserved capacity for Azure Database for PostgreSQL – Hyperscale (Citus). For information about reserved capacity for Azure Database for PostgreSQL – Single Server, see [Prepay for Azure Database for PostgreSQL – Single Server compute resources with reserved capacity](/azure/postgresql/concept-reserved-pricing).

You don't need to assign the reservation to specific Hyperscale (Citus) server groups. An already running Hyperscale (Citus) server group or ones that are newly deployed automatically get the benefit of reserved pricing. By purchasing a reservation, you're prepaying for the compute costs for one year or three years. As soon as you buy a reservation, the Hyperscale (Citus) compute charges that match the reservation attributes are no longer charged at the pay-as-you-go rates. 

A reservation doesn't cover software, networking, or storage charges associated with the Hyperscale (Citus) server groups. At the end of the reservation term, the billing benefit expires, and the Hyperscale (Citus) server groups are billed at the pay-as-you go price. Reservations don't autorenew. For pricing information, see the [Azure Database for PostgreSQL – Hyperscale (Citus) reserved capacity offering](https://azure.microsoft.com/pricing/details/postgresql/hyperscale-citus/).

You can buy Hyperscale (Citus) reserved capacity in the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](https://docs.microsoft.com/azure/cost-management-billing/reservations/monthly-payments-reservations). To buy the reserved capacity:

* You must be in the owner role for at least one Enterprise Agreement (EA) or individual subscription with pay-as-you-go rates.
* For Enterprise Agreement subscriptions, **Add Reserved Instances** must be enabled in the [EA Portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an Enterprise Agreement admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Hyperscale (Citus) reserved capacity.

For information on how Enterprise Agreement customers and pay-as-you-go customers are charged for reservation purchases, see:
- [Understand Azure reservation usage for your Enterprise Agreement enrollment](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea)
- [Understand Azure reservation usage for your pay-as-you-go subscription](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage)

## Determine the right server group size before purchase

The size of reservation is based on the total amount of compute used by the existing or soon-to-be-deployed coordinator and worker nodes in Hyperscale (Citus) server groups within a specific region.

For example, let's suppose you're running one Hyperscale (Citus) server group with 16 vCore coordinator and three 8 vCore worker nodes. Further, let's assume you plan to deploy within the next month an additional Hyperscale (Citus) server group with a 32 vCore coordinator and two 4 vCore worker nodes. Let's also suppose  you need these resources for at least one year.

In this case, purchase a one-year reservation for:

* Total 16 vCores + 32 vCores = 48 vCores for coordinator nodes
* Total 3 nodes x 8 vCores + 2 nodes x 4 vCores = 24 + 8 = 32 vCores for worker nodes

## Buy Azure Database for PostgreSQL reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **All services** > **Reservations**.
1. Select **Add**. In the **Purchase reservations** pane, select **Azure Database for PostgreSQL** to purchase a new reservation for your PostgreSQL databases.
1. Select the **Hyperscale (Citus) Compute** type to purchase, and click **Select**.
1. Review the quantity for the selected compute type on the **Products** tab.
1. Continue to the **Buy + Review** tab to finish your purchase.

The following table describes required fields.

| Field        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subscription | The subscription used to pay for the Azure Database for PostgreSQL reserved capacity reservation. The payment method on the subscription is charged the upfront costs for the Azure Database for PostgreSQL reserved capacity reservation. The subscription type must be an Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an Enterprise Agreement subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.                                                                                  |
| Scope        | The vCore reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select **Shared**, the vCore reservation discount is applied to Hyperscale (Citus) server groups running in any subscriptions within your billing context. For Enterprise Agreement customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions created by the account administrator. If you select **Single subscription**, the vCore reservation discount is applied to Hyperscale (Citus) server groups in this subscription. If you select **Single resource group**, the reservation discount is applied to Hyperscale (Citus) server groups in the selected subscription and the selected resource group within that subscription. |
| Region       | The Azure region that's covered by the Azure Database for PostgreSQL – Hyperscale (Citus) reserved capacity reservation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Term         | One year or three years.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Quantity     | The amount of compute resources being purchased within the Hyperscale (Citus) reserved capacity reservation. In particular, the number of coordinator or worker node vCores in the selected Azure region that are being reserved and which will get the billing discount. For example, if you're running (or plan to run) Hyperscale (Citus) server groups with the total compute capacity of 64 coordinator node vCores and 32 worker node vCores in the East US region, specify the quantity as 64 and 32 for coordinator and worker nodes, respectively, to maximize the benefit for all servers.                                                                                                                                                                                                                                                     |



## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure reservations](https://docs.microsoft.com/azure/billing/billing-azure-reservations-self-service-exchange-and-refund).

## vCore size flexibility

vCore size flexibility helps you scale up or down coordinator and worker nodes within a region, without losing the reserved capacity benefit.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the number of Hyperscale (Citus) server groups that match the Azure Database for PostgreSQL reserved capacity reservation scope and attributes. You can update the scope of the Azure Database for PostgreSQL – Hyperscale (Citus) reserved capacity reservation through the Azure portal, PowerShell, the Azure CLI, or the API.

To learn more about Azure reservations, see the following articles:

* [What are Azure reservations?](https://docs.microsoft.com/azure/billing/billing-save-compute-costs-reservations)
* [Manage Azure reservations](https://docs.microsoft.com/azure/billing/billing-manage-reserved-vm-instance)
* [Understand the Azure reservation discount](https://docs.microsoft.com/azure/billing/billing-understand-reservation-charges)
* [Understand reservation usage for your pay-as-you-go subscription](https://docs.microsoft.com/azure/billing/billing-understand-reservation-charges-postgresql)
* [Understand reservation usage for your Enterprise Agreement enrollment](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea)
* [Azure reservations in the Partner Center Cloud Solution Provider program](https://docs.microsoft.com/partner-center/azure-reservations)
