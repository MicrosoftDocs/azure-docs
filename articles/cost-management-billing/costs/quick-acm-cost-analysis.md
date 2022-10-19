---
title: Quickstart - Explore Azure costs with cost analysis
description: This quickstart helps you use cost analysis to explore and analyze your Azure organizational costs.
author: bandersmsft
ms.author: banders
ms.date: 09/09/2022
ms.topic: quickstart
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
ms.custom: contperf-fy22q2, mode-other
---
# Quickstart: Explore and analyze costs with cost analysis

Before you can properly control and optimize your Azure costs, you need to understand where costs originated within your organization. It's also useful to know how much money your services cost, and in support of which environments and systems. Visibility into the full spectrum of costs is critical to accurately understand organizational spending patterns. You can use spending patterns to enforce cost control mechanisms, like budgets.

In this quickstart, you use cost analysis to explore and analyze your organizational costs. You can view aggregated costs or break them down to understand where costs occur over time and identify spending trends. You can view accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget. You can use budgets to get notified as cost exceeds specific thresholds.

In this quickstart, you learn how to:

- Get started in cost analysis
- Select a cost view
- View costs

## Prerequisites

Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). To view cost data, you need at least read access for your Azure account.

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

## Sign in to Azure

- Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/costanalysis).

## Get started in Cost analysis

To review your costs in cost analysis, open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select **Cost analysis** in the menu.

Use the **Scope** pill to switch to a different scope in cost analysis.

The scope you select is used throughout Cost Management to provide data consolidation and control access to cost information. When you use scopes, you don't multi-select them. Instead, you select a larger scope, which others roll up to, and then filter down to the nested scopes you need. This approach is important to understand because some people may not have access to a single parent scope, which covers multiple nested scopes.

>[!VIDEO https://www.youtube.com/embed/mfxysF-kTFA]

The initial cost analysis view includes the following areas:

**Currently selected view**: Represents the predefined cost analysis view configuration. Each view includes date range, granularity, group by, and filter settings. The default view shows a running total of your costs for the current billing period with the Accumulated costs view, but you can select other built-in views from the menu. The view menu is between the scope pill and the date selector. For details about saved views, see [Save and share customized views](save-share-views.md).

**Filters**: Allow you to limit the results to a subset of your total charges. Filters apply to all summarized totals and charts.

**Cost**: Shows the total usage and purchase costs for the selected period, as they're accrued and will show on your bill. Costs are shown in your billing currency by default. If you have charges in multiple currencies, cost will automatically be converted to USD.

**Forecast**: Shows the total forecasted costs the selected period.

**Budget (if selected)**: Shows the current budget amount for the selected scope, if already defined.

**Granularity**: Indicates how to show data over time. Select **Daily** or **Monthly** to view costs broken down by day or month. Select **Accumulated** to view the running total for the period. Select **None** to view the total cost for the period, with no breakdown.

**Pivot (donut) charts**: Provide dynamic pivots, breaking down the total cost by a common set of standard properties. They show the largest to smallest costs for the current month. 

![Initial view of cost analysis in the Azure portal](./media/quick-acm-cost-analysis/cost-analysis-01.png)

### Understand forecast

Based on your recent usage, cost forecasts show a projection of your estimated costs for the selected time period. If a budget is set up in Cost analysis, you can view when forecasted spend is likely to exceed budget threshold. The forecast model can predict future costs for up to a year. Select filters to view the granular forecasted cost for your selected dimension.

## Select a cost view

Cost analysis has many built-in views, optimized for the most common goals:

View | Answer questions like
--- | ---
Accumulated cost | How much have I spent so far this month? Will I stay within my budget?
Daily cost | Have there been any increases in the costs per day for the last 30 days?
Cost by service | How has my monthly usage vary over the past three invoices?
Cost by resource | Which resources cost the most so far this month?
Invoice details | What charges did I have on my last invoice?
Resources (preview)	| Which resources cost the most so far this month? Are there any subscription cost anomalies?
Resource groups (preview) | Which resource groups cost the most so far this month?
Subscriptions (preview)	| Which subscriptions the most so far this month?
Services (preview)	| Which services cost the most so far this month?
Reservations (preview)	| How much are reservations being used? Which resources are utilizing reservations?

The Cost by resource and Resources views are only available for subscriptions and resource groups.

![View selector showing an example selection for this month](./media/quick-acm-cost-analysis/view-selector.png)

For more information about views, see:
- [Use built-in views in Cost analysis](cost-analysis-built-in-views.md)
- [Save and share customized views](save-share-views.md)
- [Customize views in cost analysis](customize-cost-analysis-views.md)

## View costs

Cost analysis shows **accumulated** costs by default. Accumulated costs include all costs for each day plus the previous days, for a constantly growing view of your daily aggregate costs. This view is optimized to show how you're trending against a budget for the selected time range.

Use the forecast chart view to identify potential budget breaches. When there's a potential budget breach, projected overspending is shown in red. An indicator symbol is also shown in the chart. Hovering over the symbol shows the estimated date of the budget breach.

![Example showing potential budget breach](./media/quick-acm-cost-analysis/budget-breach.png)

There's also the **daily** view that shows costs for each day. The daily view doesn't show a growth trend. The view is designed to show irregularities as cost spikes or dips from day to day. If you've selected a budget, the daily view also shows an estimate of your daily budget.

Here's a daily view of recent spending with spending forecast turned on.
![Daily view showing example daily costs for the current month](./media/quick-acm-cost-analysis/daily-view.png)

When the forecast is disabled, you won't see projected spending for future dates. Also, when you look at costs for past time periods, cost forecast doesn't show costs.

Generally, you can expect to see data or notifications for consumed resources within 24 to 48 hours.

## Next steps

Advance to the first tutorial to learn how to create and manage budgets.

> [!div class="nextstepaction"]
> [Create and manage budgets](tutorial-acm-create-budgets.md)
