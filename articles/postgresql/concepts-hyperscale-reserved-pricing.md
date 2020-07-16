---
title: Reserved compute pricing - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Prepay for Azure Database for PostgreSQL - Hyperscale (Citus) compute resources with reserved capacity
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
> This page is about reserved capacity for Azure Database
> for PostgreSQL – Hyperscale (Citus). See [this
> page](/azure/postgresql/concept-reserved-pricing) for information
> about reserved capacity for Azure Database for PostgreSQL – Single
> server.

You don't need to assign the reservation to specific Hyperscale (Citus) server groups. An already running Hyperscale (Citus) server group or ones that are newly deployed will automatically get the benefit of reserved pricing. By purchasing a reservation, you're pre-paying for the compute costs for a period of one or three years. As soon as you buy a reservation, the Hyperscale (Citus) compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. A reservation does not cover software, networking, or storage charges associated with the Hyperscale (Citus) server groups. At the end of the reservation term, the billing benefit expires, and the Hyperscale (Citus) server groups are billed at the pay-as-you go price. Reservations do not autorenew. For pricing information, see the [Azure Database for PostgreSQL – Hyperscale (Citus) reserved capacity offering](https://azure.microsoft.com/pricing/details/postgresql/hyperscale-citus/).

You can buy Hyperscale (Citus) reserved capacity in the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](https://docs.microsoft.com/azure/cost-management-billing/reservations/monthly-payments-reservations). To buy the reserved capacity:

* You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Hyperscale (Citus) reserved capacity.

For details on how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea) and [understand Azure reservation usage for your Pay-As-You-Go subscription](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage).

## Determine the right server group size before purchase

The size of reservation should be based on the total amount of compute used by the existing or soon-to-be-deployed coordinator and worker nodes in Hyperscale (Citus) server groups within a specific region.

For example, let's suppose that you are running one Hyperscale (Citus) server group with 16 vCore coordinator and three 8 vCore worker nodes. Further, let’s assume that you plan to deploy within next month an additional Hyperscale (Citus) server group with a 32 vCore coordinator and two 4 vCore worker nodes. Let’s suppose that you will need these resources for at least one year.

In this case, you should purchase one-year reservation for

* Total 16 vCores + 32 vCores= 48 vCores for coordinator nodes
* Total three nodes x 8 vCores + 2 nodes x 4 vCores = 24 + 8 = 32 vCores for worker nodes

## Buy Azure Database for PostgreSQL reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** and then, in the Purchase reservations pane, select **Azure Database for PostgreSQL** to purchase a new reservation for your PostgreSQL databases.
4. Select Hyperscale (Citus) Compute type to purchase and click the **Select** button.
5. Review the quantity for selected compute type on the **Products** tab.
4. Proceed to the **Buy + Review** tab to complete your purchase.

The following table describes required fields.

| Field        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subscription | The subscription used to pay for the Azure Database for PostgreSQL reserved   capacity reservation. The payment method on the subscription is charged the   upfront costs for the Azure Database for PostgreSQL reserved capacity         reservation. The subscription type must be an enterprise agreement (offer     numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with        pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an   enterprise subscription, the charges are deducted from the enrollment's       monetary commitment balance or charged as overage. For an individual          subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.                                                                                  |
| Scope        | The vCore reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <br><br> **Shared,** the vCore reservation discount is applied to Hyperscale (Citus) server groups running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment.  For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator. <br><br> **Single subscription,** the vCore reservation discount is applied to Hyperscale (Citus) server groups in this subscription. <br><br> **Single resource group,** the reservation discount is applied to Hyperscale (Citus) server groups in the selected subscription and the selected resource group within that subscription. |
| Region       | The Azure region that’s covered by the Azure Database for PostgreSQL – Hyperscale (Citus) reserved capacity reservation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Term         | One-year or three-years.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Quantity     | The amount of compute resources being purchased within the Hyperscale (Citus)  reserved capacity reservation. In particular, the number of coordinator or worker node vCores in the selected Azure region that are being reserved and which will get the billing discount. For example, if you're running (or planning to run) Hyperscale (Citus) server groups with the total compute capacity of 64 coordinator node vCores and 32 worker node vCores in the East US region, then you'd specify quantity as 64 and 32 for coordinator and worker nodes respectively to maximize the benefit for all servers.                                                                                                                                                                                                                                                     |



## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](https://docs.microsoft.com/azure/billing/billing-azure-reservations-self-service-exchange-and-refund).

## vCore size flexibility

vCore size flexibility helps you scale up or down coordinator and worker nodes within a region, without losing the reserved capacity benefit.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the number of Hyperscale (Citus) server groups that match the Azure Database for PostgreSQL reserved capacity reservation scope and attributes. You can update the scope of the Azure database for PostgreSQL – Hyperscale (Citus) reserved capacity reservation through Azure portal, PowerShell, CLI or through the API.

To learn more about Azure Reservations, see the following articles:

* [What are Azure Reservations?](https://docs.microsoft.com/azure/billing/billing-save-compute-costs-reservations)
* [Manage Azure Reservations](https://docs.microsoft.com/azure/billing/billing-manage-reserved-vm-instance)
* [Understand Azure Reservations discount](https://docs.microsoft.com/azure/billing/billing-understand-reservation-charges)
* [Understand reservation usage for your Pay-As-You-Go subscription](https://docs.microsoft.com/azure/billing/billing-understand-reservation-charges-postgresql)
* [Understand reservation usage for your Enterprise enrollment](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea)
* [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)
