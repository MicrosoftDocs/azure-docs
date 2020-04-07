---
title: Plan and manage costs for Azure Cosmos DB
description: Learn how to plan for and manage costs for Azure Cosmos DB by using cost analysis in Azure portal.
author: SnehaGunda
ms.author: sngun
ms.custom: subject-cost-optimization
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/02/2020

---

# Plan and manage costs for Azure Cosmos DB

This article describes how you can plan and manage costs for Azure Cosmos DB. First, you use the Azure Cosmos DB capacity calculator to help plan for costs before you add any resources. Next, as you add the Azure resources, you can review the estimated costs. After you’ve started using Azure Cosmos DB resources, use the cost management features to set budgets and monitor costs. You can also review the forecasted costs and identify spending trends to identify areas where you might want to act.

Understand that the costs for Azure Cosmos DB are only a portion of the monthly costs in your Azure bill. If you are using other Azure services, you’re billed for all the Azure services and resources used in your Azure subscription, including the third-party services. This article explains how to plan for and manage costs for Azure Cosmos DB. After you’re familiar with managing costs for Azure Cosmos DB, you can apply similar methods to manage costs for all the Azure services used in your subscription.

## Prerequisites

Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md). To view cost data, you need at least read access for your Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md).

## Review estimated costs with capacity calculator

Use the [Azure Cosmos DB capacity calculator](https://cosmos.azure.com/capacitycalculator/) to estimate costs before you create the resources in an Azure Cosmos account. The capacity calculator is used to get an estimate of the required throughput and cost of your workload. Configuring your Azure Cosmos databases and containers with the right amount of provisioned throughput, or [Request Units (RU/s)](request-units.md), for your workload is essential to optimize the cost and performance. You have to input details such as API type, number of regions, item size, read/write requests per second, total data stored to get a cost estimate. To learn more about the capacity calculator, see the [estimate](estimate-ru-with-capacity-planner.md) article.

The following screenshot shows the throughput and cost estimation by using the capacity calculator:

![Cost estimate in Azure Cosmos DB capacity calculator](./media/plan-manage-costs/capacity-calculator-cost-estimate.png)

## Review estimated costs from the Azure portal

As you create Azure Cosmos DB resources from Azure portal, you can see the estimated costs. Use the following steps to review the cost estimate:

1. Sign into the Azure portal and navigate to your Azure Cosmos account.
1. Go to the **Data Explorer**.
1. Create a new container such as a graph container.
1. Input the throughput required for your workload such as 400 RU/s. After you input the throughput value, you can see the pricing estimate as shown in the following screenshot:

   ![Cost estimate in Azure portal](./media/plan-manage-costs/cost-estimate-portal.png)

If your Azure subscription has a spending limit, Azure prevents you from spending over your credit amount. As you create and use Azure resources, your credits are used. When reach your credit limit, the resources that you deployed are disabled for the rest of that billing period. You can’t change your credit limit, but you can remove it. For more information about spending limits, see [Azure spending limit](../billing/billing-spending-limit.md).

## Use budgets and cost alerts

You can create [budgets](../cost-management/tutorial-acm-create-budgets.md) to manage costs and create alerts that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they’re useful as part of an overall cost monitoring strategy. However, they may have limited functionality to manage individual Azure service costs like the cost of Azure Cosmos DB because they are designed to track costs at a higher level.

## Monitor costs

As you use resources with Azure Cosmos DB, you incur costs. Resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by request unit usage. As soon as usage of Azure Cosmos DB starts, costs are incurred and you can see them in the [cost analysis](../cost-management/quick-acm-cost-analysis.md) pane in the Azure portal.

When you use cost analysis, you can view the Azure Cosmos DB costs in graphs and tables for different time intervals. Some examples are by day, current, prior month, and year. You can also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends and see where overspending might have occurred. If you’ve created budgets, you can also easily see where they exceeded.To view Azure Cosmos DB costs in cost analysis:

1. Sign into the [Azure portal](https://portal.azure.com).

1. Open the **Cost Management + Billing** window, select **Cost management** from the menu and then select **Cost analysis**. You can then change the scope for a specific subscription from the **Scope** dropdown.

1. By default, cost for all services are shown in the first donut chart. Select the area in the chart labeled “Azure Cosmos DB”.

1. To narrow costs for a single service such as Azure Cosmos DB, select **Add filter** and then select **Service name**. Then, choose **Azure Cosmos DB** from the list. Here’s an example showing costs for just Azure Cosmos DB:
 
   ![Monitor costs with Cost Analysis pane](./media/plan-manage-costs/cost-analysis-pane.png)

In the preceding example, you see the current cost for Azure Cosmos DB for the month of Feb. The charts also contain Azure Cosmos DB costs by location and by resource group.

## Next steps

See the following articles to learn more on how pricing works in Azure Cosmos DB:

* [Pricing model in Azure Cosmos DB](how-pricing-works.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](optimize-cost-queries.md)
* [Optimize storage cost in Azure Cosmos DB](optimize-cost-storage.md)