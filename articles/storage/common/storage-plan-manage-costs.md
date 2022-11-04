---
title: Plan and manage costs for Azure Blob Storage
description: Learn how to plan for and manage costs for Azure Blob Storage by using cost analysis in Azure portal.
services: storage
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 06/21/2021
ms.author: normesta
ms.subservice: common
ms.custom: subject-cost-optimization
---

# Plan and manage costs for Azure Blob Storage

This article helps you plan and manage costs for Azure Blob Storage. First, estimate costs by using the Azure pricing calculator. After you create your storage account, optimize the account so that you pay only for what you need. Use cost management features to set budgets and monitor costs. You can also review forecasted costs, and monitor spending trends to identify areas where you might want to act.

Keep in mind that costs for Blob Storage are only a portion of the monthly costs in your Azure bill. Although this article explains how to estimate and manage costs for Blob Storage, you're billed for all Azure services and resources used for your Azure subscription, including the third-party services. After you're familiar with managing costs for Blob Storage, you can apply similar methods to manage costs for all the Azure services used in your subscription.

## Estimate costs

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you create and begin transferring data to an Azure Storage account.

1. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) page, choose the **Storage Accounts** tile.

2. Scroll down the page and locate the **Storage Accounts** section of your estimate.

3. Choose options from the drop-down lists.

   As you modify the value of these drop-down lists, the cost estimate changes. That estimate appears in the upper corner as well as the bottom of the estimate.

   ![Screenshot showing your estimate](media/storage-plan-manage-costs/price-calculator-storage-type.png)

   As you change the value of the **Type** drop-down list, other options that appear on this worksheet change as well. Use the links in the **More Info** section to learn more about what each option means and how these options affect the price of storage-related operations.

4. Modify the remaining options to see their affect on your estimate.

> [!TIP]
> To estimate the cost of archiving data that is rarely used, see [Estimate the cost of archiving data](../blobs/archive-cost-estimation.md).

## Understand the full billing model for Azure Blob Storage

Azure Blob Storage runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other additional infrastructure costs that might accrue.

### How you're charged for Azure Blob Storage

When you create or use Blob Storage resources, you'll be charged for the following meters:

| Meter | Unit |
|---|---|
| Data storage | Per GB / per month|
| Operations | Per transaction |
| Data transfer | Per GB |
| Metadata | Per GB / per month<sup>1 |
| Blob index tags | Per tag<sup>2  |
| Change feed | Per logged change<sup>2 |
| Encryption scopes | Per month<sup>2 |
| Query acceleration | Per GB scanned & Per GB returned |

<sup>1</sup> Applies only to accounts that have a hierarchical namespace.<br />
<sup>2</sup> Applies only if you enable the feature.<br />

