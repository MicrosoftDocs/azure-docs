---
title: Plan and manage costs for Azure Storage
description: Learn how to plan for and manage costs for Azure Storage by using cost analysis in Azure portal.
services: storage
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: normesta
ms.subservice: common
ms.custom: subject-cost-optimization
---

# Plan and manage costs for Azure Storage

This article describes how you plan and manage costs for Azure Storage. First, you use the Azure pricing calculator to help plan for storage costs before you add any resources. After you begin using Azure Storage resources, use cost management features to set budgets and monitor costs. You can also review forecasted costs and monitor spending trends to identify areas where you might want to act.

Keep in mind that costs for Azure Storage are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure Storage, you're billed for all Azure services and resources used for your Azure subscription, including the third-party services. After you're familiar with managing costs for Azure Storage, you can apply similar methods to manage costs for all the Azure services used in your subscription.

## Prerequisites

Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md). To view cost data, you need at least read access for your Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management-billing/costs/assign-access-acm-data.md).

## Estimate costs before creating an Azure Storage account

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you create and begin transferring data to an Azure Storage account.

1. On the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) page, choose the **Storage Accounts** tile.

2. Scroll down the page and locate the **Storage Accounts** section of your estimate.

3. Choose options from the drop-down lists. 

   As you modify the value of these drop-down lists, the cost estimate changes. That estimate appears in the upper corner as well as the bottom of the estimate. 
    
   ![Monitor costs with Cost Analysis pane](media/storage-plan-manage-costs/price-calculator-storage-type.png)

   As you change the value of the **Type** drop-down list, other options that appear on this worksheet change as well. Use the links in the **More Info** section to learn more about what each option means and how these options affect the price of storage-related operations. 

4. Modify the remaining options to see their affect on your estimate.

## Use budgets and cost alerts

You can create [budgets](../../cost-management-billing/costs/tutorial-acm-create-budgets.md) to manage costs and create alerts that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. However, they might have limited functionality to manage individual Azure service costs like the cost of Azure Storage because they are designed to track costs at a higher level.

## Monitor costs

As you use Azure resources with Azure Storage, you incur costs. Resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) Costs are incurred as soon as usage of Azure Storage starts. You can see the costs in the [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md) pane in the Azure portal.

When you use cost analysis, you can view Azure Storage costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You can also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends and see where overspending might have occurred. If you've created budgets, you can also easily see where they exceeded.

To view Azure Storage costs in cost analysis:

1. Sign into the [Azure portal](https://portal.azure.com).

2. Open the **Cost Management + Billing** window, select **Cost management** from the menu and then select **Cost analysis**. You can then change the scope for a specific subscription from the **Scope** dropdown.

   ![Monitor costs with Cost Analysis pane](./media/storage-plan-manage-costs/cost-analysis-pane.png)

4. To view only costs for Azure Storage, select **Add filter** and then select **Service name**. Then, choose **storage** from the list. 

   Here's an example showing costs for just Azure Storage:

   ![Monitor storage costs with Cost Analysis pane](./media/storage-plan-manage-costs/cost-analysis-pane-storage.png)

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and by resource group also appear.  

## Next steps

Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md).

See the following articles to learn more on how pricing works with Azure Storage:

- [Azure Storage Overview pricing](https://azure.microsoft.com/pricing/details/storage/)
- [Optimize costs for Blob storage with reserved capacity](../blobs/storage-blob-reserved-capacity.md)
