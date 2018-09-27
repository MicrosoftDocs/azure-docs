---
title: Prepay for Azure SQL Database vCores to save money | Microsoft Docs
description: Learn how to buy Azure SQL Database reserved capacity to save on your compute costs.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 09/20/2018

---
# Prepay for SQL Database compute resources with Azure SQL Database reserved capacity

Save money with Azure SQL Database by prepaying for Azure SQL Database compute resources compared to pay-as-you-go prices. With Azure SQL Database reserved capacity, you make an upfront commitment on SQL Database for a period of one or three years to get a significant discount on the compute costs. To purchase SQL Database reserved capacity, you need to specify the Azure region, deployment type, performance tier, and term. 

You do not need to assign the reservation to SQL Database instances. Matching SQL Database instances, that are already running or ones that are newly deployed, will automatically get the benefit. By purchasing a reservation, you are pre-paying for the compute costs for the SQL Database instances for a period of one or three years. As soon as you buy a reservation, the SQL Database compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. A reservation does not cover software, networking, or storage charges associated with the SQL Database instance. At the end of the reservation term, the billing benefit expires and the SQL Databases are billed at the pay-as-you go price. Reservations do not auto-renew. For pricing information, see the [SQL Database reserved capacity offering](https://azure.microsoft.com/pricing/details/sql-database/managed/).

You can buy Azure SQL Database reserved capacity in the [Azure portal](https://portal.azure.com). To buy SQL Database reserved capacity:
- You must be in the Owner role for at least one Enterprise or Pay-As-You-Go subscription.
- For Enterprise subscriptions, Azure reservation purchases must be enabled in the [EA portal](https://ea.azure.com).
-  For Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase SQL Database reserved capacity.

The details on how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](../billing/billing-understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your Pay-As-You-Go subscription](../billing/billing-understand-reserved-instance-usage.md).

## Determine the right SQL size before purchase

The size of reservation should be based on the total amount of compute used by the existing or soon-to-be-deployed SQL single databases and/or elastic pools within a specific region and using the same performance tier and hardware generation. 

For example, let's suppose that you are running one general purpose, Gen5 – 16 vCore elastic pool, and two business critical, Gen5 – 4 vCore single databases. Further, let's supposed that you plan to deploy within the next month an additional general purpose, Gen5 – 16 vCore elastic pool, and one business critical, Gen5 – 32 vCore elastic pool. Also, let's suppose that you know that you will need these resources for at least 1 year. In this case you should purchase a 32 (2x16) vCores, 1 year reservation for SQL Database Single/Elastic Pool General Purpose - Compute Gen5 and a 40 (2x4 + 32) vCore 1 year reservation for SQL Database Single/Elastic Pool Business Critical - Compute Gen5.

## Buy SQL Database reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the Select Product Type pane, select **SQL Database** to purchase a new reservation for SQL Database.
4. Fill in the required fields. Existing or new single databases or elastic pools that match the attributes you select qualify to get the reserved capacity discount. The actual number of your SQL Database instances that get the discount depend on the scope and quantity selected.

   ![Screenshot before submitting the SQL Database reserved capacity purchase](./media/sql-database-reserved-vcores/sql-reserved-vcores-purchase.png)

    | Field      | Description|
    |:------------|:--------------|
    |Name        |The name of this reservation.| 
    |Subscription|The subscription used to pay for the SQL Database reserved capacity reservation. The payment method on the subscription is charged the upfront costs for the SQL Database reserved capacity reservation. The subscription type must be an enterprise agreement (offer number: MS-AZR-0017P) or Pay-As-You-Go (offer number: MS-AZR-0003P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.|    
    |Scope       |The vCore reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>Single subscription - The vCore reservation discount is applied to SQL Database instances in this subscription. </li><li>Shared - The vCore reservation discount is applied to SQL Database instances running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions (except dev/test subscriptions) within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</li></ul>|
    |Region      |The Azure region that’s covered by the SQL Database reserved capacity reservation.|    
    |Deployment Type|The SQL resource type that you want to buy the reservation for.|
    |Performance Tier|The service tier for the SQL Database instances.
    |Term        |One year or three years.|
    |Quantity    |The number of instances being purchased within the SQL Database reserved capacity reservation. The quantity is the number of running SQL Database instances that can get the billing discount. For example, if you are running 10 SQL Database instances in the East US, then you would specify quantity as 10 to maximize the benefit for all running machines. |

5. Review the cost of the SQL Database reserved capacity reservation in the **Costs** section.
6. Select **Purchase**.
7. Select **View this Reservation** to see the status of your purchase.

## Cancellations and exchanges

If you need to cancel your SQL Database reserved capacity reservation, there may be a 12% early termination fee. Refunds are based on the lowest price of either your purchase price or the current price of the reservation. Refunds are limited to $50,000 per year. The refund you receive is the remaining pro-rated balance minus the 12% early termination fee. To request a cancellation, go to the reservation in the Azure portal and select **Refund** to create a support request.

If you need to change your SQL Database reserved capacity reservation to another region, deployment type, performance tier, or term, you can exchange it for another reservation that's of equal or greater value. The term start date for the new reservation doesn't carry over from the exchanged reservation. The 1 or 3 year term starts from when you create the new reservation. To request an exchange, go to the reservation in the Azure portal, and select **Exchange** to create a support request.

## vCore size flexibility

vCore size flexibility helps you scale up or down within a performance tier and region, without losing the reserved capacity benefit. SQL Database reserved capacity also provides you with the flexibility to temporarily move your hot databases between pools and single databases as part of your normal operations (within the same region and performance tier) without losing the reserved capacity benefit. By keeping an un-applied buffer in your reservation, you can effectively manage the performance spikes without exceeding your budget.

## Next steps

The vCore reservation discount is applied automatically to the number of SQL Database instances that match the SQL Database reserved capacity reservation scope and attributes. You can update the scope of the SQL Database reserved capacity reservation through [Azure portal](https://portal.azure.com), PowerShell, CLI or through the API. 

To learn how to manage the SQL Database reserved capacity reservation, see [Manage SQL Database reserved capacity](../billing/billing-manage-reserved-vm-instance.md).

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](../billing/billing-save-compute-costs-reservations.md)
- [Manage Azure Reservations](../billing/billing-manage-reserved-vm-instance.md)
- [Understand Azure Reservations discount](../billing/billing-understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](../billing/billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](../billing/billing-understand-reserved-instance-usage-ea.md)
- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

