---
title: Plan and manage costs
description: Learn how to plan for and manage costs for Azure SQL Database by using cost analysis in the Azure portal.
author: MashaMSFT
ms.author: mathoma
ms.custom: subject-cost-optimization
ms.service: sql-database
ms.subservice: service-overview
ms.topic: how-to
ms.date: 06/30/2021
---

# Plan and manage costs for Azure SQL Database

This article describes how you plan for and manage costs for Azure SQL Database. 

First, you use the Azure pricing calculator to add Azure resources, and review the estimated costs. After you've started using Azure SQL Database resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. Costs for Azure SQL Database are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure SQL Database, you're billed for all Azure services and resources used in your Azure subscription, including any third-party services.


## Prerequisites

Cost analysis supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. 

For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).


## SQL Database initial cost considerations

When working with Azure SQL Database, there are several cost-saving features to consider:

### vCore or DTU purchasing models 

Azure SQL Database supports two purchasing models: vCore and DTU. The way you get charged varies between the purchasing models so it's important to understand the model that works best for your workload when planning and considering costs. For information about vCore and DTU purchasing models, see [Choose between the vCore and DTU purchasing models](purchasing-models.md).

### Provisioned or serverless

In the vCore purchasing model, Azure SQL Database also supports two types of compute tiers: provisioned throughput and serverless. The way you get charged for each compute tier varies so it's important to understand what works best for your workload when planning and considering costs. For details, see [vCore model overview - compute tiers](service-tiers-sql-database-vcore.md#compute-tiers).

In the provisioned compute tier of the vCore-based purchasing model, you can exchange your existing licenses for discounted rates. For details, see [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md).

### Elastic pools

For environments with multiple databases that have varying and unpredictable usage demands, elastic pools can provide cost savings compared to provisioning the same number of single databases. For details, see [Elastic pools](elastic-pool-overview.md).

## Estimate Azure SQL Database costs

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs for different Azure SQL Database configurations. For more information, see [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/azure-sql-database/). 

The information and pricing in the following image are for example purposes only: 

:::image type="content" source="media/cost-management/pricing-calc.png" alt-text="Azure SQL Database pricing calculator example":::

You can also estimate how different Retention Policy options affect cost. The information and pricing in the following image are for example purposes only:

:::image type="content" source="media/cost-management/backup-storage.png" alt-text="Azure SQL Database pricing calculator example for storage":::


## Understand the full billing model for Azure SQL Database

Azure SQL Database runs on Azure infrastructure that accrues costs along with Azure SQL Database when you deploy the new resource. It's important to understand that additional infrastructure might accrue cost.  

Azure SQL Database (except for serverless) is billed on a predictable, hourly rate. If the SQL database is active for less than one hour, you are billed for the highest service tier selected, provisioned storage, and IO that applied during that hour, regardless of usage or whether the database was active for less than an hour.

Billing depends on the SKU of your product, the generation hardware of your SKU, and the meter category. Azure SQL Database has the following possible SKUs:

- Basic (B)
- Standard (S)
- Premium (P)
- General purpose (GP)
- Business critical (BC)
- And for storage: geo-redundant storage (GRS), locally redundant storage (LRS), and zone-redundant storage (ZRS)
- It's also possible to have a deprecated SKU from deprecated resource offerings

To learn more, see [service tiers](service-tiers-general-purpose-business-critical.md). 

The following table shows the most common billing meters and their possible SKUs for **single databases**: 

