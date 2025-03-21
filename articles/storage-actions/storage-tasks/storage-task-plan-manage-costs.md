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

#### Example calculations

The examples in this section use the following sample prices. These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the appropriate pricing pages. 

| Storage Action meter           | price |
|--------------------------------|-------|
| Task execution instance charge | $0.25 |
| Objects targeted               | $.10  |
| Operations performed           | $1.00 |

| Blob Storage account meter             | Hot tier price | Cool tier price | Cold tier price | Archive tier price |
|----------------------------------------|----------------|-----------------|-----------------|--------------------|
| All other operations (per 10,000)<sup>1</sup>      | $0.0044        | $0.0044         | $0.0052         | $.0044             |
| Price of write operations (per 10,000)<sup>1</sup> | $0.055         | $0.10           | $0.18           | $0.11              |

<sup>1</sup>    This is not the name of a specific operation. It is the name of a _type_ of operation. The Blob Storage pricing pages list prices only by operation _type_ and not by each individual operation. Therefore, to determine the price of an operation, you must first determine how that operation is classified in terms of its type. For a complete list, see [Map each REST operation to a price](../../storage/blobs/map-rest-apis-transaction-categories.md).

##### Example 1: Applying an immutability policy to blobs

In this example, the [Set Blob Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy) operation is applied to blobs that meet the conditions defined in the storage task. The prefix filter of the storage task assignment narrows the scope of blobs in the target storage account to a container which contains 1,000,000 blobs. Only 10% of those blobs in that container meets the conditions of the storage task. Therefore, the [Set Blob Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy) operation is applied to only 100,000 blobs (1,000,000 * .10). The [Set Blob Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy) operation is billed as an "Other" operation on the hot access tier. 

Using sample prices, the following table estimates the cost of this storage task assignment run. 

| Price factor                                                    | Value      |
|-----------------------------------------------------------------|------------|
| **Cost of executing the storage task assignment**               | **$0.25**  |
| Cost of targeting an individual blob (price / .10)              | $0.0000001 |
| **Cost to target 1,000,000 blobs**                              | **$0.10**  |
| Cost of performing a single operation (price / 1,000,000)       | $0.000001  |
| **Cost to perform operations on 100,000 blobs**                 | **$0.10    |
| Price of a single write operation (price / 10,000)              | $0.0000055 |
| **Cost to write (100,000 * price of a single write operation)** | **$0.55**  |
| **Total cost**                                                  | **$1.00**  |

In this example, only 45% of the total cost comes from Azure Storage Actions cost meters and 55% of the total cost from Blob Storage cost meters.

##### Example 2: Transition blobs to a cooler tier

The operation used in this example is [Set Blob Tier](/rest/api/storageservices/set-blob-tier). When a blob is moved to a cooler tier, the operation is billed as a write operation to the destination tier. In this example, storage task moves blobs that meet the condition of the task from the hot tier to the cool tier. Therefore, the operation is billed as a write operation on the cool tier. 

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

