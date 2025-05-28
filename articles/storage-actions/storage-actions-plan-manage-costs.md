---
title: Plan to manage costs for Azure Storage Actions
description: Learn how to plan for and manage costs for Azure Storage Actions.
author: normesta
ms.author: normesta
ms.custom: subject-cost-optimization
ms.service: azure-storage-actions
ms.topic: how-to
ms.date: 05/05/2025
---

# Plan to manage costs for Azure Storage Actions

This article describes how you plan for and manage costs for Azure Storage Actions.

Costs for Azure Storage Actions are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure Storage Actions, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Understand the full billing model for Azure Storage Actions

You're charged the billing meters for Storage Actions as well as the cost of operations performed on storage accounts.  

### Azure Storage Actions meters

Meters apply only when a storage task assignment is executed. Validating a storage task by using the preview capability is free.

| Meter | Unit | Description |
|---|---|---| 
| Task execution instance charge | Per run / per instance | This meter is applied to each storage task assignment execution. If you've schedule an assignment to run repeatedly, then this charge is incurred for each run. |
| Objects targeted | Per million objects scanned and evaluated / per condition  | Objects targeted are determined by the count of objects scanned and evaluated against the specified condition. This is based on the configuration of the task assignment, specifically the count of objects in the storage account under the optional prefixes selected, minus the objects under the excluded prefixes.|
| Operations performed | Per million operations performed. | Operations performed are counted based on the number of API calls made on objects, including actions such as deleting, setting immutability, tagging, tiering, setting a legal hold, and other operations supported by Storage Actions.|

For official prices, see [Azure Storage Actions pricing](https://azure.microsoft.com/pricing/details/storage-actions/).

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter. These charges appear in the subscription of the storage account where the task assignment is configured. 

### Azure Storage account meters 

Most actions incur charges for operations on the storage account. For example, if a storage task adds an index tag to a blob, then you'll incur the cost of a [Set Blob Tags](/rest/api/storageservices/set-blob-tags) operation on the target storage account. For information about how each Blob Storage operation maps to a price, see [Map each REST operation to a price](../storage/blobs/map-rest-apis-transaction-categories.md). To learn more about Blob Storage costs, see [Plan and manage costs for Azure Blob Storage](../storage/common/storage-plan-manage-costs.md).

### Examples

The examples in this section assume the following sample prices:

| Storage Action meter                                            | price   |
|-----------------------------------------------------------------|---------|
| Task execution instance charge                                  | $0.25   |
| Objects targeted                                                | $.10    |
| Operations performed                                            | $1.00   |
| Cost of the Set Blob Immutability Policy operation (per 10,000) | $0.0044 |
| Cost of the Set Blob Tier operation (per 10,000)                | $0.10   |

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the appropriate pricing pages.

#### Example: Applying an immutability policy to blobs

In this example, the [Set Blob Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy) operation is applied to blobs that meet the conditions defined in the storage task. 

A prefix filter narrows the scope of blobs to a single container which contains **1,000,000** blobs, but only **10%** of those blobs meet the conditions of the storage task. 

Using sample prices, the following table estimates the cost of this storage task assignment run. 

| Price factor                                                              | Value       |
|---------------------------------------------------------------------------|-------------|
| **Cost of executing the storage task assignment**                         | **$0.25**   |
| Cost of targeting an individual blob (price / .10)                        | $0.0000001  |
| **Cost to target 1,000,000 blobs**                                        | **$0.10**   |
| Cost of performing a single operation (price / 1,000,000)                 | $0.000001   |
| **Cost to perform operations on 100,000 blobs**                           | **$0.10**   |
| Price of a single Set Blob Immutability Policy operation (price / 10,000) | $0.00000044 |
| **Cost to write (100,000 * price of a single write operation)**           | **$0.044**  |
| **Total cost**                                                            | **$0.49**   |

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the appropriate pricing pages.

#### Example: Transition blobs to a cooler tier

In this example, the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation is applied to blobs that meet the conditions defined in the storage task. 

The prefix filter narrows the scope of blobs to a single container which holds **100,000,000** blobs, but only **1%** of those blobs meet the conditions of the storage task. 

The following table estimates the cost incurred by a storage task assignment instance that moves blobs from the hot tier to the cool tier. 

| Price factor                                                      | Value      |
|-------------------------------------------------------------------|------------|
| **Cost of executing the storage task assignment**                 | **$0.25**  |
| Cost of targeting an individual blob (price / .10)                | $0.0000001 |
| **Cost to target 100,000,000 blobs**                              | **$10.00** |
| Cost of performing a single operation (price / 1,000,000)         | $0.000001  |
| **Cost to perform operations on 1,000,000 blobs**                 | **$1.00**  |
| Price of a single Set Blob Tier operation (price / 10,000)        | $0.00001   |
| **Cost to write (1,000,000 * price of a single write operation)** | **$10.00** |
| **Total cost**                                                    | **$21.25** |

> [!IMPORTANT]
> These prices are meant only as examples, and shouldn't be used to calculate your costs. For official prices, see the appropriate pricing pages.

### Using Azure Prepayment with Azure Storage Actions

You can pay for Azure Storage Actions charges with your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay for charges for third party products and services including those from the Azure Marketplace.

## Create budgets

You can create [budgets](../cost-management/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do additional data analysis for costs. For example, a finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Next steps

- Learn more about Azure Blob Storage costs meters, see [Plan and manage costs for Azure Blob Storage](../storage//common/storage-plan-manage-costs.md)
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

