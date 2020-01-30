---
title: Save costs
description: Learn how to buy Azure SQL Database reserved capacity to save on your compute costs.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom:
ms.devlang:
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: sstein, carlrab
ms.date: 08/29/2019
---
# Save costs for SQL Database compute resources with Azure SQL Database reserved capacity

Save money with Azure SQL Database by committing to a reservation for compute resources compared to pay-as-you-go prices. With Azure SQL Database reserved capacity, you make a commitment for SQL Database use for a period of one or three years to get a significant discount on the compute costs. To purchase SQL Database reserved capacity, you need to specify the Azure region, deployment type, performance tier, and term.


You do not need to assign the reservation to specific SQL Database instances (single databases, elastic pools, or managed instances). Matching SQL Database instances, that are already running or ones that are newly deployed, will automatically get the benefit. By purchasing a reservation, you are commit to usage for the compute costs for a period of one or three years. As soon as you buy a reservation, the SQL Database compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. A reservation does not cover software, networking, or storage charges associated with the SQL Database instance. At the end of the reservation term, the billing benefit expires and the SQL Databases are billed at the pay-as-you go price. Reservations do not auto-renew. For pricing information, see the [SQL Database reserved capacity offering](https://azure.microsoft.com/pricing/details/sql-database/managed/).

You can buy Azure SQL Database reserved capacity in the [Azure portal](https://portal.azure.com). Pay for the reservation [up front or with monthly payments](../cost-management-billing/reservations/monthly-payments-reservations.md). To buy SQL Database reserved capacity:

- You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase SQL Database reserved capacity.

The details on how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [understand Azure reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Determine the right SQL size before purchase

The size of reservation should be based on the total amount of compute used by the existing or soon-to-be-deployed single databases, elastic pools, or managed instances within a specific region and using the same performance tier and hardware generation.

For example, let's suppose that you are running one general purpose, Gen5 – 16 vCore elastic pool, and two business critical, Gen5 – 4 vCore single databases. Further, let's supposed that you plan to deploy within the next month an additional general purpose, Gen5 – 16 vCore elastic pool, and one business critical, Gen5 – 32 vCore elastic pool. Also, let's suppose that you know that you will need these resources for at least 1 year. In this case, you should purchase a 32 (2x16) vCores, 1 year reservation for single database/elastic pool general purpose - Gen5 and a 40 (2x4 + 32) vCore 1 year reservation for single database/elastic pool business critical - Gen5.

## Buy SQL Database reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the Purchase reservations pane, select **SQL Database** to purchase a new reservation for SQL Database.
4. Fill-in the required fields. Existing or new single databases, elastic pools, or managed instances that match the attributes you select qualify to get the reserved capacity discount. The actual number of your SQL Database instances that get the discount depend on the scope and quantity selected.
    ![Screenshot before submitting the SQL Database reserved capacity purchase](./media/sql-database-reserved-vcores/sql-reserved-vcores-purchase.png)

The following table describes required fields.

| Field      | Description|
|------------|--------------|
|Subscription|The subscription used to pay for the SQL Database reserved capacity reservation. The payment method on the subscription is charged the upfront costs for the SQL Database reserved capacity reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.|
|Scope       |The vCore reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <br/><br/>**Shared**, the vCore reservation discount is applied to SQL Database instances running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.<br/><br/>**Single subscription**, the vCore reservation discount is applied to SQL Database instances in this subscription. <br/><br/>**Single resource group**, the reservation discount is applied to SQL Database instances in the selected subscription and the selected resource group within that subscription.|
|Region      |The Azure region that’s covered by the SQL Database reserved capacity reservation.|
|Deployment Type|The SQL resource type that you want to buy the reservation for.|
|Performance Tier|The service tier for the SQL Database instances.
|Term        |One year or three years.|
|Quantity    |The amount of compute resources being purchased within the SQL Database reserved capacity reservation. The quantity is a number of vCores in the selected Azure region and Performance tier that are being reserved and will get the billing discount. For example, if you are running or planning to run SQL Database instances with the total compute capacity of Gen5 16 vCores in the East US region, then you would specify quantity as 16 to maximize the benefit for all instances. |

1. Review the cost of the SQL Database reserved capacity reservation in the **Costs** section.
1. Select **Purchase**.
1. Select **View this Reservation** to see the status of your purchase.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## vCore size flexibility

vCore size flexibility helps you scale up or down within a performance tier and region, without losing the reserved capacity benefit. SQL Database reserved capacity also provides you with the flexibility to temporarily move your hot databases between pools and single databases as part of your normal operations (within the same region and performance tier) without losing the reserved capacity benefit. By keeping an un-applied buffer in your reservation, you can effectively manage the performance spikes without exceeding your budget.

## Limitation

You cannot reserve DTU-based (basic, standard, or premium) SQL databases.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The vCore reservation discount is applied automatically to the number of SQL Database instances that match the SQL Database reserved capacity reservation scope and attributes. You can update the scope of the SQL Database reserved capacity reservation through [Azure portal](https://portal.azure.com), PowerShell, CLI or through the API.

To learn how to manage the SQL Database reserved capacity reservation, see [manage SQL Database reserved capacity](../cost-management-billing/reservations/manage-reserved-vm-instance.md).

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Manage Azure Reservations](../cost-management-billing/reservations/manage-reserved-vm-instance.md)
- [Understand Azure Reservations discount](../cost-management-billing/reservations/understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)
