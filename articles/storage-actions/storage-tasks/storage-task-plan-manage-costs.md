---
title: Plan to manage costs for Azure Storage Actions
description: Learn how to plan for and manage costs for Azure Storage Actions by using cost analysis in the Azure portal.
author: normesta
ms.author: normesta
ms.custom: subject-cost-optimization
ms.service: azure-storage-actions
ms.topic: how-to
ms.date: 04/07/2025
---

# Plan to manage costs for Azure Storage Actions

This article describes how you plan for and manage costs for Azure Storage Actions. Before you deploy the service, you can use the Azure pricing calculator to estimate costs for Azure Storage Actions. After you've started using Azure Storage Actions resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. Costs for Azure Storage Actions are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure Storage Actions, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure Storage Actions

- Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add Azure Storage Actions.

<Image goes here>

## Understand the full billing model for Azure Storage Actions

Azure Storage Actions runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other additional infrastructure costs that might accrue.

### How you're charged for Azure Storage Actions

When you create or use Azure Storage Actions resources, you might get charged for the following meters:

| Meter | Unit |
|---|---|
| Meter1 | Per GB etc. |
| Meter2 | Per GB etc. |

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Storage Actions costs. There's a separate line item for each meter.

### Other costs that might accrue with Azure Storage Actions

When you create resources for Azure Storage Actions, resources for other Azure services are also created. They include:

- <OtherAzureService1>
- <OtherAzureService2>

### Costs might accrue after resource deletion

After you delete Azure Storage Actions resources, the following resources might continue to exist. They continue to accrue costs until you delete them.

- <OtherServiceResource1>
- <OtherServiceResource2>

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

<image goes here>

To narrow costs for a single service, like Azure Storage Actions, select **Add filter** and then select **Service name**. Then, select **Azure Storage Actions**.

Here's an example showing costs for just Azure Storage Actions.

<image goes here>

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Azure Storage Actions costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../../cost-management/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more information about the filter options available when you create a budget, see [Group and filter options](../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do additional data analysis for costs. For example, a finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.


## Other ways to manage and reduce costs for Azure Storage Actions

Put something here.

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](https://learn.microsoft.com/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.

<!-- Insert links to other articles that might help users save and manage costs for you service here.

Create a table of contents entry for the article in the How-to guides section where appropriate. -->