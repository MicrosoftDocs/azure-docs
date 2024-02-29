---
title: Plan to manage costs for Azure OpenAI Service
description: Learn how to plan for and manage costs for Azure OpenAI by using cost analysis in the Azure portal.
author: mrbullwinkle
ms.author: mbullwin
ms.custom: subject-cost-optimization
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 08/22/2023
---


# Plan to manage costs for Azure OpenAI Service

This article describes how you can plan for and manage costs for Azure OpenAI Service. Before you deploy the service, use the Azure pricing calculator to estimate costs for Azure OpenAI. Later, as you deploy Azure resources, review the estimated costs. After you start using Azure OpenAI resources, use Cost Management features to set budgets and monitor costs.

You can also review forecasted costs and identify spending trends to identify areas where you might want to act. Costs for Azure OpenAI Service are only a portion of the monthly costs in your Azure bill. Although this article is about planning for and managing costs for Azure OpenAI, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure OpenAI

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the costs of using Azure OpenAI.

## Understand the Azure OpenAI full billing model

Azure OpenAI Service runs on Azure infrastructure that accrues costs when you deploy new resources. There could be other infrastructure costs that might accrue. The following sections describe how you're charged for Azure OpenAI Service.

### Base series and Codex series models

Azure OpenAI base series and Codex series models are charged per 1,000 tokens. Costs vary depending on which model series you choose: Ada, Babbage, Curie, Davinci, or Code-Cushman.

Azure OpenAI models understand and process text by breaking it down into tokens. For reference, each token is roughly four characters for typical English text.

Token costs are for both input and output. For example, suppose you have a 1,000 token JavaScript code sample that you ask an Azure OpenAI model to convert to Python. You would be charged approximately 1,000 tokens for the initial input request sent, and 1,000 more tokens for the output that is received in response for a total of 2,000 tokens.

In practice, for this type of completion call, the token input/output wouldn't be perfectly 1:1. A conversion from one programming language to another could result in a longer or shorter output depending on many factors. One such factor is the value assigned to the `max_tokens` parameter.

### Base Series and Codex series fine-tuned models

Azure OpenAI fine-tuned models are charged based on three factors:

- Training hours
- Hosting hours
- Inference per 1,000 tokens

The hosting hours cost is important to be aware of since after a fine-tuned model is deployed, it continues to incur an hourly cost regardless of whether you're actively using it. Monitor fine-tuned model costs closely.

[!INCLUDE [Fine-tuning deletion](../includes/fine-tune.md)]

### Other costs that might accrue with Azure OpenAI Service

Enabling capabilities such as sending data to Azure Monitor Logs and alerting incurs extra costs for those services. These costs are visible under those other services and at the subscription level, but aren't visible when scoped just to your Azure OpenAI resource.

### Using Azure Prepayment with Azure OpenAI Service

You can pay for Azure OpenAI Service charges with your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay for charges for third party products and services including those products and services found in the Azure Marketplace.

### HTTP Error response code and billing status in Azure OpenAI Service

If the service performs processing, you may be charged even if the status code is not successful (not 200).
For example, a 400 error due to a content filter or input limit, or a 408 error due to a timeout.

If the service doesn't perform processing, you won't be charged.
For example, a 401 error due to authentication or a 429 error due to exceeding the Rate Limit.

## Monitor costs

As you use Azure resources with Azure OpenAI, you incur costs. Azure resource usage unit costs vary by time intervals, such as seconds, minutes, hours, and days, or by unit usage, such as bytes and megabytes. As soon as Azure OpenAI use starts, costs can be incurred and you can see the costs in the [cost analysis](../../../cost-management/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure OpenAI costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. You can see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view Azure OpenAI costs in cost analysis:

1. Sign in to the Azure portal.
2. Select one of your Azure OpenAI resources.
3. Under **Resource Management** select **Cost analysis**
4. By default, cost analysis is scoped to the individual Azure OpenAI resource.

:::image type="content" source="../media/manage-costs/resource-view.png" alt-text="Screenshot of cost analysis dashboard scoped to an Azure OpenAI resource." lightbox="../media/manage-costs/resource-view.png":::

To understand the breakdown of what makes up that cost, it can help to modify **Group by** to **Meter** and switching the chart type to **Line**. You can now see that for this particular resource, the source of the costs comes from three different model series with **Text-Davinci Tokens** that represent the bulk of the costs.  

:::image type="content" source="../media/manage-costs/grouping.png" alt-text="Screenshot of cost analysis dashboard with group by set to meter." lightbox="../media/manage-costs/grouping.png":::

It's important to understand scope when you evaluate costs associated with Azure OpenAI. If your resources are part of the same resource group, you can scope Cost Analysis at that level to understand the effect on costs. If your resources are spread across multiple resource groups, you can scope to the subscription level.

When scoped at a higher level, you often need to add more filters to focus on Azure OpenAI usage. When scoped at the subscription level, you see many other resources that you might not care about in the context of Azure OpenAI cost management. When you scope at the subscription level, we recommend that you navigate to the full **Cost analysis tool** under the **Cost Management** service.

Here's an example of how to use the **Cost analysis tool** to see your accumulated costs for a subscription or resource group:

1. Search for *Cost Management* in the top Azure search bar to navigate to the full service experience, which includes more options such as creating budgets.
1. If necessary, select **change** if the **Scope:** isn't pointing to the resource group or subscription you want to analyze.
1. On the left, select **Reporting + analytics** > **Cost analysis**.
1. On the **All views** tab, select **Accumulated costs**.

:::image type="content" source="../media/manage-costs/cost-analyzer.png" alt-text="Screenshot of cost analysis dashboard showing how to access accumulated costs." lightbox="../media/manage-costs/cost-analyzer.png":::

The cost analysis dashboard shows the accumulated costs that are analyzed depending on what you've specified for **Scope**.

:::image type="content" source="../media/manage-costs/subscription.png" alt-text="Screenshot of cost analysis dashboard with scope set to subscription." lightbox="../media/manage-costs/subscription.png":::

If you try to add a filter by service, you find that you can't find Azure OpenAI in the list. This situation occurs because Azure OpenAI has commonality with a subset of Azure AI services where the service level filter is **Cognitive Services**. If you want to see all Azure OpenAI resources across a subscription without any other type of Azure AI services resources, instead scope to **Service tier: Azure OpenAI**:

:::image type="content" source="../media/manage-costs/service-tier.png" alt-text="Screenshot of cost analysis dashboard with service tier highlighted." lightbox="../media/manage-costs/service-tier.png":::

## Create budgets

You can create [budgets](../../../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. You create budgets and alerts for Azure subscriptions and resource groups. They're useful as part of an overall cost monitoring strategy.

You can create budgets with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more information about the filter options available when you create a budget, see [Group and filter options](../../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

> [!IMPORTANT]
> While OpenAI has an option for hard limits that prevent you from going over your budget, Azure OpenAI doesn't currently provide this functionality. You can kick off automation from action groups as part of your budget notifications to take more advanced actions, but this requires additional custom development on your part.  

## Export cost data

You can also [export your cost data](../../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account, which is helpful when you need others to do extra data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. We recommend exporting cost data as the way to retrieve cost datasets.

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
