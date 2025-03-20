---
title: Plan to manage costs for Azure Storage Actions
description: Learn how to plan for and manage costs for Azure Storage Actions by using cost analysis in the Azure portal.
author: normesta
ms.author: normesta
ms.custom: subject-cost-optimization
ms.service: azure-storage-actions
ms.topic: how-to
ms.date: 03/07/2025
---

# Plan to manage costs for Azure Storage Actions

This article describes how you plan for and manage costs for Azure Storage Actions.

Before you deploy the service, you can use the Azure pricing calculator to estimate costs for Azure Storage Actions. After you've started using Azure Storage Actions resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. 

Costs for Azure Storage Actions are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure Storage Actions, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure Storage Actions

- Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add Azure Storage Actions.

Image goes here

## Understand the full billing model for Azure Storage Actions

Your charged the billing meters for Storage Actions as well as the cost of operations performed on storage accounts.  

### Azure Storage Actions meters

Meters apply only when an assignment is executed. Validating a storage task by using the preview capability is free.

| Meter | Unit | Description |
|---|---|---| 
| Task execution instance charge | Per run / per instance | This meter is applied to each assignment execution. If you've schedule a task assignment to run repeatedly, this charge is incurred for each run. |
| Objects targeted | Per million objects scanned and evaluated / per condition  | Objects targeted are determined by the count of objects scanned and evaluated against the specified condition. This is based on the configuration of the task assignment, specifically the count of objects in the storage account under the optional prefixes selected, minus the objects under the excluded prefixes.|
| Operations performed | Per million operations performed. | Operations performed are counted based on the number of API calls made on objects, including actions such as deleting, setting immutability, tagging, tiering, setting a legal hold, and other operations supported by Storage Actions.|

For official prices, see [Azure Storage Actions pricing](https://azure.microsoft.com/pricing/details/storage-actions/).

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter. These charges appear in the subscription of the storage account where the task assignment is configured. 

### Azure Storage account meters 

Most actions incur charges for Azure Blob Storage for operations on the storage account. For example, if a storage task assignment instance adds an index tag to a blob, then you'll incur the cost of a [Set Blob Tags](/rest/api/storageservices/set-blob-tags) operation on the target storage account. For information about how each Blob Storage operation maps to a price, see [Map each REST operation to a price](../../storage/blobs/map-rest-apis-transaction-categories.md). To learn more about Blob Storage costs, see [Plan and manage costs for Azure Blob Storage](../../storage/common/storage-plan-manage-costs.md).

Storage Actions is a platform designed to help you with data protection, tagging, retention, cost management and more. It is not exclusively focused on cost optimization. While it provides various operations, only those related to down-tiering or deletion might reduce costs. Other operations could either maintain or increase costs. Make sure to review each task in the storage docs to set your expectations appropriately before setting these tasks up to operate on the storage account.

#### Example calculation

Blob container with 1 million blobs: scan and evaluate conditions on blob container and apply blob immutability to 10% of blobs that meet specified condition
Execution charge = $0.25 + ($0.10 * 1) + ($1 * 0.1) = $0.45

Storage account with 100 million blobs: scan and evaluate condition on all blobs and change blob tier on 1% of blobs that meet specified condition
Execution charge = $0.25 + ($0.10 * 100) + ($1 * 1) = $11.25

Add total cost here to include the cost of operations for each scenario.

#### Sample prices

| Price factor                                   | price   |
|------------------------------------------------|---------|
| Task execution instance charge                 | $0.25   |
| Objects targeted                               | $.10    |
| Operations performed                           | $1.00   |
| Operation cost on storage account (per 10,000) | $0.0044 |

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see [Azure Storage Actions pricing](https://azure.microsoft.com/pricing/details/storage-actions/) and [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). 

### Using Azure Prepayment with Azure Storage Actions

You can pay for Azure Storage Actions charges with your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay for charges for third party products and services including those from the Azure Marketplace.

## Monitor costs

As you use Azure resources with Azure Storage Actions, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) As soon as Azure Storage Actions use starts, costs are incurred and you can see the costs in [cost analysis](../../cost-management/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure Storage Actions costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view Azure Storage Actions costs in cost analysis:

1. Sign in to the Azure portal.
2. Open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the menu. Select **Scope** to switch to a different scope in cost analysis.
3. By default, cost for services are shown in the first donut chart. Select the area in the chart labeled Azure Storage Actions.

Actual monthly costs are shown when you initially open cost analysis. Here's an example showing all monthly usage costs.

image goes here

To narrow costs for a single service, like Azure Storage Actions, select **Add filter** and then select **Service name**. Then, select **Azure Storage Actions**.

Here's an example showing costs for just Azure Storage Actions.

image goes here

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Azure Storage Actions costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../../cost-management/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more information about the filter options available when you create a budget, see [Group and filter options](../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do additional data analysis for costs. For example, a finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

