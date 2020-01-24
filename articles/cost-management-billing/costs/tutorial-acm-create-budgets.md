---
title: Tutorial - Create and manage Azure budgets | Microsoft Docs
description: This tutorial helps plan and account for the costs of Azure services that you consume.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 11/12/2019
ms.topic: conceptual
ms.service: cost-management-billing
manager: adwise
ms.custom: seodec18
---

# Tutorial: Create and manage Azure budgets

Budgets in Cost Management help you plan for and drive organizational accountability. With budgets, you can account for the Azure services you consume or subscribe to during a specific period. They help you inform others about their spending to proactively manage costs, and to monitor how spending progresses over time. When the budget thresholds you've created are exceeded, only notifications are triggered. None of your resources are affected and your consumption isn't stopped. You can use budgets to compare and track spending as you analyze costs.

Cost and usage data is typically available within 12-16 hours and budgets are evaluated against these costs every four hours. Email notifications are normally received within 12-16 hours.

Budgets reset automatically at the end of a period (monthly, quarterly, or annually) for the same budget amount when you select an expiration date in the future. Because they reset with the same budget amount, you need to create separate budgets when budgeted currency amounts differ for future periods.

The examples in this tutorial walk you through creating and editing a budget for an Azure Enterprise Agreement (EA) subscription.

Watch the [Apply budgets to subscriptions using the Azure portal](https://www.youtube.com/watch?v=UrkHiUx19Po) video to see how you can create budgets in Azure to monitor spending.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a budget in the Azure portal
> * Edit a budget

## Prerequisites

Budgets are supported for a variety of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). To view budgets, you need at least read access for your Azure account.

 For Azure EA subscriptions, you must have read access to view budgets. To create and manage budgets, you must have contributor permission. You can create individual budgets for EA subscriptions and resource groups. However, you cannot create budgets for EA billing accounts.

The following Azure permissions, or scopes, are supported per subscription for budgets by user and group. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

- Owner – Can create, modify, or delete budgets for a subscription.
- Contributor and Cost Management contributor – Can create, modify, or delete their own budgets. Can modify the budget amount for budgets created by others.
- Reader and Cost Management reader – Can view budgets that they have permission to.

For more information about assigning permission to Cost Management data, see [Assign access to Cost Management data](../../cost-management/assign-access-acm-data.md).

## Sign in to Azure

- Sign in to the Azure portal at https://portal.azure.com.

## Create a budget in the Azure portal

You can create an Azure subscription budget for a monthly, quarterly, or annual period. Your navigational content in the Azure portal determines whether you create a budget for a subscription or for a management group.

To create or view a budget, open the desired scope in the Azure portal and select **Budgets** in the menu. For example, navigate to **Subscriptions**, select a subscription from the list, and then select **Budgets** in the menu. Use the **Scope** pill to switch to a different scope, like a management group, in Budgets. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

After you create budgets, they show a simple view of your current spending against them.

Click **Add**.

![Example showing a list of budgets already created](./media/tutorial-acm-create-budgets/budgets01.png)

In the **Create budget** window, make sure that the scope shown is correct. Choose any filters that you want to add. Filters allow you to create budgets on specific costs, such as resource groups in a subscription or a service like virtual machines. Any filter you can use in cost analysis can also be applied to a budget.

After you've identified your scope and filters, type a budget name. Then, choose a monthly, quarterly or annual budget reset period. This reset period determines the time window that's analyzed by the budget. The cost evaluated by the budget starts at zero at the beginning of each new period. When you create a quarterly budget, it works in the same way as a monthly budget. The difference is that the budget amount for the quarter is evenly divided among the three months of the quarter. An annual budget amount is evenly divided among all 12 months of the calendar year.

If you have a Pay-As-You-Go, MSDN, or Visual Studio subscription, your invoice billing period might not align to the calendar month. For those subscription types and resource groups, you can create a budget that's aligned to your invoice period or to calendar months. To create a budget aligned to your invoice period, select a reset period of **Billing month**, **Billing quarter**, or **Billing year**. To create a budget aligned to the calendar month, select a reset period of **Monthly**, **Quarterly**, or **Annually**.

Next, identify the expiration date when the budget becomes invalid and stops evaluating your costs.

Based on the fields chosen in the budget so far, a graph is shown to help you select a threshold to use for your budget. The suggested budget is based on the highest forecasted cost that you might incur in future periods. You can change the budget amount.

![Example showing budget creation with monthly cost data ](./media/tutorial-acm-create-budgets/monthly-budget01.png)

After you configure the budget amount, click **Next** to configure budget alerts. Budgets require at least one cost threshold (% of budget) and a corresponding email address. You can optionally include up to five thresholds and five email addresses in a single budget. When a budget threshold is met, email notifications are normally received in less than 20 hours. For more information about notifications, see [Use cost alerts](../../cost-management/cost-mgt-alerts-monitor-usage-spending.md). In the example below, an email alert gets generated when 90% of the budget is reached. If you create a budget with the Budgets API, you can also assign roles to people to receive alerts. Assigning roles to people isn't supported in the Azure portal. For more about the Azure budgets API, see [Budgets API](/rest/api/consumption/budgets).

![Example showing alert conditions](./media/tutorial-acm-create-budgets/monthly-budget-alert.png)

After you create a budget, it is shown in cost analysis. Viewing your budget in relation to your spending trend is one of the first steps when you start to [analyze your costs and spending](../../cost-management/quick-acm-cost-analysis.md).

![Example budget and spending shown in cost analysis](./media/tutorial-acm-create-budgets/cost-analysis.png)

In the preceding example, you created a budget for a subscription. However, you can also create a budget for a resource group. If you want to create a budget for a resource group, navigate to **Cost Management + Billing** &gt; **Subscriptions** &gt; select a subscription > **Resource groups** > select a resource group > **Budgets** > and then **Add** a budget.

## Trigger an action group

When you create or edit a budget for a subscription or resource group scope, you can configure it to call an action group. The action group can perform a variety of different actions when your budget threshold is met. Action Groups are currently only supported for subscription and resource group scopes. For more information about Action Groups, see [Create and manage action groups in the Azure portal](../../azure-monitor/platform/action-groups.md). For more information about using budget-based automation with action groups, see [Manage costs with Azure budgets](../manage/cost-management-budget-scenario.md).



To create or update action groups, click **Manage action groups** while you're creating or editing a budget.

![Example of creating a budget to show Manage action groups](./media/tutorial-acm-create-budgets/manage-action-groups01.png)


Next, click **Add action group** and create the action group.


![Image of the Add action group box](./media/tutorial-acm-create-budgets/manage-action-groups02.png)

After the action group is created, close the box to return to your budget.

Configure your budget to use your action group when an individual threshold is met. Up to five different thresholds are supported.

![Example showing action group selection for an alert condition](./media/tutorial-acm-create-budgets/manage-action-groups03.png)

The following example shows budget thresholds set to 50%, 75% and 100%. Each is configured to trigger the specified actions within the designated action group.

![Example showing alert conditions configured with various action groups and type of actions](./media/tutorial-acm-create-budgets/manage-action-groups04.png)

Budget integration with action groups only works for action groups that have the common alert schema disabled. For more information about disabling the schema, see [How do I enable the common alert schema?](../../azure-monitor/platform/alerts-common-schema.md#how-do-i-enable-the-common-alert-schema)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a budget in the Azure portal
> * Edit a budget

Advance to the next tutorial to create a recurring export for your cost management data.

> [!div class="nextstepaction"]
> [Create and manage exported data](tutorial-export-acm-data.md)
