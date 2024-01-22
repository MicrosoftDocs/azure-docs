---
title: Save costs with reserved capacity
description: Learn how to buy SQL Server Managed Instance enabled by Azure Arc reserved capacity to save costs.
services: sql-database
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
ms.topic: conceptual
author: anosov1960 
ms.author: sashan
ms.reviewer: mikeray
ms.date: 10/27/2021
---

# Reserved capacity - SQL Server Managed Instance enabled by Azure Arc

Save money with SQL Managed Instance enabled by Azure Arc by committing to a reservation for Azure Arc services compared to pay-as-you-go prices. With reserved capacity, you make a commitment for SQL Managed Instance enabled by Azure Arc use for one or three years to get a significant discount on the service fee. To purchase reserved capacity, you need to specify the Azure region, deployment type, performance tier, and term.

You do not need to assign the reservation to a specific database or managed instance. Matching existing deployments that are already running or ones that are newly deployed automatically get the benefit. By purchasing a reservation, you commit to usage for the Azure Arc services cost for one or three years. As soon as you buy a reservation, the service charges that match the reservation attributes are no longer charged at the pay-as-you go rates. 

A reservation applies to Azure Arc services cost only and does not cover SQL IP costs or any other charges. At the end of the reservation term, the billing benefit expires and the managed instance is billed at the pay-as-you go price. Reservations do not automatically renew. For pricing information, see the [reserved capacity offering](https://azure.microsoft.com/pricing/details/sql-database/managed/).

You can buy reserved capacity in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/reservationsBrowse). Pay for the reservation [up front or with monthly payments](../../cost-management-billing/reservations/prepare-buy-reservation.md). To buy reserved capacity:

- You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription. Reserved capacity.

For more information about how enterprise customers and pay-as-you-go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your Pay-As-You-Go subscription](../../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Determine correct size before purchase

The size of reservation should be based on the total amount of compute resources measured in vCores used by the existing or soon-to-be-deployed managed instances within a specific region reservation scope.

The following list demonstrates a scenario to project how you would reserve resources: 

* **Current**: 
  - One General Purpose, 16 vCore managed instance
  - Two Business Critical, 8-vCore managed instances

* **In the next year you will add**: 
  - One more General Purpose, 16 vCore managed instance
  - One more Business Critical, 32 vCore managed instance

* **Purchase a reservations for**:
  - 32 (2x16) vCore one year reservation for General Purpose managed instance
  - 48 (2x8 + 32) vCore one year reservation for Business Critical managed instance 

## Buy reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the **Purchase Reservations** pane, select **SQL Managed Instance** to purchase a new reservation for SQL Managed Instance enabled by Azure Arc.
4. Fill in the required fields. Existing SQL Managed Instance resources that match the attributes you select qualify to get the reserved capacity discount. The actual number of databases or managed instances that get the discount depends on the scope and quantity selected.

    The following table describes required fields.
    
    | Field      | Description|
    |------------|--------------|
    |Subscription|The subscription used to pay for the capacity reservation. The payment method on the subscription is charged the upfront costs for the reservation. The subscription type must be an enterprise agreement (offer number MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer number MS-AZR-0003P or MS-AZR-0023P). For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.|
    |Scope       |The vCore reservation's scope can cover one subscription or multiple subscriptions (shared scope). If you select <br/><br/>**Shared**, the vCore reservation discount is applied to the database or managed instance running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.<br/><br/>**Single subscription**, the vCore reservation discount is applied to the databases or managed instances in this subscription. <br/><br/>**Single resource group**, the reservation discount is applied to managed instances in the selected subscription in the selected subscription and the selected resource group within that subscription.</br></br>**Management group**, the reservation discount is applied to the managed instances in the list of subscriptions that are a part of both the management group and billing scope.|
    |Region      |The Azure region that's covered by the capacity reservation.|
    |Deployment type|The SQL resource type that you want to buy the reservation for.|
    |Performance Tier|The service tier for the databases or managed instances. |
    |Term        |One year or three years.|
    |Quantity    |The amount of compute resources being purchased within the capacity reservation. The quantity is the number of vCores in the selected Azure region and Performance tier that are being reserved and will get the billing discount. For example, if you run or plan to run multiple managed instances with the total compute capacity of Gen5 16 vCores in the East US region, then specify the quantity as 16 to maximize the benefit for all the databases. |

1. Review the cost of the capacity reservation in the **Costs** section.
1. Select **Purchase**.
1. Select **View this Reservation** to see the status of your purchase.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## vCore size flexibility

vCore size flexibility helps you scale up or down within a performance tier and region, without losing the reserved capacity benefit. By keeping an unapplied buffer in your reservation, you can effectively manage the performance spikes without exceeding your budget.

## Limitation

Reserved capacity pricing is only supported for features and products that are in General Availability state. 

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

The vCore reservation discount is applied automatically to the number of managed instances that match the capacity reservation scope and attributes. You can update the scope of the capacity reservation through the [Azure portal](https://portal.azure.com), PowerShell, Azure CLI, or the API.

To learn about service tiers for SQL Managed Instance enabled by Azure Arc, see [SQL Managed Instance enabled by Azure Arc service tiers](service-tiers.md).

- For information on Azure SQL Managed Instance service tiers for the vCore model, see [Azure SQL Managed Instance - Compute Hardware in the vCore Service Tier](/azure/azure-sql/managed-instance/service-tiers-managed-instance-vcore)

To learn how to manage the capacity reservation, see [manage reserved capacity](../../cost-management-billing/reservations/manage-reserved-vm-instance.md).

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Manage Azure Reservations](../../cost-management-billing/reservations/manage-reserved-vm-instance.md)
- [Understand Azure Reservations discount](../../cost-management-billing/reservations/understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](../../cost-management-billing/reservations/understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](../../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
