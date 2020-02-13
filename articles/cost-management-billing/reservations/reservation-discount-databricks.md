---
title: How an Azure Databricks pre-purchase discount is applied
description: Learn how an Azure Databricks pre-purchase discount applies to your usage.
services: billing
author: yashesvi
manager: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 10/01/2019
ms.author: banders
---

# How Azure Databricks pre-purchase discount is applied

You can use pre-purchased Azure Databricks commit units (DBCU) at any time during the purchase term. Any Azure Databricks usage is deducts from the pre-purchased DBCUs automatically.

Unlike VMs, pre-purchased units don't expire on an hourly basis. You can use them at any time during the term of the purchase. To get the pre-purchase discounts, you don't need to redeploy or assign a pre-purchased plan to your Azure Databricks workspaces for the usage.

The pre-purchase discount applies only to Azure Databricks unit (DBU) usage. Other charges such as compute, storage, and networking are charged separately.

## Pre-purchase discount application

Databricks pre-purchase applies to all Databricks workloads and tiers. You can think of the pre-purchase as a pool of pre-paid Databricks commit units. Usage is deducted from the pool, regardless of the workload or tier. Usage is deducted in the following ratio:

| **Workload** | **DBU application ratio — Standard tier** | **DBU application ratio — Premium tier** |
| --- | --- | --- |
| Data Analytics | 0.4 | 0.55 |
| Data Engineering | 0.15 | 0.30 |
| Data Engineering Light | 0.07 | 0.22 |

For example, when a quantity of Data Analytics – Standard tier is consumed, the pre-purchased Databricks commit units is deducted by 0.4 units. When a quantity of Data Engineering Light – Standard tier is used, the pre-purchased Databricks commit unit is deducted by 0.07 units

## Determine plan use

To determine your DBCU plan use, go to the Azure portal > **Reservations** and click the purchased Databricks plan. Your utilization to-date is shown with any remaining units. For more information about determining your reservation use, see the [See reservation usage](reservation-apis.md#see-reservation-usage) article.

## How discount application shows in usage data

When the pre-purchase discount applies to your Databricks usage, on-demand charges appear as zero in the usage data. For more information about reservation costs and usage, see [Get Enterprise Agreement reservation costs and usage](understand-reserved-instance-usage-ea.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about pre-purchasing Azure Databricks to save money, see [Optimize Azure Databricks costs with a pre-purchase](prepay-databricks-reserved-capacity.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
  - [Understand reservation usage for a subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