| Measurement| Possible SKU(s) | Description | 
| :----|:----|:----|
| Backup\* | GP/BC/HS | Measures the consumption of storage used by backups, billed by the amount of storage utilized in GB per month. | 
| Backup (LTR) | GRS/LRS/ZRS/GF | Measures the consumption of storage used by long-term backups configured via long-term retention, billed by the amount of storage utilized. | 
| Compute  | B/S/P/GP/BC  | Measures the consumption of your compute resources per hour. | 
| Compute (primary/named replica) | HS | Measures the consumption of your compute resources per hour of your primary HS replica. 
| Compute (HA replica)             | HS | Measures the consumption of your compute resources per hour of your secondary HS replica. | 
| Compute (ZR add-on)              | GP | Measures the consumption of your compute resources per minute of your zone redundant added-on replica. | 
| Compute (serverless)             | GP | Measures the consumption of your serverless compute resources per minute.  | 
| License | GP/BC/HS | The billing for your SQL Server license accrued per month. | 
| Storage | B/S\*/P\*/G/BC/HS | Billed monthly, by the amount of data stored per hour. |

\* In the DTU purchasing model, an initial set of storage for data and backups is provided at no additional cost. The size of the storage depends on the service tier selected. Extra data storage can be purchased in the standard and premium tiers. For more information, see [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/azure-sql-database/). 

The following table shows the most common billing meters and their possible SKUs for **elastic pools**: 

| Measurement| Possible SKU(s) | Description | 
|:----|:----|:----|
| Backup\* | GP/BC  | Measures the consumption of storage used by backups, billed per GB per hour on a monthly basis. | 
| Compute  | B/S/P/GP/BC | Measures the consumption of your compute resources per hour, such as vCores and memory or DTUs. | 
| License | GP/BC | The billing for your SQL Server license accrued per month. | 
| Storage | B/S\*/P\*/GP/HS | Billed monthly, both by the amount of data stored on the drive using storage space per hour, and the throughput of megabytes per second (MBPS). |

\* In the DTU purchasing model, an initial set of storage for data and backups is provided at no additional cost. The size of the storage depends on the service tier selected. Extra data storage can be purchased in the standard and premium tiers. For more information, see [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/azure-sql-database/). 

### Using Monetary Credit with Azure SQL Database

You can pay for Azure SQL Database charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

## Review estimated costs in the Azure portal

As you go through the process of creating an Azure SQL Database, you can see the estimated costs during configuration of the compute tier. 

To access this screen, select **Configure database** on the **Basics** tab of the **Create SQL Database** page. The information and pricing in the following image are for example purposes only:

  :::image type="content" source="media/cost-management/cost-estimate.png" alt-text="Example showing cost estimate in the Azure portal":::

If your Azure subscription has a spending limit, Azure prevents you from spending over your credit amount. As you create and use Azure resources, your credits are used. When you reach your credit limit, the resources that you deployed are disabled for the rest of that billing period. You can't change your credit limit, but you can remove it. For more information about spending limits, see [Azure spending limit](../../cost-management-billing/manage/spending-limit.md).

## Monitor costs

As you start using Azure SQL Database, you can see the estimated costs in the portal. Use the following steps to review the cost estimate:

1. Sign into the Azure portal and navigate to the resource group for your Azure SQL database. You can locate the resource group by navigating to your database and select **Resource group** in the **Overview** section.
1. In the menu, select **Cost analysis**.
1. View **Accumulated costs** and set the chart at the bottom to **Service name**. This chart shows an estimate of your current SQL Database costs. To narrow costs for the entire page to Azure SQL Database, select **Add filter** and then, select **Azure SQL Database**. The information and pricing in the following image are for example purposes only:

   :::image type="content" source="media/cost-management/cost-analysis.png" alt-text="Example showing accumulated costs in the Azure portal":::

From here, you can explore costs on your own. For more and information about the different cost analysis settings, see [Start analyzing costs](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Create budgets

You can create [budgets](../../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources. For more about the filter options when you create a budget, see [Group and filter options](../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need to do further data analysis on cost. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs for Azure SQL Database

Azure SQL Database also enables you to scale resources up or down to control costs based on your application needs. For details, see [Dynamically scale database resources](scale-resources.md).

Save money by committing to a reservation for compute resources for one to three years. For details, see [Save costs for resources with reserved capacity](reserved-capacity-overview.md).


## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/learn/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.