Data traffic might also incur networking costs. See the [Bandwidth pricing](https://azure.microsoft.com/pricing/details/data-transfers/).

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Blob Storage costs. There's a separate line item for each meter.

Data storage and metadata are billed per GB on a monthly basis. For data and metadata stored for less than a month, you can estimate the impact on your monthly bill by calculating the cost of each GB per day. You can use a similar approach to estimating the cost of encryption scopes that are in use for less than a month. The number of days in any given month varies. Therefore, to obtain the best approximation of your costs in a given month, make sure to divide the monthly cost by the number of days that occur in that month.

### Finding the unit price for each meter

To find unit prices, open the correct pricing page. If you've enabled the hierarchical namespace feature on your account, see the [Azure Data Lake Storage Gen2 pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page. If you haven't enabled this feature, see the [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

In the pricing page, apply the appropriate redundancy, region, and currency filters. Prices for each meter appear in a table. Prices differ based on other settings in your account such as data redundancy options, access tier and performance tier.

### Flat namespace accounts and transaction pricing

Clients can make a request by using either the Blob Storage endpoint or the Data Lake Storage endpoint of your account. To learn more about storage account endpoints, see [Storage account endpoints](storage-account-overview.md#storage-account-endpoints).

Transaction prices that appear in the [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page apply only to requests that use the Blob Storage endpoint (For example: `https://<storage-account>.blob.core.windows.net`). The listed prices do not apply to requests that use the Data Lake Storage Gen2 endpoint (For example: `https://<storage-account>.dfs.core.windows.net`). For the transaction price of those requests, open the [Azure Data Lake Storage Gen2 pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page and select the **Flat Namespace** option.

> [!div class="mx-imgBorder"]
> ![flat namespace option](media/storage-plan-manage-costs/select-flat-namespace.png)

Requests to the Data Lake Storage Gen2 endpoint can originate from any of the following sources:

- Workloads that use the Azure Blob File System driver or [ABFS driver](https://hadoop.apache.org/docs/stable/hadoop-azure/abfs.html).

- REST calls that use the [Azure Data Lake Store REST API](/rest/api/storageservices/data-lake-storage-gen2)

- Applications that use Data Lake Storage Gen2 APIs from an Azure Storage client library.

### Using Azure Prepayment with Azure Blob Storage

You can pay for Azure Blob Storage charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third party products and services including those from the Azure Marketplace.

## Optimize costs

Consider using these options to reduce costs.

- Reserve storage capacity

- Organize data into access tiers

- Automatically move data between access tiers

This section covers each option in more detail.

#### Reserve storage capacity

You can save money on storage costs for blob data with Azure Storage reserved capacity. Azure Storage reserved capacity offers you a discount on capacity for block blobs and for Azure Data Lake Storage Gen2 data in standard storage accounts when you commit to a reservation for either one year or three years. A reservation provides a fixed amount of storage capacity for the term of the reservation. Azure Storage reserved capacity can significantly reduce your capacity costs for block blobs and Azure Data Lake Storage Gen2 data.

To learn more, see [Optimize costs for Blob Storage with reserved capacity](../blobs/storage-blob-reserved-capacity.md).

#### Organize data into access tiers

You can reduce costs by placing blob data into the most cost effective access tiers. Choose from three tiers that are designed to optimize your costs around data use. For example, the *hot* tier has a higher storage cost but lower access cost. Therefore, if you plan to access data frequently, the hot tier might be the most cost-efficient choice. If you plan to access data less frequently, the *cold* or *archive* tier might make the most sense because it raises the cost of accessing data while reducing the cost of storing data. See [Estimate the cost of archiving data](../blobs/archive-cost-estimation.md).

To learn more, see [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md?tabs=azure-portal).

#### Automatically move data between access tiers

Use lifecycle management policies to periodically move data between tiers to save the most money. These policies can move data to by using rules that you specify. For example, you might create a rule that moves blobs to the archive tier if that blob hasn't been modified in 90 days. By creating policies that adjust the access tier of your data, you can design the least expensive storage options for your needs.

To learn more, see [Manage the Azure Blob Storage lifecycle](../blobs/lifecycle-management-overview.md?tabs=azure-portal)

## Create budgets

You can create [budgets](../../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create alerts that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. However, they might have limited functionality to manage individual Azure service costs like the cost of Azure Storage because they are designed to track costs at a higher level.

## Monitor costs

As you use Azure resources with Azure Storage, you incur costs. Resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) Costs are incurred as soon as usage of Azure Storage starts. You can see the costs in the [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) pane in the Azure portal.

When you use cost analysis, you can view Azure Storage costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You can also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends and see where overspending might have occurred. If you've created budgets, you can also easily see where they exceeded.

> [!NOTE]
> Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for your Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

To view Azure Storage costs in cost analysis:

1. Sign into the [Azure portal](https://portal.azure.com).

2. Open the **Cost Management + Billing** window, select **Cost management** from the menu and then select **Cost analysis**. You can then change the scope for a specific subscription from the **Scope** dropdown.

   ![Screenshot showing scope](./media/storage-plan-manage-costs/cost-analysis-pane.png)

4. To view only costs for Azure Storage, select **Add filter** and then select **Service name**. Then, choose **storage** from the list.

   Here's an example showing costs for just Azure Storage:

   ![Screenshot showing filter by storage](./media/storage-plan-manage-costs/cost-analysis-pane-storage.png)

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and by resource group also appear. 
You can add other filters as well (For example: a filter to see costs for specific storage accounts).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do additional data analysis for costs. For example, a finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## FAQ

**If I use Azure Storage for only a few days a month, is the cost prorated?**

Storage capacity is billed in units of the average daily amount of data stored, in gigabytes (GB), over a monthly period. For example, if you consistently used 10 GB of storage for the first half of the month, and none for the second half of the month, you would be billed for your average usage of 5 GB of storage.

## Next steps

- Learn more on how pricing works with Azure Storage. See [Azure Storage Overview pricing](https://azure.microsoft.com/pricing/details/storage/).
- [Optimize costs for Blob Storage with reserved capacity](../blobs/storage-blob-reserved-capacity.md).
- Learn [how to optimize your cloud investment with Azure Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
