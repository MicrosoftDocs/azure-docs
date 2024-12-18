---
title: How an Azure Databricks pre-purchase discount is applied
description: Learn how an Azure Databricks pre-purchase discount applies to your usage. You can use Databricks prepurchased units at any time during the purchase term.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2024
ms.author: banders
---

# How Azure Databricks pre-purchase discount is applied

You can use prepurchased Azure Databricks commit units (DBCU) at any time during the purchase term. Any Azure Databricks usage is deducted from the prepurchased DBCUs automatically.

Unlike VMs, prepurchased units don't expire on an hourly basis. You can use them at any time during the term of the purchase. To get the prepurchase discounts, you don't need to redeploy or assign a prepurchased plan to your Azure Databricks workspaces for the usage.

The prepurchase discount applies only to Azure Databricks unit (DBU) usage. Other charges such as compute, storage, and networking are charged separately.

## Prepurchase discount application

Databricks pre-purchase applies to all Databricks workloads and tiers. You can think of the prepurchase as a pool of prepaid Databricks commit units. 

>[!NOTE]
> Usage is deducted from the pool, regardless of the workload or tier. Usage is deducted at various rates, depending on the workload and tier. For more information and a complete list of rates, see the [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).

## Determine plan use

To determine your DBCU plan use, go to the Azure portal > **Reservations** and select the purchased Databricks plan. Your utilization to-date is shown with any remaining units. For more information about determining your reservation use, see the [Reservation usage](reservation-apis.md#see-reservation-usage) article.

## How discount application shows in usage data

When the prepurchase discount applies to your Databricks usage, on-demand charges appear as zero in the usage data. For more information about reservation costs and usage, see [Get Enterprise Agreement reservation costs and usage](understand-reserved-instance-usage-ea.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about prepurchasing Azure Databricks to save money, see [Optimize Azure Databricks costs with a prepurchase](prepay-databricks-reserved-capacity.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
  - [Understand reservation usage for a subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
